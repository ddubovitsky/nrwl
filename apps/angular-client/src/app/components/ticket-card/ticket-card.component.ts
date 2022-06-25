import { Component, Input, OnInit } from '@angular/core';
import { Ticket, User } from '@acme/shared-models';
import { Select, Store } from '@ngxs/store';
import { UsersState } from '../../store/users/users.state';
import { Observable } from 'rxjs';

@Component({
    selector: 'acme-ticket-card',
    templateUrl: './ticket-card.component.html',
})
export class TicketCardComponent implements OnInit {

    @Select(UsersState.usersLoading)
    usersLoading: Observable<boolean>;

    @Input()
    ticket: Ticket;

    assignedUser: Observable<User>;


    constructor(private store: Store) {
    }

    ngOnInit(): void {
        if (!this.ticket.assigneeId) {
            return;
        }
        this.assignedUser = this.store.select(UsersState.user(this.ticket.assigneeId));
    }
}
