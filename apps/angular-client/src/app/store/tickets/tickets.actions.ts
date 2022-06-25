export class LoadTickets {
    static readonly type = '[Tickets] Load Tickets';
}

export class LoadTicket {
    static readonly type = '[Tickets] Load Ticket';

    constructor(public ticketId: number) {
    }
}


export class ToggleTicketCompletion {
    static readonly type = '[Tickets] Toggle Ticket Completion';

    constructor(public ticketId: number, public ticketCompletion: boolean) {
    }
}

export class AssignTicket {
    static readonly type = '[Tickets] Assign Ticket';

    constructor(public ticketId: number, public userId: number) {
    }
}

export class CreateTicket {
    static readonly type = '[Tickets] Create Ticket';

    constructor(public ticketDescription: string) {
    }
}
