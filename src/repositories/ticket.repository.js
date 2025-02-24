import ticketDao from '../dao/ticket.dao.js';
import TicketDto from '../dto/ticket.dto.js';

class TicketRepository {
  async createTicket(ticketData) {
    const ticket = await ticketDao.createTicket(ticketData);
    return new TicketDto(ticket);
  }

  async getTicketById(id) {
    const ticket = await ticketDao.getTicketById(id);
    return ticket ? new TicketDto(ticket) : null;
  }

  async getTicketByCode(code) {
    const ticket = await ticketDao.getTicketByCode(code);
    return ticket ? new TicketDto(ticket) : null;
  }

  async getAllTickets() {
    const tickets = await ticketDao.getAllTickets();
    return tickets.map(ticket => new TicketDto(ticket));
  }

  async getTicketsByPurchaser(purchaserEmail) {
    const tickets = await ticketDao.getTicketsByPurchaser(purchaserEmail);
    return tickets.map(ticket => new TicketDto(ticket));
  }
}

export default new TicketRepository();