// class Ticket {
//     constructor(id, name) {
//         this.id = id;
//         this.name = name;
//         this.status = false;
//         this.created = this.createDate();
//     }

//     createDate() {
//         const date = new Date();
//         return `${date.getDate()}.${date.getMonth()}.${date.getFullYear().toString().slice(-2)} ${date.getHours()}:${date.getMinutes()}`;
//     }
// }

// const ticket1 = new Ticket(1, 'Поменять краску в принтере, ком. 404');
// const ticket2 = new Ticket(2, 'Переустановить Windows, ПК-Hall24');
// let ticket2;
// setTimeout(() => {ticket2 = new Ticket(2, 'Переустановить Windows, ПК-Hall24')}, 1000);
// const ticket3 = new Ticket(3, 'Установить обновление KB-XXX');
// let ticket3;
// setTimeout(() => {ticket3 = new Ticket(3, 'Установить обновление KB-XXX')}, 2000);



// const tickets = [];

// setTimeout(() => {
//     tickets.push(ticket1, ticket2, ticket3);
//     console.log(tickets);
// }, 3000);
// tickets.push(ticket1, ticket2, ticket3);

// console.log(tickets);

// class TicketFull extends Ticket {
//     constructor(id, name, description) {
//         super(id, name);
//         this.description = description;
//     }
// }

// const ticketFull1 = new TicketFull(1, 'Поменять краску в принтере, ком. 404', 'ДЕТАЛЬНО Поменять краску в принтере, ком. 404');
// const ticketFull2 = new TicketFull(2, 'Переустановить Windows, ПК-Hall24', 'ДЕТАЛЬНО Переустановить Windows, ПК-Hall24');
// const ticketFull3 = new TicketFull(3, 'Установить обновление KB-XXX', 'ДЕТАЛЬНО Установить обновление KB-XXX');

// const ticketsFull = [];
// ticketsFull.push(ticketFull1, ticketFull2, ticketFull3);

// console.log(ticketsFull);


// let formData = new FormData(document.forms[0]);
// formData.append('id', '4');
// formData.append('name ', 'Test 4 name');
// formData.append('description ', 'Test 4 description');
// console.log(formData);

// let xhr = new XMLHttpRequest();

// let url = new URL('http://localhost:7070/');
// url.searchParams.set('method', 'allTickets');
// url.searchParams.set('method', 'ticketById');
// url.searchParams.set('id', '2');
// console.log(url);

// xhr.open('GET', url);
// xhr.send();

// console.log(document.forms[0])

// document.forms[0].addEventListener('submit', (e) => {
//     e.preventDefault();
//     let formData = new FormData(document.forms[0]);
//     let xhr = new XMLHttpRequest();
//     let url = new URL('http://localhost:7070/');
//     url.searchParams.set('method', 'createTicket');
//     xhr.open('POST', url);
//     xhr.send(formData);
// })

// Загрузка данных с сервера
// let xhr = new XMLHttpRequest();
// let url = new URL('http://localhost:7070/');
// url.searchParams.set('method', 'allTickets');
// xhr.open('GET', url);
// xhr.send();

// xhr.addEventListener('load', () => {
//     if (xhr.status >= 200 && xhr.status < 300) {
//         try {
//             const data = JSON.parse(xhr.responseText);
//             console.log(data);
//         } catch (e) {
//             console.error(e);
//         }
//     }
// });

import Tickets from "./Tickets";
const tickets = new Tickets();
tickets.init();