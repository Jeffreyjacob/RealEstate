from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from rest_framework_simplejwt.tokens import RefreshToken

# Create your models here.


class UserManager(BaseUserManager):
    
    def create(self,full_name,email,password="None",role="RENTER"):
        if not email:
            raise ValueError("email is required")
        email = self.normalize_email(email)
        email = email.lower()
        user = self.model(
            full_name = full_name,
            email = email,
            role = role
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self,full_name,email,password="None"):
        user = self.create(
            email=email,
            full_name=full_name,
            password=password
        )
        user.is_superuser = True
        user.is_staff = True
        user.is_verified = True
        user.save(using=self._db)
        return user
    

class User(AbstractBaseUser,PermissionsMixin):
    
      ROLE = (
        ('RENTER','RENTER'),
        ('LANDLORD','LANDLORD')
       )
      
      AUTH_PROVIDER = {'email':"email",'google':'google'}
      
      full_name = models.CharField(max_length=255)
      email = models.EmailField(unique=True,max_length=255)
      role = models.CharField(max_length=100,choices=ROLE,default="RENTER")
      is_active = models.BooleanField(default=True)
      is_verified = models.BooleanField(default=False)
      is_staff = models.BooleanField(default=False)
      created_at = models.DateTimeField(auto_now_add=True)
      updated_at = models.DateField(auto_now=True)
      auth_provider = models.CharField(max_length=50,default=AUTH_PROVIDER.get('email'))
      
      USERNAME_FIELD = 'email'
      REQUIRED_FIELDS = ['full_name']
      
      objects = UserManager()
      
      def __str__(self):
          return f"{self.email}"
      
      @property
      def get_full_name(self):
          return f"{self.full_name}"
      @property
      def get_role(self):
          return f"{self.role}"
      
      def tokens(self):
          refresh = RefreshToken.for_user(self)

          return {
              'refresh':str(refresh),
              'access':str(refresh.access_token)
          }
        


class Profile(models.Model):
      
      GENDER = (
          ('MALE','MALE'),
          ('FEMALE','FEMALE')
      )
      
      user = models.OneToOneField(User,on_delete=models.CASCADE)
      phone_number = models.CharField(max_length=20,blank=True,null=True)
      nationality = models.CharField(max_length=30,blank=True,null=True)
      current_address = models.CharField(max_length=300,blank=True,null=True)
      gender = models.CharField(max_length=20,choices=GENDER,blank=True,null=True)
      image = models.CharField(max_length=500,blank=True,null=True)
      
      def __str__(self):
           return f"{self.user.full_name}"
       

class OneTimePasscode(models.Model):
      
      user = models.OneToOneField(User,on_delete=models.CASCADE)
      code = models.CharField(max_length=6)
      
      def __str__(self):
           return f"{self.user.full_name}- passcode"
       
       

      
      