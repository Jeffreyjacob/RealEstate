from django.urls import path
from apartments import views as api_views


urlpatterns = [
    path('create/',api_views.CreateApartmentView.as_view()),
    path('',api_views.GetAllAPartmentView.as_view()),
    path('userApartment/',api_views.GetApartmentListByUser.as_view()),
    path('searhApartment/',api_views.SearchApartmentView.as_view()),
    path('<id>/',api_views.GetApartmentDetails.as_view()),
    path('relatedApartment/<id>/',api_views.RelatedApartmentView.as_view()),
    path('update/<id>/',api_views.EditApartmentView.as_view()),
    path('delete/<id>',api_views.DeleteApartmentView.as_view()),
]