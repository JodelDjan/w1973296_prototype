from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    # extra fields from Profile
    role = serializers.CharField(write_only=True)
    researchArea = serializers.CharField(write_only=True, required=False, allow_blank=True)
    bio = serializers.CharField(write_only=True, required=False, allow_blank=True)
    tags = serializers.ListField(write_only=True, required=False)

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
