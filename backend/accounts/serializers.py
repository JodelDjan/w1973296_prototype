from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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

    def create(self, validated_data):
        role = validated_data.pop('role')

        # Researcher fields
        research_area = validated_data.pop('researchArea', '')
        bio = validated_data.pop('bio', '')
        tags = validated_data.pop('tags', [])

        # General user fields
        age_range = validated_data.pop('ageRange', '')
        interests = validated_data.pop('interests', [])

        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )

        profile = user.profile
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

def validate_email(self, value):
    if User.objects.filter(email=value).exists():
        raise serializers.ValidationError("Email already registered.")
    return value


class EmailLoginSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password',
                  'role', 'researchArea', 'bio', 'tags']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        role = validated_data.pop('role')
        research_area = validated_data.pop('researchArea', '')
        bio = validated_data.pop('bio', '')
        tags = validated_data.pop('tags', [])

        # Create the user
        user = User.objects.create_user(
            username=validated_data['email'],  # using email as username
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )

        # Update profile
        profile = user.profile
        profile.role = role
        profile.research_area = research_area
        profile.bio = bio
        profile.tags = tags
        profile.save()

        return user
