from django.urls import path
from users import views as api_views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/",api_views.RegisterUserView.as_view()),
    path('verify_email/',api_views.EmailVerificationView.as_view()),
    path('login/',api_views.LoginUserView.as_view()),
    path('token/refresh/',TokenRefreshView.as_view()),
    path('getProfile/',api_views.GetUserProfileView.as_view()),
    path('profile/update/',api_views.EditUserProfileView.as_view()),
    path('password_reset/',api_views.PasswordResetRequestView.as_view()),
    path('setNewPassword/',api_views.SetNewPasswordView.as_view()),
    path('google/',api_views.GoogleSignInView.as_view()),
    path('logout/',api_views.LogOutView.as_view()),
    path('favorite/',api_views.GetUserFavoritedApartmentView.as_view()),
    path('addFavorite/<apartmentId>/',api_views.AddOrRemoveFavoriteView.as_view()),
]