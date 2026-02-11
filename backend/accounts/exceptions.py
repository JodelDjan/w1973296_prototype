from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Custom exception handler for consistent error responses
    """
    response = exception_handler(exc, context)
    
    if response is not None:
        # Standardize error format
        custom_response_data = {
            'error': True,
            'message': '',
            'details': {}
        }
        
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                custom_response_data['message'] = response.data['detail']
            else:
                custom_response_data['message'] = 'An error occurred'
                custom_response_data['details'] = response.data
        else:
            custom_response_data['message'] = str(response.data)
        
        response.data = custom_response_data
    
    return response