from django.contrib import admin
from .models import Profile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'research_area', 'age_range']
    list_filter = ['role']
    search_fields = ['user__username', 'user__email', 'research_area']