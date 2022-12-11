import Modal from './Modal';
import Ticket from './Ticket';
import TicketsRequests from './TicketsRequests';

export default class Tickets {
  constructor() {
    this.ticketsList = document.querySelector('.tickets-list');
    this.ticketsInProgress = this.ticketsList.querySelector('.tickets-list__in-progress');
    this.ticketsDone = this.ticketsList.querySelector('.tickets-list__done');
    this.modal = new Modal(document.getElementById('ticketModal'));
  }

  init() {
    TicketsRequests.getTickets(this.updateList.bind(this));
    this.events();
  }

  events() {
    this.modal.modal.addEventListener('show.bs.modal', (e) => {
      this.modal.showModal(e);

      const { method } = document.forms[0].dataset;
      if (method === 'editTicket' || method === 'deleteTicket') {
        Ticket.getTicketData(e, method);
      }

      document.forms[0].addEventListener('submit', (evt) => this.submitMethod(evt));
    });

    this.ticketsList.addEventListener('click', (e) => this.ticketEvents(e));
  }

  ticketEvents(e) {
    const currentTicket = e.target.closest('.ticket');
    const currentTicketId = currentTicket.dataset.id;

    if (e.target.closest('.ticket-text__name')) {
      Ticket.showTicketDescription(currentTicket, currentTicketId);
      return;
    }

    if (e.target.closest('.form-check-input')) {
      TicketsRequests.updateTicketStatus(currentTicketId, this.updateList.bind(this));
    }
  }

  submitMethod(e) {
    e.preventDefault();

    const { method } = e.target.dataset;

    switch (method) {
      case 'createTicket':
        TicketsRequests.createTicket(this.updateList.bind(this));
        break;
      case 'editTicket':
        TicketsRequests.editTicket(e, this.updateList.bind(this));
        break;
      case 'deleteTicket':
        TicketsRequests.deleteTicket(e, this.updateList.bind(this));
        break;
      default:
      // do nothing
    }

    document.querySelector('.btn-close').click();
  }

  updateList(data) {
    this.ticketsInProgress.innerHTML = '';
    this.ticketsDone.innerHTML = '';

    data.forEach((item) => {
      if (item.status) {
        this.ticketsDone.append(Ticket.createTicket(item));
        return;
      }

      this.ticketsInProgress.append(Ticket.createTicket(item));
    });
  }
}
