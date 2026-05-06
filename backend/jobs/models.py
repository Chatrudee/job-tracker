from django.db import models
from django.contrib.auth.models import User


class JobApplication(models.Model):
    """
    Model หลักของ project — เก็บข้อมูลการสมัครงานแต่ละที่
    แต่ละ record ผูกกับ user คนเดียว (user เห็นแค่ job ตัวเอง)
    """

    # ── Status Choices ────────────────────────────────────
    STATUS_APPLIED       = 'applied'
    STATUS_INTERVIEWING  = 'interviewing'
    STATUS_OFFERED       = 'offered'
    STATUS_REJECTED      = 'rejected'
    STATUS_WITHDRAWN     = 'withdrawn'

    STATUS_CHOICES = [
        (STATUS_APPLIED,      'Applied'),
        (STATUS_INTERVIEWING, 'Interviewing'),
        (STATUS_OFFERED,      'Offered'),
        (STATUS_REJECTED,     'Rejected'),
        (STATUS_WITHDRAWN,    'Withdrawn'),
    ]

    # ── Fields ────────────────────────────────────────────
    user         = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='job_applications'
    )
    company      = models.CharField(max_length=200)
    position     = models.CharField(max_length=200)
    status       = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_APPLIED
    )
    applied_date = models.DateField()
    notes        = models.TextField(blank=True, default='')
    job_url      = models.URLField(blank=True, default='')
    salary_range = models.CharField(max_length=100, blank=True, default='')
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_date', '-created_at']
        verbose_name        = 'Job Application'
        verbose_name_plural = 'Job Applications'

    def __str__(self):
        return f"{self.position} @ {self.company} [{self.status}] — {self.user.username}"

    @property
    def days_since_applied(self):
        """คำนวณกี่วันผ่านไปแล้วนับจากวันสมัคร"""
        from django.utils import timezone
        today = timezone.now().date()
        return (today - self.applied_date).days
