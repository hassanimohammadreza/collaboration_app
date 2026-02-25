@echo off
call venv\Scripts\activate
python -m uvicorn collaboration_app.asgi:application --reload
pause