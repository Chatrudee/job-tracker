from django.conf import settings
from django.db.models import Count, Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import JobApplication
from .serializers import (
    JobApplicationSerializer,
    JobApplicationListSerializer,
    StatsSerializer,
)


# ── Helper: กรอง jobs เฉพาะของ user ที่ login ──────────────
def user_jobs(request):
    return JobApplication.objects.filter(user=request.user)


# ══════════════════════════════════════════════════════════
# CRUD Views
# ══════════════════════════════════════════════════════════

class JobListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/jobs/  → ดู job ทั้งหมดของ user (พร้อม filter)
    POST /api/jobs/  → เพิ่ม job ใหม่
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        # GET → ใช้ ListSerializer (ข้อมูลย่อ เร็วกว่า)
        # POST → ใช้ full Serializer
        if self.request.method == 'GET':
            return JobApplicationListSerializer
        return JobApplicationSerializer

    def get_queryset(self):
        queryset = user_jobs(self.request)

        # filter by status: ?status=interviewing
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # search by company or position: ?search=Google
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(company__icontains=search) |
                Q(position__icontains=search)
            )

        return queryset


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/jobs/{id}/  → ดู job เดียว (full detail)
    PATCH  /api/jobs/{id}/  → แก้ไข (partial update)
    DELETE /api/jobs/{id}/  → ลบ
    """
    serializer_class   = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # สำคัญมาก — กรองเฉพาะ job ของ user ที่ login
        # ป้องกัน user A เข้าถึง job ของ user B
        return user_jobs(self.request)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


# ══════════════════════════════════════════════════════════
# Stats View
# ══════════════════════════════════════════════════════════

class StatsView(APIView):
    """
    GET /api/jobs/stats/
    คืน aggregate stats สำหรับ dashboard
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        jobs = user_jobs(request)
        total = jobs.count()

        # aggregate แต่ละ status ใน query เดียว
        counts = jobs.aggregate(
            applied      = Count('id', filter=Q(status='applied')),
            interviewing = Count('id', filter=Q(status='interviewing')),
            offered      = Count('id', filter=Q(status='offered')),
            rejected     = Count('id', filter=Q(status='rejected')),
            withdrawn    = Count('id', filter=Q(status='withdrawn')),
        )

        # success rate = offered / total (ป้องกัน division by zero)
        success_rate = round(
            (counts['offered'] / total * 100) if total > 0 else 0,
            1
        )

        data = {
            'total':        total,
            'success_rate': success_rate,
            **counts
        }

        serializer = StatsSerializer(data)
        return Response(serializer.data)


# ══════════════════════════════════════════════════════════
# Claude AI View
# ══════════════════════════════════════════════════════════

class AISuggestView(APIView):
    """
    POST /api/jobs/{id}/ai-suggest/
    ส่งข้อมูล job ให้ Claude แล้วรับ follow-up message กลับ
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        # ดึง job — ต้องเป็นของ user เท่านั้น
        try:
            job = user_jobs(request).get(pk=pk)
        except JobApplication.DoesNotExist:
            return Response(
                {'error': 'Job application not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # เช็คว่ามี API key ไหม
        api_key = settings.ANTHROPIC_API_KEY
        if not api_key:
            return Response(
                {'error': 'AI feature is not configured. Please set ANTHROPIC_API_KEY.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # สร้าง prompt จากข้อมูล job
        prompt = f"""You are a professional career coach helping someone follow up on their job application.

Job Details:
- Company: {job.company}
- Position: {job.position}
- Status: {job.get_status_display()}
- Applied: {job.applied_date} ({job.days_since_applied} days ago)
- Notes: {job.notes or 'No notes provided'}

Please write a professional follow-up email for this job application. Include:
1. A subject line
2. A concise, professional email body (3-4 paragraphs max)
3. Keep it warm but professional
4. Be specific to the company and position

Format your response as:
SUBJECT: [subject line here]

[email body here]"""

        try:
            import anthropic
            client = anthropic.Anthropic(api_key=api_key)

            message = client.messages.create(
                model='claude-opus-4-6',
                max_tokens=1024,
                messages=[{'role': 'user', 'content': prompt}]
            )

            suggestion = message.content[0].text

            # แยก subject และ body ออกจากกัน
            lines = suggestion.strip().split('\n')
            subject = ''
            body_lines = []
            in_body = False

            for line in lines:
                if line.startswith('SUBJECT:'):
                    subject = line.replace('SUBJECT:', '').strip()
                elif subject and line.strip():
                    in_body = True
                if in_body:
                    body_lines.append(line)

            return Response({
                'subject': subject,
                'body':    '\n'.join(body_lines).strip(),
                'full':    suggestion,
                'job': {
                    'company':  job.company,
                    'position': job.position,
                    'status':   job.status,
                }
            })

        except Exception as e:
            return Response(
                {'error': f'AI service error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
