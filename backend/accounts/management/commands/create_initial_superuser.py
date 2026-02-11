from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import Profile
import os

#Create superuser
class Command(BaseCommand):
    help = 'Creates initial superuser and test users if they do not exist'

    def handle(self, *args, **options):
        
        superuser_email = os.environ.get('SUPERUSER_EMAIL', 'jodelkdjan@gmail.com')
        superuser_password = os.environ.get('SUPERUSER_PASSWORD', 'asuszenbook')
        
        if not User.objects.filter(email=superuser_email).exists():
            user = User.objects.create_superuser(
                username=superuser_email,
                email=superuser_email,
                password=superuser_password,
                first_name='Jodel',
                last_name='Admin'
            )
            # Profile auto-created by signal
            self.stdout.write(self.style.SUCCESS(f'Superuser created: {superuser_email}'))
        else:
            self.stdout.write(self.style.WARNING(f'Superuser already exists: {superuser_email}'))