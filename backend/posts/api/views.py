from django.shortcuts import render
from rest_framework import viewsets, generics, permissions
from ..models import Post
from .serializers import PostSerializer, ApplicationSerializer, CreatePostSerializer
from ..permissions import IsGeneralUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.models import Profile


class ClosePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        # Only the author can close the post
        if post.author != request.user:
            return Response({"error": "You are not allowed to close this post"},
                            status=status.HTTP_403_FORBIDDEN)

        post.state = "closed"
        post.save()

        return Response({"message": "Post closed successfully"}, status=status.HTTP_200_OK)


class CreatePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = request.user.profile

        if profile.role != "researcher":
            return Response({"error": "Only researchers can create posts."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = CreatePostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response({"message": "Post created successfully"},
                            status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
