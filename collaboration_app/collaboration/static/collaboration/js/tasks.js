document.addEventListener("DOMContentLoaded", function () {

    const socket = new WebSocket(
        'ws://' + window.location.host + '/ws/collaboration/'
    );

    let draggedTask = null;

    /* ============================
       WebSocket Messages
    ============================ */

    socket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        const { type, payload } = data;

        if (type === "task_list") renderTaskList(payload);
        if (type === "task_create") addTaskToDOM(payload);
        if (type === "task_delete") removeTask(payload.id);
        if (type === "task_update") updateTask(payload);
    };

    /* ============================
       Render Functions
    ============================ */

    function renderTaskList(tasks) {
        document.querySelectorAll(".column ul").forEach(ul => ul.innerHTML = "");
        tasks.forEach(task => addTaskToDOM(task));
    }

    function addTaskToDOM(task) {

        const li = document.createElement("li");
        li.className = "task";
        li.id = "task-" + task.id;
        li.draggable = true;

        /* TEXT */
        const textSpan = document.createElement("span");
        textSpan.textContent = task.title;

        textSpan.addEventListener("click", function () {
            toggleStatus(task);
        });

        /* DELETE BUTTON */
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✕";
        deleteBtn.className = "btn btn-danger";

        deleteBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            deleteTask(task.id);
        });

        li.appendChild(textSpan);
        li.appendChild(deleteBtn);

        /* =====================
           Drag Events
        ===================== */

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
        const existing = document.getElementById("task-" + task.id);
        if (existing) existing.remove();
        addTaskToDOM(task);
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
        if (!input.value.trim()) return;

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
       Theme Toggle (Persistent)
    ============================ */

    const themeToggle = document.getElementById("themeToggle");
const iconContainer = document.getElementById("themeIcon");

if (themeToggle && iconContainer) {

        // Load SVG from Django static
        fetch(themeIconPath)
            .then(res => {
                if (!res.ok) throw new Error("SVG not found");
                return res.text();
            })
            .then(svg => {
                iconContainer.innerHTML = svg;
            })
            .catch(err => console.error(err));

        // Load saved theme
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            document.documentElement.setAttribute("data-theme", savedTheme);
        }

        themeToggle.addEventListener("click", function () {
            const html = document.documentElement;
            const current = html.getAttribute("data-theme") || "light";
            const newTheme = current === "light" ? "dark" : "light";

            html.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }

    /* ============================
       Create Button Event
    ============================ */

    const btn = document.getElementById("createBtn");
    if (btn) btn.addEventListener("click", createTask);

});