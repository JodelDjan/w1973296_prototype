from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save 
from django.dispatch import receiver 


class Profile(models.Model):
    ROLE_CHOICES = [
        ("general", "General User"),
        ("researcher", "Researcher"),
    ]

    AGE_RANGE_CHOICES = [
        ("18-25", "18–25"),
        ("26-35", "26–35"),
        ("36-45", "36–45"),
        ("46-55", "46–55"),
        ("56-60", "56–60"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="general")

    # Researcher-only fields
    research_area = models.CharField(max_length=255, blank=True)
    bio = models.CharField(max_length=150, blank=True)
    tags = models.JSONField(default=list, blank=True)

    # General-user-only fields
    age_range = models.CharField(max_length=20, choices=AGE_RANGE_CHOICES, blank=True)
    interests = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.user.username} Profile"



@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
