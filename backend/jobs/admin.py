from django.contrib import admin
from .models import JobApplication


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display  = ['company', 'position', 'status', 'user', 'applied_date', 'days_since_applied']
    list_filter   = ['status', 'applied_date']
    search_fields = ['company', 'position', 'user__username']
    ordering      = ['-applied_date']
    readonly_fields = ['created_at', 'updated_at']
