from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate


#Login serializer
class EmailLoginSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Remove the username field from serializer
        if 'username' in self.fields:
            del self.fields['username']
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        # Try to find user by email
        try:
            user = User.objects.get(email=email)
            username = user.username
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid email or password')
        
        # Authenticate with username
        user = authenticate(username=username, password=password)
        
        if user is None:
            raise serializers.ValidationError('Invalid email or password')
        
        # Generate tokens
        refresh = self.get_token(user)
        
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)

    # Researcher fields
    researchArea = serializers.CharField(write_only=True, required=False, allow_blank=True)
    bio = serializers.CharField(write_only=True, required=False, allow_blank=True)
    tags = serializers.ListField(write_only=True, required=False)

    # General user fields
    ageRange = serializers.CharField(write_only=True, required=False, allow_blank=True)
    interests = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'password',
            'role', 'researchArea', 'bio', 'tags',
            'ageRange', 'interests'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    # FIX: email uniqueness validation
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def create(self, validated_data):
        role = validated_data.pop('role')

        # Researcher fields
        research_area = validated_data.pop('researchArea', '')
        bio = validated_data.pop('bio', '')
        tags = validated_data.pop('tags', [])

        # General user fields
        age_range = validated_data.pop('ageRange', '')
        interests = validated_data.pop('interests', [])

        # Create user
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )

        # FIX: ensure profile exists
        profile, created = Profile.objects.get_or_create(user=user)
        profile.role = role

        if role == "researcher":
            profile.research_area = research_area
            profile.bio = bio
            profile.tags = tags

        if role == "general":
            profile.age_range = age_range
            profile.interests = interests

        profile.save()
        return user


