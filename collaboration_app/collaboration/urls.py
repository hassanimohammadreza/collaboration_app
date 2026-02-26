from django.urls import path
from . import views
from . import consumers

urlpatterns = [
    path("", views.index, name="index"),
]

websocket_urlpatterns = [
    path("ws/collaboration/", consumers.CollaborationConsumer.as_asgi()),
]