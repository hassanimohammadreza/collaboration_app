const socket = new WebSocket(
            'ws://' + window.location.host + '/ws/collaboration/'
        );

        socket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            const li = document.createElement("li");
            li.textContent = data.message;
            document.querySelector("#messages").appendChild(li);
        };

        function sendMessage() {
            const input = document.getElementById("messageInput");
            socket.send(JSON.stringify({
                "message": input.value
            }));
            input.value = "";
        }
document.getElementById("sendBtn")
    .addEventListener("click", sendMessage);