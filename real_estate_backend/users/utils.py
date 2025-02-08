from django.core.mail import EmailMessage,EmailMultiAlternatives
import pyotp
from .models import User,OneTimePasscode
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from google.auth.transport import requests
from google.oauth2 import id_token
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from celery import shared_task

def generateOtp():
    key = pyotp.random_base32()
    otp = pyotp.TOTP(key)
    otp_value = otp.now()
    return otp_value

def generate_reset_url(uidb64,token):
    frontend_url = settings.FRONTEND_URL
    reset_url = f"{frontend_url}/reset-password/{uidb64}/{token}/"
    return reset_url

@shared_task
def send_code_to_user_task(email):
    Subject = "One time passcode for Email Verification"
    otp_code = generateOtp()
    user = User.objects.get(email=email)
    current_site = "Real Estate Platform"
    email_body = f"Hi {user.full_name} thanks for signing up on {current_site} please verify your email with the passcode provided below: \n {otp_code}"
    from_email = settings.DEFAULT_FROM_EMAIL
    
    OneTimePasscode.objects.create(user=user,code=otp_code)
    send_email = EmailMessage(subject=Subject,body=email_body,to=[email])
    send_email.send(fail_silently=True)

@shared_task  
def send_resetpassword_email_task(email, reset_link,name):
    # Prepare the email body using the HTML template
    html_content = render_to_string('emails/reset-email-password.html', {
        'reset_url': reset_link,
        'product_name': 'Real Estate Booking App',
        'name':name
    })
    
    # Create the plain text version of the email (this can be useful for email clients that do not render HTML)
    plain_content = strip_tags(html_content)
    
    # Create the email message with both plain-text and HTML versions
    email = EmailMultiAlternatives(
        subject="Password Reset",  # Subject of the email
        body=plain_content,  # Plain-text version of the email body
        to=[email],  # Recipient email address
    )
    
    # Set the HTML content as well
    email.content_subtype = "html"  # This indicates the content is HTML (not plain text)
    email.attach_alternative(html_content, "text/html")  # Attach the HTML version
    
    # Send the email silently (won't raise exceptions)
    email.send(fail_silently=True)
    

class Google():
    @staticmethod
    def validate(access_token):
        try:
           id_info = id_token.verify_oauth2_token(access_token,requests.Request())
           if "accounts.google.com" in id_info['iss']:
              return id_info
        except Exception as e:
            return "token is invalid or has expired"
        
def login_social_user(email,password):
          user = authenticate(email=email,password=password)
          user_token = user.tokens()
          return {
              'email':user.email,
              'full_name':user.get_full_name,
              'id':user.id,
              'role':user.get_role,
              'access_token' : str(user_token.get('access')),
              'refresh_token': str(user_token.get('refresh'))
          }

def register_social_user(provider,email,full_name):
      user = User.objects.filter(email=email)
      if user.exists():
          if provider == user[0].auth_provider:
              result = login_social_user(email=email,password=settings.SOCIAL_AUTH_PASSWORD)
              return result
          else:
              raise AuthenticationFailed(
                  detail= f"please continue your login with {user[0].auth_provider}"
              )
      else:
          register_user = User.objects.create(
              email = email,
              full_name = full_name,
              password = settings.SOCIAL_AUTH_PASSWORD
          )
          register_user.auth_provider = provider
          register_user.is_verified = True
          register_user.save()
          result = login_social_user(email=register_user.email,password=settings.SOCIAL_AUTH_PASSWORD)
          return result