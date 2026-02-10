from django.db import models
from django.conf import settings

from django.db import models
from django.contrib.auth.models import User

from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    STATE_CHOICES = [
        ("open", "Open"),
        ("closed", "Closed"),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    body = models.TextField()
    start_date = models.DateField()
    max_participants = models.PositiveIntegerField()
    tags = models.JSONField(default=list)
    state = models.CharField(max_length=10, choices=STATE_CHOICES, default="open")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.author.email})"

    
class Application(models.Model):
    post = models.ForeignKey(
        'Post',
        on_delete=models.CASCADE,
        related_name='applications'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    # New fields
    has_read_post = models.BooleanField(default=False)
    has_consented = models.BooleanField(default=False)

    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')

    def __str__(self):
        return f"{self.user.username} applied to {self.post.title}"
