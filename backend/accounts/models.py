from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save 
from django.dispatch import receiver 


class Profile(models.Model):
    ROLE_CHOICES = [
        ("general", "General User"),
        ("researcher", "Researcher"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="general")

    # Researcher-only fields
    research_area = models.CharField(max_length=255, blank=True)
    bio = models.CharField(max_length=150, blank=True)

    # Tags stored as a list of strings
    tags = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.user.username} Profile"


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
