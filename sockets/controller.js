const TicketControl = require("../config/ticket-contol");
const ticketControl = new TicketControl();

const socketController = (socket) => {
  socket.emit("last-ticket", ticketControl.lastTicket);
  socket.emit("actual-state", ticketControl.lastFourtickets);
  socket.emit("tickets-pending", ticketControl.tickets.length);

  socket.on("next-ticket", (payload, callback) => {
    const next = ticketControl.NextTicket();
    callback(next);
    socket.broadcast.emit("tickets-pending", ticketControl.tickets.length);
  });

  socket.on("attend-ticket", ({ desktop }, callback) => {
    if (!desktop) {
      return callback({
        ok: false,
        message: "El escritorio es obligatorio",
      });
    }

    const ticket = ticketControl.AttendTicket(desktop);

    socket.broadcast.emit("actual-state", ticketControl.lastFourtickets);
    socket.emit("tickets-pending", ticketControl.tickets.length);
    socket.broadcast.emit("tickets-pending", ticketControl.tickets.length);

    if (!ticket) {
      return callback({
        ok: false,
        message: "No hay tickets disponibles",
      });
    } else {
      return callback({
        ok: true,
        ticket,
      });
    }
  });
};

module.exports = {
  socketController,
};
