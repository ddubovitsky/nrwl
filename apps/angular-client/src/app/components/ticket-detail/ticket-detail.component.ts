import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TicketsState, TicketStateModel } from '../../store/tickets/tickets.state';
import { AssignTicket, LoadTicket, ToggleTicketCompletion } from '../../store/tickets/tickets.actions';
import { UsersState } from '../../store/users/users.state';
import { User } from '@acme/shared-models';

@Component({
    selector: 'acme-ticket-detail',
    templateUrl: './ticket-detail.component.html',
})
export class TicketDetailComponent implements OnInit {

    @Select(UsersState.usersLoading)
    usersLoading: Observable<boolean>;

    @Select(UsersState.usersList)
    usersList: Observable<User[]>;

    ticket$: Observable<TicketStateModel>;

    showInvalidParamError = false;

    constructor(public activatedRoute: ActivatedRoute, private store: Store) {
    }

    ngOnInit(): void {
        const ticketIdParam = this.activatedRoute.snapshot.paramMap.get('ticketId');
        const parsedIdParam = parseInt(ticketIdParam ?? 'NaN');
        if (isNaN(parsedIdParam)) {
            this.showInvalidParamError = true;
            return;
        }
        this.ticket$ = this.store.select(TicketsState.ticket(parsedIdParam));
        this.store.dispatch(new LoadTicket(parsedIdParam));
    }

    toggleTicketCompletion(ticketId: number, ticketCompletion: boolean) {
        this.store.dispatch(new ToggleTicketCompletion(ticketId, ticketCompletion));
    }

    assignUser(ticketId: number, userId: number) {
        this.store.dispatch(new AssignTicket(ticketId, userId));
    }
}
