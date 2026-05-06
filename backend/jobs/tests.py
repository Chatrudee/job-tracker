from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import JobApplication
import datetime


def get_token(user):
    """Helper — สร้าง JWT token สำหรับ user"""
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)


class JobApplicationModelTest(APITestCase):
    """Test JobApplication Model"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.job = JobApplication.objects.create(
            user=self.user,
            company='Google',
            position='Software Engineer',
            status='applied',
            applied_date=datetime.date.today(),
        )

    def test_job_created_successfully(self):
        self.assertEqual(self.job.company, 'Google')
        self.assertEqual(self.job.status, 'applied')

    def test_str_representation(self):
        self.assertIn('Google', str(self.job))
        self.assertIn('Software Engineer', str(self.job))

    def test_days_since_applied(self):
        self.assertGreaterEqual(self.job.days_since_applied, 0)

    def test_default_status_is_applied(self):
        job = JobApplication.objects.create(
            user=self.user,
            company='Meta',
            position='Backend Engineer',
            applied_date=datetime.date.today(),
        )
        self.assertEqual(job.status, 'applied')


class AuthAPITest(APITestCase):
    """Test Authentication endpoints"""

    def test_register_success(self):
        data = {
            'username':   'newuser',
            'email':      'new@test.com',
            'password':   'StrongPass123!',
            'password2':  'StrongPass123!',
            'first_name': 'New',
            'last_name':  'User',
        }
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])

    def test_register_password_mismatch(self):
        data = {
            'username':  'user2',
            'password':  'Pass123!',
            'password2': 'Different123!',
        }
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_success(self):
        User.objects.create_user(username='loginuser', password='pass123!')
        response = self.client.post('/api/auth/login/', {
            'username': 'loginuser',
            'password': 'pass123!'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)


class JobAPITest(APITestCase):
    """Test Job Application CRUD endpoints"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='jobuser', password='pass123!'
        )
        self.other_user = User.objects.create_user(
            username='other', password='pass123!'
        )
        # ตั้ง JWT token
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {get_token(self.user)}'
        )
        self.job = JobApplication.objects.create(
            user=self.user,
            company='Amazon',
            position='DevOps Engineer',
            status='applied',
            applied_date=datetime.date.today(),
        )
        # job ของ user อื่น — ต้องเข้าถึงไม่ได้
        self.other_job = JobApplication.objects.create(
            user=self.other_user,
            company='Apple',
            position='iOS Developer',
            status='interviewing',
            applied_date=datetime.date.today(),
        )

    def test_get_job_list(self):
        response = self.client.get('/api/jobs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_sees_only_own_jobs(self):
        response = self.client.get('/api/jobs/')
        # ต้องเห็นแค่ 1 job (ของตัวเอง ไม่เห็น other_job)
        results = response.data.get('results', response.data)
        companies = [j['company'] for j in results]
        self.assertIn('Amazon', companies)
        self.assertNotIn('Apple', companies)

    def test_create_job(self):
        data = {
            'company':      'Netflix',
            'position':     'React Developer',
            'status':       'applied',
            'applied_date': '2025-05-01',
        }
        response = self.client.post('/api/jobs/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['company'], 'Netflix')

    def test_get_job_detail(self):
        response = self.client.get(f'/api/jobs/{self.job.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company'], 'Amazon')

    def test_cannot_access_other_user_job(self):
        response = self.client.get(f'/api/jobs/{self.other_job.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_job_status(self):
        response = self.client.patch(
            f'/api/jobs/{self.job.id}/',
            {'status': 'interviewing'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'interviewing')

    def test_delete_job(self):
        response = self.client.delete(f'/api/jobs/{self.job.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(JobApplication.objects.filter(user=self.user).count(), 0)

    def test_filter_by_status(self):
        # สร้าง job interviewing เพิ่ม
        JobApplication.objects.create(
            user=self.user, company='Spotify',
            position='Backend', status='interviewing',
            applied_date=datetime.date.today()
        )
        response = self.client.get('/api/jobs/?status=interviewing')
        results = response.data.get('results', response.data)
        for job in results:
            self.assertEqual(job['status'], 'interviewing')

    def test_unauthenticated_cannot_access(self):
        self.client.credentials()  # ลบ token ออก
        response = self.client.get('/api/jobs/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class StatsAPITest(APITestCase):
    """Test Stats endpoint"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='statsuser', password='pass123!'
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {get_token(self.user)}'
        )
        today = datetime.date.today()
        JobApplication.objects.bulk_create([
            JobApplication(user=self.user, company='A', position='Dev', status='applied',      applied_date=today),
            JobApplication(user=self.user, company='B', position='Dev', status='interviewing', applied_date=today),
            JobApplication(user=self.user, company='C', position='Dev', status='offered',      applied_date=today),
            JobApplication(user=self.user, company='D', position='Dev', status='rejected',     applied_date=today),
        ])

    def test_stats_returns_correct_totals(self):
        response = self.client.get('/api/jobs/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total'], 4)
        self.assertEqual(response.data['applied'], 1)
        self.assertEqual(response.data['interviewing'], 1)
        self.assertEqual(response.data['offered'], 1)
        self.assertEqual(response.data['rejected'], 1)

    def test_success_rate_calculation(self):
        response = self.client.get('/api/jobs/stats/')
        # 1 offered / 4 total = 25%
        self.assertEqual(response.data['success_rate'], 25.0)
