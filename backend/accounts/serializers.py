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


#login serializer

class EmailLoginSerializer(TokenObtainPairSerializer):
    username_field = 'email'