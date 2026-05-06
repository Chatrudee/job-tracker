from django.urls import path
from .views import JobListCreateView, JobDetailView, StatsView, AISuggestView

urlpatterns = [
    path('',              JobListCreateView.as_view(), name='job-list-create'),
    path('stats/',        StatsView.as_view(),         name='job-stats'),
    path('<int:pk>/',     JobDetailView.as_view(),     name='job-detail'),
    path('<int:pk>/ai-suggest/', AISuggestView.as_view(), name='ai-suggest'),
]
