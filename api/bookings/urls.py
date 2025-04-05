from django.urls import path
from .views import MentorListView, BookingView, LoginView

urlpatterns = [
    path('mentors/', MentorListView.as_view(), name='mentor-list'),
    path('bookings', BookingView.as_view(), name='booking-create'),
    path('bookings', BookingView.as_view(), name='booking-create'),
    path('login', LoginView.as_view(), name='login'),
]
