import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';

import { FilterOption, TicketsComponent } from './tickets.component';
import { ApiService } from '../../services/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { TicketsState } from '../../store/tickets/tickets.state';
import { UsersState } from '../../store/users/users.state';
import { CreateTicket } from '../../store/tickets/tickets.actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

const completedTicket = {
    ticket: {
        id: 1,
        description: 'test desc',
        completed: true,
    },
    updating: false,
};

const uncompletedTicket = {
    ticket: {
        id: 2,
        description: 'test desc 2',
        completed: false,
    },
    updating: false,
};

describe('TicketsComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([TicketsState, UsersState]),
            ],
            providers: [ApiService],
            declarations: [TicketsComponent],
        });
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(TicketsComponent);
        const component = fixture.componentInstance;
        const apiService = TestBed.inject(ApiService);
        jest.spyOn(apiService, 'tickets').mockImplementation(() => of([]));
        jest.spyOn(apiService, 'users').mockImplementation(() => of([]));
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('should filter by value', () => {
        const component = new TicketsComponent(TestBed.inject(Store));
        const allTickets = [
            completedTicket, uncompletedTicket,
        ];
        const filteredAllTickets = component.filterList(allTickets, FilterOption.All);
        const filteredCompletedTickets = component.filterList(allTickets, FilterOption.Completed);
        const filteredPendingTickets = component.filterList(allTickets, FilterOption.Pending);
        expect(filteredAllTickets).toEqual(allTickets);
        expect(filteredCompletedTickets).toEqual([completedTicket]);
        expect(filteredPendingTickets).toEqual([uncompletedTicket]);

    });

    it('should filter list by provided filter', () => {
        const fixture = TestBed.createComponent(TicketsComponent);
        const component = fixture.componentInstance;
        const apiService = TestBed.inject(ApiService);
        jest.spyOn(apiService, 'tickets').mockImplementation(() => of([]));
        jest.spyOn(apiService, 'users').mockImplementation(() => of([]));
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('should dispatch create ticket action with ticket description', () => {
        const ticketDescription = 'testTicketDescription';
        const store = TestBed.inject(Store);
        const component = new TicketsComponent(store);
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        component.createTicketDescription = ticketDescription;

        component.createTicket();

        expect(dispatchSpy).toHaveBeenCalledWith(new CreateTicket(ticketDescription));
    });
});
