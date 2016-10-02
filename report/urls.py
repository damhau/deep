from django.conf.urls import url, include
from report import views

urlpatterns = [
    url(r'^$', views.ReportDashboardView.as_view(), name="dashboard"),
    url(r'^weekly/(?P<country_id>\w+)/(?P<event_id>\d+)/$', views.WeeklyReportView.as_view(), name="weekly"),
    url(r'^monthly/$', views.MonthlyReportView.as_view(), name="monthly"),
]
