const path = require("path");
const fs = require("fs");

class Ticket {
  constructor(number, desktop) {
    this.number = number;
    this.desktop = desktop;
  }
}

class TicketControl {
  constructor() {
    this.lastTicket = 0;
    this.today = new Date().getDate();
    this.tickets = [];
    this.lastFourtickets = [];
    this.init();
  }

  get toJson() {
    return {
      lastTicket: this.lastTicket,
      today: this.today,
      tickets: this.tickets,
      lastFourtickets: this.lastFourtickets,
    };
  }

  init() {
    const {
      today,
      tickets,
      lastFourtickets,
      lastTicket,
    } = require("../database/data.json");
    if (today === this.today) {
      this.lastTicket = lastTicket;
      this.tickets = tickets;
      this.lastFourtickets = lastFourtickets;
    } else {
      this.SaveDB();
    }
  }

  SaveDB() {
    const dbPath = path.join(__dirname, "../database/data.json");
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }

  NextTicket() {
    this.lastTicket += 1;
    const ticket = new Ticket(this.lastTicket, null);
    this.tickets.push(ticket);
    this.SaveDB();
    return `Ticket ${ticket.number}`;
  }

  AttendTicket(desktop) {
    if (this.tickets.length === 0) {
      return null;
    }
    const ticket = this.tickets.shift();
    ticket.desktop = desktop;
    this.lastFourtickets.unshift(ticket);

    if (this.lastFourtickets.length > 4) {
      this.lastFourtickets.splice(-1, 1);
    }

    this.SaveDB();

    return ticket;
  }
}

module.exports = TicketControl;
