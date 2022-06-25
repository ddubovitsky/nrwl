import { Action, createSelector, Selector, State, StateContext, StateOperator } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Ticket } from '@acme/shared-models';
import { ApiService } from '../../services/api.service';
import { AssignTicket, CreateTicket, LoadTicket, LoadTickets, ToggleTicketCompletion } from './tickets.actions';
import { patch } from '@ngxs/store/operators';
import { tap } from 'rxjs';

export interface TicketStateModel {
    ticket: Ticket;
    updating: boolean;
}

interface TicketsMapStateModel {
    [tickedId: string]: TicketStateModel;
}

interface TicketsStateModel {
    tickets: TicketsMapStateModel;
    loadingTickets: boolean;
}

@State<TicketsStateModel>({
    name: 'TicketsState',
    defaults: {
        tickets: {},
        loadingTickets: false,
    },
})
@Injectable()
export class TicketsState {

    @Selector()
    static ticketsList(state: TicketsStateModel) {
        return Object.values(state.tickets);
    }

    @Selector()
    static ticketsMap(state: TicketsStateModel) {
        return state.tickets;
    }

    static ticket(ticketId: number) {
        return createSelector(
            [TicketsState.ticketsMap],
            (ticketsMap: TicketsMapStateModel) => {
                return ticketsMap[ticketId];
            });
    }

    @Selector()
    static ticketsLoading(state: TicketsStateModel) {
        return state.loadingTickets;
    }

    constructor(public api: ApiService) {
    }

    @Action(LoadTickets)
    public loadTickets(ctx: StateContext<TicketsStateModel>) {
        ctx.patchState({ loadingTickets: true });
        this.api.tickets().subscribe((tickets) => {
            ctx.patchState({
                loadingTickets: false,
                tickets: ticketsListToTicketsMap(tickets),
            });
        });
    }

    @Action(LoadTicket)
    public loadTicket(ctx: StateContext<TicketsStateModel>, action: LoadTicket) {
        const currentTicket = ctx.getState().tickets[action.ticketId];
        const updatingState = {
            updating: true,
        };
        ctx.setState(
            patchTicket(action.ticketId, currentTicket ? patch(updatingState) : updatingState),
        );
        this.api.ticket(action.ticketId).subscribe((ticket) => {
            ctx.setState(
                patchTicket(action.ticketId, patch<TicketStateModel>({
                    updating: false,
                    ticket: ticket,
                })),
            );
        });
    }

    @Action(ToggleTicketCompletion)
    public toggleTicketCompletion(ctx: StateContext<TicketsStateModel>, action: ToggleTicketCompletion) {
        const updatingState = {
            updating: true,
        };
        ctx.setState(
            patchTicket(action.ticketId, patch(updatingState)),
        );
        return this.api.complete(action.ticketId, action.ticketCompletion)
            .pipe(
                tap(() =>
                    ctx.setState(
                        patchTicket(action.ticketId, patch<TicketStateModel>({
                            updating: false,
                            ticket: patch({
                                completed: action.ticketCompletion,
                            }),
                        })),
                    )),
            );
    }

    @Action(AssignTicket)
    public assignTicket(ctx: StateContext<TicketsStateModel>, action: AssignTicket) {
        const updatingState = {
            updating: true,
        };
        ctx.setState(
            patchTicket(action.ticketId, patch(updatingState)),
        );
        return this.api.assign(action.ticketId, action.userId)
            .pipe(
                tap(() =>
                    ctx.setState(
                        patchTicket(action.ticketId, patch<TicketStateModel>({
                            updating: false,
                            ticket: patch({
                                assigneeId: action.userId,
                            }),
                        })),
                    )),
            );
    }

    @Action(CreateTicket)
    public createTicket(ctx: StateContext<TicketsStateModel>, action: CreateTicket) {
        return this.api.newTicket({ description: action.ticketDescription })
            .pipe(
                tap((ticket) =>
                    ctx.setState(
                        patch<TicketsStateModel>({
                            tickets: patch({
                                [ticket.id]: {
                                    ticket: ticket,
                                    updating: false,
                                },
                            }),
                        }),
                    )),
            );
    }
}

function patchTicket(ticketId: number, patchObject: Partial<TicketStateModel> | StateOperator<TicketStateModel>) {
    return patch<TicketsStateModel>({
        tickets: patch({
            [ticketId]: patchObject,
        }),
    });
}

function ticketsListToTicketsMap(tickets: Ticket[]): TicketsMapStateModel {
    return tickets.reduce((acc, it) => {
        acc[it.id] = {
            ticket: it,
            updating: false,
        };
        return acc;
    }, {} as TicketsMapStateModel);
}
