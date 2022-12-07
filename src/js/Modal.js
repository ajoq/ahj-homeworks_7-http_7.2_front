export default class Modal {
    constructor(modal) {
        this.modal = modal;
        this.modalTitle = document.getElementById('ticketModalLabel');
        this.modalBody = document.getElementById('modalBody');
    }

    showModal(e) {
        const showBtn = e.relatedTarget;
        const title = showBtn.dataset.title;
        this.modalTitle.textContent = title;

        this.modalBody.innerHTML = '';
        const method = showBtn.dataset.method;

        this.createContent(method);
    }

    createContent(method) {
        let formBody;

        if (method === 'deleteTicket') {
            formBody = `
                <div class="mb-3">
                    <p>Вы уверены, что хотите удалить тикет? Это действие необратимо</p>
                </div>            
            `;
        } else {
            formBody = `
            <div class="mb-3">
                <label for="ticketName" class="form-label">Краткое описание</label>
                <input type="text" name="name" class="form-control" id="ticketName" required>
            </div>
            <div class="mb-3">
                <label for="ticketDescription" class="form-label">Подробное описание</label>
                <textarea class="form-control" name="description" id="ticketDescription" rows="3"></textarea>
            </div>        
            `
        }

        const form = `
            <form data-method="${method}">
                ${formBody}
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                    <button type="submit" class="btn btn-primary">ОК</button>
                </div>
            </form>        
        `;

        this.modalBody.insertAdjacentHTML('beforeend', form);
    }
}