document.addEventListener("DOMContentLoaded", function () {

    let socket;
    let reconnectAttempts = 0;
    const maxReconnectDelay = 5000;
    let draggedTask = null;

    const statusBadge = document.getElementById("connectionStatus");
    /* ============================
       FLIP Animation Engine
    ============================ */
    function springTo(element, dx, dy) {

        if (element._springFrame) {
            cancelAnimationFrame(element._springFrame);
        }

        let posX = dx;
        let posY = dy;

        let velocityX = 0;
        let velocityY = 0;

        const stiffness = 0.08;
        const damping = 0.8;
        const precision = 0.5;

        function animate() {

            const forceX = -stiffness * posX;
            const forceY = -stiffness * posY;

            velocityX = damping * (velocityX + forceX);
            velocityY = damping * (velocityY + forceY);

            posX += velocityX;
            posY += velocityY;

            element.style.transform = `translate(${posX}px, ${posY}px)`;

            if (Math.abs(posX) > precision || Math.abs(posY) > precision) {
                element._springFrame = requestAnimationFrame(animate);
            } else {
                element.style.transform = "";
                element._springFrame = null;
            }
        }

        element._springFrame = requestAnimationFrame(animate);
    }
    
    function flipAnimate(callback) {

        const first = new Map();
        document.querySelectorAll(".task").forEach(el => {
            first.set(el.id, el.getBoundingClientRect());
        });

        callback();

        document.querySelectorAll(".task").forEach(el => {

            const prev = first.get(el.id);
            if (!prev) return;

            const last = el.getBoundingClientRect();
            const dx = prev.left - last.left;
            const dy = prev.top - last.top;

            if (dx || dy) {
                springTo(el, dx, dy);
            }

        });
    }

    /* ============================
       Connection Status
    ============================ */

    function updateStatus(state) {
        if (!statusBadge) return;

        statusBadge.className = "connection-badge " + state;

        if (state === "connected")
            statusBadge.innerText = "🟢 Connected";

        if (state === "reconnecting")
            statusBadge.innerText = "🟡 Reconnecting...";

        if (state === "disconnected")
            statusBadge.innerText = "🔴 Disconnected";
    }

    /* ============================
       WebSocket Connection
    ============================ */

    function connectWebSocket() {

        updateStatus("reconnecting");

        const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";

        socket = new WebSocket(
            protocol + window.location.host + "/ws/collaboration/"
        );

        socket.onopen = function () {
            reconnectAttempts = 0;
            updateStatus("connected");
        };

        socket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            const { type, payload } = data;

            if (type === "task_list") renderTaskList(payload);
            if (type === "task_create") addTaskToDOM(payload);
            if (type === "task_delete") removeTask(payload.id);
            if (type === "task_update") updateTask(payload);
        };

        socket.onclose = function () {
            updateStatus("disconnected");

            const timeout = Math.min(
                1000 * Math.pow(2, reconnectAttempts),
                maxReconnectDelay
            );

            reconnectAttempts++;
            setTimeout(connectWebSocket, timeout);
        };

        socket.onerror = function () {
            socket.close();
        };
    }

    connectWebSocket();

    /* ============================
       Render Functions
    ============================ */

    function renderTaskList(tasks) {
        document.querySelectorAll(".column ul")
            .forEach(ul => ul.innerHTML = "");

        tasks.forEach(task => addTaskToDOM(task));
    }

    function addTaskToDOM(task) {

        const li = document.createElement("li");
        li.className = "task";
        li.id = "task-" + task.id;
        li.draggable = true;

        const textSpan = document.createElement("span");
        textSpan.textContent = task.title;

        textSpan.addEventListener("click", function () {
            toggleStatus(task);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✕";
        deleteBtn.className = "btn btn-danger";

        deleteBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            deleteTask(task.id);
        });

        li.appendChild(textSpan);
        li.appendChild(deleteBtn);

        /* Drag events */

        li.addEventListener("dragstart", function () {
            li.classList.add("dragging");
            draggedTask = task;
        });

        li.addEventListener("dragend", function () {
            li.classList.remove("dragging");
            draggedTask = null;
        });

        const column = document.getElementById(task.status);
        if (column) column.appendChild(li);
    }

    function updateTask(task) {

        flipAnimate(() => {

            const existing = document.getElementById("task-" + task.id);
            if (existing) existing.remove();

            addTaskToDOM(task);

        });

    }

    function removeTask(id) {
        const el = document.getElementById("task-" + id);
        if (el) el.remove();
    }

    /* ============================
       Actions
    ============================ */

    function toggleStatus(task) {

        const newStatus =
            task.status === "todo" ? "in_progress" :
            task.status === "in_progress" ? "done" :
            "todo";

        socket.send(JSON.stringify({
            type: "task_update",
            payload: {
                id: task.id,
                status: newStatus
            }
        }));
    }

    function deleteTask(taskId) {
        socket.send(JSON.stringify({
            type: "task_delete",
            payload: { id: taskId }
        }));
    }

    function createTask() {
        const input = document.getElementById("taskInput");
        if (!input || !input.value.trim()) return;

        socket.send(JSON.stringify({
            type: "task_create",
            payload: {
                title: input.value,
                description: "",
                status: "todo"
            }
        }));

        input.value = "";
    }

    /* ============================
       Drag & Drop Columns
    ============================ */

    document.querySelectorAll(".column ul").forEach(col => {

        col.addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        col.addEventListener("drop", function () {

            if (!draggedTask) return;

            socket.send(JSON.stringify({
                type: "task_update",
                payload: {
                    id: draggedTask.id,
                    status: col.id
                }
            }));
        });
    });

    /* ============================
       Theme Toggle
    ============================ */

    const themeToggle = document.getElementById("themeToggle");
    const iconContainer = document.getElementById("themeIcon");

    if (themeToggle && iconContainer && typeof themeIconPath !== "undefined") {

        fetch(themeIconPath)
            .then(res => res.text())
            .then(svg => iconContainer.innerHTML = svg)
            .catch(err => console.error(err));

        const savedTheme = localStorage.getItem("theme");
        if (savedTheme)
            document.documentElement.setAttribute("data-theme", savedTheme);

        themeToggle.addEventListener("click", function () {
            const html = document.documentElement;
            const current = html.getAttribute("data-theme") || "light";
            const newTheme = current === "light" ? "dark" : "light";

            html.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }

    /* ============================
       Create Button
    ============================ */

    const btn = document.getElementById("createBtn");
    if (btn) btn.addEventListener("click", createTask);

});