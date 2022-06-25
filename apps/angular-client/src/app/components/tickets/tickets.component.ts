import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { TicketsState, TicketStateModel } from '../../store/tickets/tickets.state';
import { CreateTicket, LoadTickets } from '../../store/tickets/tickets.actions';

export enum FilterOption {
    All,
    Completed,
    Pending
}

@Component({
    selector: 'acme-tickets',
    templateUrl: './tickets.component.html',
    styleUrls: ['./tickets.component.css'],
})
export class TicketsComponent implements OnInit {
    readonly ticketFilters = FilterOption;

    tickets$ = this.store.select(TicketsState.ticketsList);
    ticketsLoading$ = this.store.select(TicketsState.ticketsLoading);

    currentFilter = FilterOption.All;

    creatingTicket: boolean;
    createTicketDescription: string;

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        this.store.dispatch(new LoadTickets());
    }

    createTicket() {
        this.creatingTicket = true;
        this.store.dispatch(new CreateTicket(this.createTicketDescription)).subscribe(() => {
            this.creatingTicket = false;
            this.createTicketDescription = '';
        });
    }

    trackById(index: number, ticket: TicketStateModel) {
        return ticket.ticket.id;
    }

    selectFilter(filter: FilterOption) {
        this.currentFilter = filter;
    }

    filterList(list: TicketStateModel[] | null, filter: FilterOption): TicketStateModel[] | null {
        if (!list) {
            return list;
        }
        if (filter === FilterOption.All) {
            return list;
        }

        if (filter === FilterOption.Pending) {
            return list.filter((it) => !it.ticket.completed);
        }

        if (filter === FilterOption.Completed) {
            return list.filter((it) => it.ticket.completed);
        }

        throw new Error('unknown filter');
    }
}
