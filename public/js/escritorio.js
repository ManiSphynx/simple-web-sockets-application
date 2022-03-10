const lblDesktop = document.querySelector("h1");
const btnToMeet = document.querySelector("button");
const lblTicket = document.querySelector("small");
const divAlert = document.querySelector(".alert");
const lblPending = document.querySelector("#lblPendientes");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("El escritorio es necesario");
}

const desktop = searchParams.get("escritorio");
lblDesktop.textContent = `Escritorio ${desktop}`;
divAlert.style.display = "none";

const socket = io();

socket.on("connect", () => {
  btnToMeet.disabled = false;
});

socket.on("disconnect", () => {
  btnToMeet.disabled = true;
});

socket.on("tickets-pending", (pending) => {
  if (pending === 0) {
    lblPending.style.display = "none";
  } else {
    lblPending.style.display = "";
    lblPending.innerText = pending;
  }
});

btnToMeet.addEventListener("click", () => {
  socket.emit("attend-ticket", { desktop }, ({ ok, ticket, message }) => {
    if (!ok) {
      lblTicket.innerText = "No hay tickets";
      return (divAlert.style.display = "");
    }

    lblTicket.innerText = "Ticket " + ticket.number;
  });
});
