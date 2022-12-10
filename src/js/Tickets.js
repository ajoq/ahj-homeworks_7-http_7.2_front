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

            if (document.forms[0].dataset.method === 'editTicket') {
                this.getTicketData(e);
            }

            document.forms[0].addEventListener('submit', (e) => this.submitMethod(e));
        });
    }

    submitMethod(e) {
        e.preventDefault();
        console.log('Произошло событие submit');

        const method = e.target.dataset.method;

        switch(method) {
            case 'createTicket':
                this.createTicket();
            case 'editTicket':
                this.editTicket();
            // case 'deleteTicket':
            //     this.deleteTicket();
            //     return;                
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

    editTicket() {
        console.log('Редактируем тикет');
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
                    // callback(data);
                } catch (e) {
                    console.error(e);
                }              
            }
        });
    }

    getTicketData(e) {
        const currentTicketId = e.relatedTarget.closest('.ticket').dataset.id;
        this.ticketById(currentTicketId, (data) => {
            const { name, description } = data;
            document.forms[0].name.value = name;
            document.forms[0].description.value = description;
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