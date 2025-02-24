import { Router } from 'express';
import { authenticateUser } from '../middlewares/auth.js';
import ticketRepository from '../repositories/ticket.repository.js';

const router = Router();

router.post('/create', authenticateUser, async (req, res) => {
  try {
    const { amount } = req.body;
    const ticketData = {
      amount,
      purchaser: req.user.email
    };
    const newTicket = await ticketRepository.createTicket(ticketData);
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
});

router.get('/my-tickets', authenticateUser, async (req, res) => {
  try {
    const tickets = await ticketRepository.getTicketsByPurchaser(req.user.email);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
});

export default router;