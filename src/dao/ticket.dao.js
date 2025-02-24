import Ticket from '../models/ticket.model.js';

class TicketDao {
  async createTicket(ticketData) {
    const newTicket = new Ticket(ticketData);
    return await newTicket.save();
  }

  async getTicketById(id) {
    return await Ticket.findById(id);
  }

  async getTicketByCode(code) {
    return await Ticket.findOne({ code });
  }

  async getAllTickets() {
    return await Ticket.find();
  }

  async getTicketsByPurchaser(purchaserEmail) {
    return await Ticket.find({ purchaser: purchaserEmail });
  }
}

export default new TicketDao();