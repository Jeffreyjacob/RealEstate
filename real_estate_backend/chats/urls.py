from django.urls import path
from chats import views as api_views


urlpatterns =[
    path('allChatMessage/<booking_id>/',api_views.GetAllMessageAPIView.as_view(),name="all_message"),
    path('userChats',api_views.UserChatAPIView.as_view(),name="user_chat"),
    path('markasread/<booking_id>/',api_views.MarkAsReadAPIView.as_view(),name="mark_as_read")
]