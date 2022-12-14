import TicketsRequests from './TicketsRequests';

export default class Ticket {
  static createTicket(item) {
    const ticketDiv = document.createElement('div');
    ticketDiv.className = 'ticket row border p-3 bg-white';
    ticketDiv.dataset.id = item.id;

    const ticketStatusDiv = document.createElement('div');
    ticketStatusDiv.className = 'ticket-status col-md-1 text-center';

    const ticketStatusInput = document.createElement('input');
    ticketStatusInput.className = 'form-check-input';
    ticketStatusInput.type = 'checkbox';
    ticketStatusInput.checked = item.status;

    ticketStatusDiv.append(ticketStatusInput);

    const ticketData = `
            <div class="ticket-text col-md">
                <div class="ticket-text__name col-md-12">${item.name}</div>
                <div class="ticket-text__detail col-md-12 mt-2 visually-hidden"></div>                            
            </div>
            <div class="ticket-date col-md-2">${item.created}</div>
            <div class="ticket-actions col-md-1 d-flex flex-wrap justify-content-around align-content-start">
                <div class="btn-group">
                    <button type="button" class="btn btn-outline-secondary" role="group" data-bs-toggle="modal" data-bs-target="#ticketModal" data-title="Изменить тикет" data-method="editTicket">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>                                    
                    <span class="visually-hidden">Edit</span>
                    </button>
                    <button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#ticketModal" data-title="Удалить тикет" data-method="deleteTicket">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>                                     
                    <span class="visually-hidden">Delete</span>
                    </button>
                </div>
            </div>            
        `;
    ticketDiv.append(ticketStatusDiv);
    ticketDiv.insertAdjacentHTML('beforeend', ticketData);

    return ticketDiv;
  }

  static spinner() {
    return `
            <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Загрузка...</span>
            </div>             
        `;
  }

  static getTicketData(e, method) {
    const currentTicketId = e.relatedTarget.closest('.ticket').dataset.id;
    e.target.querySelector('form').dataset.ticketId = currentTicketId;

    if (method !== 'editTicket') return;

    TicketsRequests.ticketById(currentTicketId, (data) => {
      const { name, description } = data;
      document.forms[0].name.value = name;
      document.forms[0].description.value = description;
    });
  }

  static showTicketDescription(ticket, id) {
    const detailDesc = ticket.querySelector('.ticket-text__detail');
    detailDesc.classList.toggle('visually-hidden');

    if (detailDesc.textContent !== '') return;

    TicketsRequests.ticketById(id, (data) => {
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
}
