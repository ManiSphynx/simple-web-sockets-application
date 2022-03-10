const lblNewTicket = document.getElementById("lblNuevoTicket");
const btnCreateTicket = document.querySelector("button");

const socket = io();

socket.on("connect", () => {
  btnCreateTicket.disabled = false;
});

socket.on("disconnect", () => {
  btnCreateTicket.disabled = true;
});

socket.on(
  "last-ticket",
  (data) => (lblNewTicket.textContent = `Ticket ${data}`)
);

btnCreateTicket.addEventListener("click", () => {
  socket.emit("next-ticket", null, (ticket) => {
    lblNewTicket.textContent = ticket;
  });
});
