import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { TicketComponent } from './components/ticket/ticket.component';
import { ViewTicketsComponent } from './components/view-tickets/view-tickets.component';
import { UserTicketsComponent } from './components/user-tickets/user-tickets.component';
import { SharedQueueTicketsComponent } from './components/shared-queue-tickets/shared-queue-tickets.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'ticket', component: TicketComponent },
  { path: 'view-tickets', component: ViewTicketsComponent }, // Fixed import and added route
  {path: 'usertickets', component: UserTicketsComponent}, // Added route for UserTicketsComponent
  {path: 'sharedqueuetickets', component: SharedQueueTicketsComponent} // Added route for SharedQueueTicketsComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
