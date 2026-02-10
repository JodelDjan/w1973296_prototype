#from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from ..models import Post, Application

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'body']
        

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            'id',
            'post',
            'user',
            'has_read_post',
            'has_consented',
            'created_at'
        ]
        read_only_fields = ['user', 'post']

class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            'title', 'body', 'start_date', 'max_participants',
            'tags', 'state'
        ]

    def validate(self, data):
        if not data.get("tags"):
            raise serializers.ValidationError("At least one tag is required.")
        return data
     

