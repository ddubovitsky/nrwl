import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { TicketsComponent } from './components/tickets/tickets.component';
import { TicketCardComponent } from './components/ticket-card/ticket-card.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';
import { NgxsModule } from '@ngxs/store';
import { TicketsState } from './store/tickets/tickets.state';
import { UsersState } from './store/users/users.state';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [AppComponent, TicketsComponent, TicketCardComponent, TicketDetailComponent],
    imports: [
        HttpClientModule,
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(
            [
                { path: '', component: TicketsComponent },
                { path: ':ticketId', component: TicketDetailComponent },

                { path: '**', redirectTo: '/' },
            ],
            {
                initialNavigation: 'enabledBlocking',
            },
        ),
        NgxsModule.forRoot([
            TicketsState,
            UsersState
        ]),
    ],
    providers: [ApiService],
    bootstrap: [AppComponent],
})
export class AppModule {
}
