const Ticket = require('../models/ticketModel');
const uuid = require('uuid');
const logger = require('../utils/logger');

class TicketService {
  static generateUniqueCode() {
    return uuid.v4();
  }

  static async createTicket(ticketData) {
    try {
      const ticket = new Ticket(ticketData);
      return await ticket.save();
    } catch (error) {
      logger.error(`Error al crear el ticket: ${error.message}`);
      throw new Error('Error al crear el ticket');
    }
  }
}

module.exports = TicketService;