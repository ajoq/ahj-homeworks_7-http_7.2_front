import * as bootstrap from 'bootstrap'
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
            document.forms[0].addEventListener('submit', (e) => this.submitMethod(e));
        });
    }

    submitMethod(e) {
        e.preventDefault();
        console.log('Произошло событие submit');
        console.log(e.target);

        const method = e.target.dataset.method;

        switch(method) {
            case 'createTicket':
                this.createTicket();
            // case 'editTicket':
            //     this.createEditTicket(method);
            //     return; 
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