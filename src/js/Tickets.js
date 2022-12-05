import Ticket from "./Ticket";

export default class Tickets {
    constructor() {
        this.ticketsList = document.querySelector('.tickets-list');
        this.ticketsInProgress = this.ticketsList.querySelector('.tickets-list__in-progress');
        this.ticketsDone = this.ticketsList.querySelector('.tickets-list__done');
        this.createTicketBtn = document.querySelector('.create-ticket');
    }

    init() {
        this.getTickets();
        this.events();
    }

    events() {
        this.createTicketBtn.addEventListener('click', (e) => {
            console.log('Добавляем тикет')
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
                    const data = JSON.parse(xhr.responseText);
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