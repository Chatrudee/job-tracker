from rest_framework import serializers
from .models import JobApplication


class JobApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer หลัก — ใช้สำหรับ list และ detail
    เพิ่ม days_since_applied เป็น read-only field
    """
    days_since_applied = serializers.ReadOnlyField()

    class Meta:
        model  = JobApplication
        fields = [
            'id', 'company', 'position', 'status',
            'applied_date', 'notes', 'job_url', 'salary_range',
            'days_since_applied', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'days_since_applied']

    def create(self, validated_data):
        # inject user จาก request context อัตโนมัติ
        # user ไม่ต้องส่งมาจาก frontend
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class JobApplicationListSerializer(serializers.ModelSerializer):
    """
    Serializer สำหรับ list view — แสดงข้อมูลย่อ (เร็วกว่า)
    ไม่มี notes ยาวๆ เพื่อประหยัด bandwidth
    """
    days_since_applied = serializers.ReadOnlyField()

    class Meta:
        model  = JobApplication
        fields = [
            'id', 'company', 'position', 'status',
            'applied_date', 'days_since_applied', 'salary_range'
        ]


class StatsSerializer(serializers.Serializer):
    """
    Serializer สำหรับ dashboard stats
    ไม่ใช่ ModelSerializer เพราะ aggregate จาก queryset
    """
    total        = serializers.IntegerField()
    applied      = serializers.IntegerField()
    interviewing = serializers.IntegerField()
    offered      = serializers.IntegerField()
    rejected     = serializers.IntegerField()
    withdrawn    = serializers.IntegerField()
    success_rate = serializers.FloatField()
