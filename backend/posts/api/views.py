from django.shortcuts import render
from rest_framework import viewsets, generics, permissions
from ..models import Post
from .serializers import PostSerializer, ApplicationSerializer
from ..permissions import IsGeneralUser


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class ApplyToPostView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsGeneralUser]

    def perform_create(self, serializer):
        post = Post.objects.get(id=self.kwargs['post_id'])
        serializer.save(
            user=self.request.user,
            post=post
        )
