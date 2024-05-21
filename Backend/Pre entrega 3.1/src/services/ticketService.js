const Ticket = require('../models/ticketModel');
const uuid = require('uuid');

class TicketService {
  static generateUniqueCode() {
    return uuid.v4();
  }

  static async createTicket(ticketData) {
    try {
      const ticket = new Ticket(ticketData);
      return await ticket.save();
    } catch (error) {
      throw new Error('Error al crear el ticket');
    }
  }
}

module.exports = TicketService;