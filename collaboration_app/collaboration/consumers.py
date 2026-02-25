from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from .models import Task


class CollaborationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.group_name = "collaboration_group"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        # ارسال لیست اولیه تسک‌ها هنگام اتصال
        tasks = await self.get_all_tasks()
        await self.send(text_data=json.dumps({
            "type": "task_list",
            "payload": tasks
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        event_type = data.get("type")
        payload = data.get("payload", {})

        if event_type == "task_create":
            task = await self.create_task(payload)
            await self.broadcast("task_create", task)

        elif event_type == "task_update":
            task = await self.update_task(payload)
            await self.broadcast("task_update", task)

        elif event_type == "task_delete":
            task_id = payload.get("id")
            await self.delete_task(task_id)
            await self.broadcast("task_delete", {"id": task_id})

    async def broadcast(self, event_type, payload):
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "send_event",
                "event_type": event_type,
                "payload": payload
            }
        )

    async def send_event(self, event):
        await self.send(text_data=json.dumps({
            "type": event["event_type"],
            "payload": event["payload"]
        }))

    # =========================
    # Database Methods
    # =========================

    @sync_to_async
    def create_task(self, payload):
        task = Task.objects.create(
            title=payload.get("title", ""),
            description=payload.get("description", ""),
            status=payload.get("status", "todo")
        )
        return self.serialize_task(task)

    @sync_to_async
    def update_task(self, payload):
        task = Task.objects.get(id=payload.get("id"))
        task.title = payload.get("title", task.title)
        task.description = payload.get("description", task.description)
        task.status = payload.get("status", task.status)
        task.save()
        return self.serialize_task(task)

    @sync_to_async
    def delete_task(self, task_id):
        Task.objects.filter(id=task_id).delete()

    @sync_to_async
    def get_all_tasks(self):
        return [self.serialize_task(task) for task in Task.objects.all()]

    def serialize_task(self, task):
        return {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "created_at": task.created_at.isoformat(),
            "updated_at": task.updated_at.isoformat(),
        }