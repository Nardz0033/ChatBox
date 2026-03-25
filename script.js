const form = document.getElementById("chatForm");
const chatBox = document.getElementById("chatBox");

let myName = localStorage.getItem("name");

if (myName) {
  document.getElementById("name").value = myName;
}

// LOAD MESSAGES
function loadMessages() {
  fetch("load.php")
    .then((res) => res.json())
    .then((data) => {
      chatBox.innerHTML = "";

      data.forEach((msg, index) => {
        let isMine = msg.name === myName;

        chatBox.innerHTML += `
	    	            	                	                                        <div class="message">
	    	            	                	                                                            <strong>${msg.name}</strong>
	    	            	                	                                                                                ${msg.message}
	    	            	                	                                                                                                    <span>${msg.time}</span>
	    	            	                	                                                                                                                        ${isMine ? `<small>${msg.seen ? "✔✔ Seen" : "✔ Sent"}</small>` : ""}
	    	            	                	                                                                                                                                            ${isMine ? `<span class="delete-btn" onclick="deleteMsg(${index})">Unsend</span>` : ""}
	    	            	                	                                                                                                                                                            </div>
	    	            	                	                                                                                                                                                                        `;
      });

      chatBox.scrollTop = chatBox.scrollHeight;

      // mark as seen (FIXED)
      if (myName) {
        fetch("save.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seenBy: myName }),
        });
      }
    });
}

// AUTO REFRESH
setInterval(loadMessages, 2000);
loadMessages();

// SEND MESSAGE
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  localStorage.setItem("name", name);
  myName = name;

  fetch("save.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message }),
  }).then(() => {
    form.reset();
    document.getElementById("name").value = myName;
  });
});

// DELETE MESSAGE
function deleteMsg(index) {
  fetch("save.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ delete: index }),
  });
}

// DARK MODE
function toggleDark() {
  document.body.classList.toggle("dark");
}

// TYPING INDICATOR
let typingTimer;

const messageInput = document.getElementById("message");

if (messageInput) {
  messageInput.addEventListener("input", () => {
    const typingDiv = document.getElementById("typing");

    if (typingDiv) {
      typingDiv.innerText = "Typing...";
    }

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
      if (typingDiv) {
        typingDiv.innerText = "";
      }
    }, 1000);
  });
}
