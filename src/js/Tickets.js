import Ticket from './Ticket';
import Modal from './Modal';
import createRequest from './createRequest';

export default class Tickets {
  constructor() {
    this.ticketsList = document.querySelector('.tickets-list');
    this.ticketsInProgress = this.ticketsList.querySelector('.tickets-list__in-progress');
    this.ticketsDone = this.ticketsList.querySelector('.tickets-list__done');
    this.modal = new Modal(document.getElementById('ticketModal'));
  }

  init() {
    this.getTickets(this.updateList.bind(this));
    this.events();
  }

  events() {
    this.modal.modal.addEventListener('show.bs.modal', (e) => {
      this.modal.showModal(e);

      const { method } = document.forms[0].dataset;
      if (method === 'editTicket' || method === 'deleteTicket') {
        this.getTicketData(e, method);
      }

      document.forms[0].addEventListener('submit', (evt) => this.submitMethod(evt));
    });

    this.ticketsList.addEventListener('click', (e) => this.ticketEvents(e));
  }

  ticketEvents(e) {
    const currentTicket = e.target.closest('.ticket');
    const currentTicketId = currentTicket.dataset.id;

    if (e.target.closest('.ticket-text__name')) {
      this.showTicketDescription(currentTicket, currentTicketId);
      return;
    }

    if (e.target.closest('.form-check-input')) {
      this.updateTicketStatus(currentTicketId, this.updateList.bind(this));
    }
  }

  submitMethod(e) {
    e.preventDefault();

    const { method } = e.target.dataset;

    switch (method) {
      case 'createTicket':
        this.createTicket(this.updateList.bind(this));
        break;
      case 'editTicket':
        this.editTicket(e, this.updateList.bind(this));
        break;
      case 'deleteTicket':
        this.deleteTicket(e, this.updateList.bind(this));
        break;
      default:
      // do nothing
    }

    document.querySelector('.btn-close').click();
  }

  createTicket(callback) {
    createRequest(
      {
        methodRequest: 'POST',
        data: {
          method: 'createTicket',
        },
        callback,
      },
      document.forms[0],
    );

    document.forms[0].reset();
  }

  deleteTicket(e, callback) {
    createRequest({
      methodRequest: 'DELETE',
      data: {
        method: 'deleteTicket',
        id: e.currentTarget.dataset.ticketId,
      },
      callback,
    });
  }

  editTicket(e, callback) {
    createRequest(
      {
        methodRequest: 'POST',
        data: {
          method: 'editTicket',
          id: e.currentTarget.dataset.ticketId,
        },
        callback,
      },
      document.forms[0],
    );

    document.forms[0].reset();
  }

  getTickets(callback) {
    createRequest({
      methodRequest: 'GET',
      data: {
        method: 'allTickets',
      },
      callback,
    });
  }

  getTicketData(e, method) {
    const currentTicketId = e.relatedTarget.closest('.ticket').dataset.id;
    e.target.querySelector('form').dataset.ticketId = currentTicketId;

    if (method !== 'editTicket') return;

    this.ticketById(currentTicketId, (data) => {
      const { name, description } = data;
      document.forms[0].name.value = name;
      document.forms[0].description.value = description;
    });
  }

  showTicketDescription(ticket, id) {
    const detailDesc = ticket.querySelector('.ticket-text__detail');
    detailDesc.classList.toggle('visually-hidden');

    if (detailDesc.textContent !== '') return;

    this.ticketById(id, (data) => {
      const spinner = Ticket.spinner();
      const { description } = data;

      if (!description) {
        detailDesc.textContent = 'Описание задачи отсутствует';
        return;
      }

      detailDesc.innerHTML = spinner;
      setTimeout(() => {
        detailDesc.innerHTML = '';
        detailDesc.textContent = description;
      }, 1000);
    });
  }

  ticketById(id, callback) {
    createRequest({
      methodRequest: 'GET',
      data: {
        method: 'ticketById',
        id,
      },
      callback,
    });
  }

  updateTicketStatus(id, callback) {
    createRequest({
      methodRequest: 'GET',
      data: {
        method: 'updateStatus',
        id,
      },
      callback,
    });
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
