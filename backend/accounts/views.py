# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, EmailLoginSerializer
import logging
from .models import Profile
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

logger = logging.getLogger(__name__)

class RegisterView(APIView):
    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "User registered successfully"}, 
                    status=status.HTTP_201_CREATED
                )
            return Response(
                {
                    "error": True,
                    "message": "Registration failed",
                    "details": serializer.errors
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return Response(
                {
                    "error": True,
                    "message": "An unexpected error occurred during registration"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EmailLoginView(TokenObtainPairView):
    serializer_class = EmailLoginSerializer

    def post(self, request, *args, **kwargs):
        print("\n=== LOGIN ATTEMPT ===")
        print("Request data:", request.data)
        print("Email provided:", request.data.get('email'))
        print("Password provided:", '***' if request.data.get('password') else 'MISSING')
        
        try:
            serializer = self.get_serializer(data=request.data)
            print("Serializer created")
            serializer.is_valid(raise_exception=True)
            print("Serializer valid!")
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        except Exception as e:
            print("ERROR TYPE:", type(e).__name__)
            print("ERROR MESSAGE:", str(e))
            import traceback
            traceback.print_exc()
            return Response(
                {
                    "error": True,
                    "message": "Invalid email or password"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.profile
            return Response({
                "email": request.user.email,
                "first_name": request.user.first_name,
                "last_name": request.user.last_name,
                "role": profile.role,
            })
        except AttributeError:
            return Response(
                {
                    "error": True,
                    "message": "User profile not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"MeView error: {str(e)}")
            return Response(
                {
                    "error": True,
                    "message": "Failed to retrieve user information"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        



@api_view(['GET'])
def researcher_directory(request):
    """Return all researchers"""
    researchers = Profile.objects.filter(role='researcher')
    data = []
    
    for profile in researchers:
        data.append({
            'name': f"{profile.user.first_name} {profile.user.last_name}",
            'email': profile.user.email,
            'research_area': profile.research_area,
            'bio': profile.bio,
            'tags': profile.tags,
        })
    
    return Response(data)