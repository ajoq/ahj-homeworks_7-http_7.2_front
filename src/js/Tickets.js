import Ticket from "./Ticket";
import Modal from "./Modal";

export default class Tickets {
    constructor() {
        this.ticketsList = document.querySelector('.tickets-list');
        this.ticketsInProgress = this.ticketsList.querySelector('.tickets-list__in-progress');
        this.ticketsDone = this.ticketsList.querySelector('.tickets-list__done');
        this.modal = new Modal(document.getElementById('ticketModal'));
    }

    init() {
        this.getTickets();
        this.events();
    }

    events() {
        this.modal.modal.addEventListener('show.bs.modal', (e) => {
            this.modal.showModal(e);

            const method = document.forms[0].dataset.method;
            if (method === 'editTicket' || method === 'deleteTicket') {
                this.getTicketData(e, method);
            }            

            document.forms[0].addEventListener('submit', (e) => this.submitMethod(e));
        });

        this.ticketsList.addEventListener('click', (e) => this.ticketEvents(e));
    }

    ticketEvents(e) {
        const currentTicket = e.target.closest('.ticket');
        const currentTicketId = currentTicket.dataset.id;

        if (e.target.closest('.ticket-text__name')) {
            this.showTicketDescription(currentTicket, currentTicketId);
            return;
        };

        if (e.target.closest('.form-check-input')) {
            this.updateTicketStatus(currentTicketId);
            return;
        }
    }

    submitMethod(e) {
        e.preventDefault();
        console.log('Произошло событие submit');

        const method = e.target.dataset.method;

        switch(method) {
            case 'createTicket':
                this.createTicket();
                break;
            case 'editTicket':
                this.editTicket(e);
                break;
            case 'deleteTicket':                
                this.deleteTicket(e);
                break;                
        }

        document.querySelector('.btn-close').click();
    }

    createTicket() {
        console.log('Добавляем тикет');

        let formData = new FormData(document.forms[0]);
        let xhr = new XMLHttpRequest();
        let url = new URL('http://localhost:7070/');
        url.searchParams.set('method', 'createTicket');
        xhr.open('POST', url);
        xhr.send(formData);

        document.forms[0].reset();

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.response);
                    console.log(data);
                    this.updateList(data);
                } catch (e) {
                    console.error(e);
                }              
            }
        });
    }

    deleteTicket(e) {
        console.log('Удаляем тикет');

        const currentTicketId = e.currentTarget.dataset.ticketId;

        let xhr = new XMLHttpRequest();
        let url = new URL('http://localhost:7070/');
        url.searchParams.set('method', 'deleteTicket');
        url.searchParams.set('id', currentTicketId);
        xhr.open('DELETE', url);
        xhr.send();

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.response);
                    this.updateList(data);
                } catch (e) {
                    console.error(e);
                }              
            }
        });
    }

    editTicket(e) {
        console.log('Редактируем тикет');

        const currentTicketId = e.currentTarget.dataset.ticketId;

        let formData = new FormData(document.forms[0]);

        formData.append('id', currentTicketId);

        let xhr = new XMLHttpRequest();
        let url = new URL('http://localhost:7070/');
        url.searchParams.set('method', 'editTicket');
        xhr.open('POST', url);
        xhr.send(formData);

        document.forms[0].reset();

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.response);
                    this.updateList(data);
                } catch (e) {
                    console.error(e);
                }              
            }
        });
    }

    getTickets() {
        let xhr = new XMLHttpRequest();
        let url = new URL('http://localhost:7070/');
        url.searchParams.set('method', 'allTickets');
        xhr.open('GET', url);
        xhr.send();

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.response);
                    console.log(data);
                    this.updateList(data);
                } catch (e) {
                    console.error(e);
                }              
            }
        });
    }

    getTicketData(e, method) {
        const currentTicketId = e.relatedTarget.closest('.ticket').dataset.id;
        e.target.querySelector('form').dataset.ticketId = currentTicketId;

        if (method != 'editTicket') return;

        this.ticketById(currentTicketId, (data) => {
            const { name, description } = data;
            document.forms[0].name.value = name;
            document.forms[0].description.value = description;
        });
    }

    showTicketDescription(ticket, id) {
        const currentTicket = ticket;
        const currentTicketId = id;

        const detailDesc = currentTicket.querySelector('.ticket-text__detail');
        detailDesc.classList.toggle('visually-hidden');

        if (detailDesc.textContent != '') return;

        const spinner = `
            <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Загрузка...</span>
            </div>        
        `;

        detailDesc.innerHTML = spinner;

        this.ticketById(currentTicketId, (data) => {
            const { description } = data;
            setTimeout(() => {
                detailDesc.innerHTML = '';
                detailDesc.textContent = description
            }, 2000);
        });
    }

    ticketById(id, callback) {
        let xhr = new XMLHttpRequest();
        let url = new URL('http://localhost:7070/');
        url.searchParams.set('method', 'ticketById');
        url.searchParams.set('id', id);
        xhr.open('GET', url);
        xhr.send();

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.response);
                    callback(data);
                } catch (e) {
                    console.error(e);
                }              
            }
        });
    }

    updateTicketStatus(id) {
        console.log('Статус тикета изменился');

        let xhr = new XMLHttpRequest();
        let url = new URL('http://localhost:7070/');
        url.searchParams.set('method', 'updateStatus');
        url.searchParams.set('id', id);
        xhr.open('GET', url);
        xhr.send();

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.response);
                    this.updateList(data);
                } catch (e) {
                    console.error(e);
                }              
            }
        });
    }

    updateList(data) {
        this.ticketsInProgress.innerHTML = '';
        this.ticketsDone.innerHTML = '';

        data.forEach(item => {

            if (item.status) {
                this.ticketsDone.append(Ticket.createTicket(item));
                return;
            }

            this.ticketsInProgress.append(Ticket.createTicket(item));
        })
    }
}