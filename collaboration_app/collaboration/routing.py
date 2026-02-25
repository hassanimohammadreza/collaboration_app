from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/collaboration/', consumers.CollaborationConsumer.as_asgi()),
]