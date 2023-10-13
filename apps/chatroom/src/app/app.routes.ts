import { Route } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { ShellComponent } from './shell/shell.component';
import { chatGuard } from './guards/chat.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'chats',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'chats',
    canActivate: [authGuard],
    component: ShellComponent,
    children: [
      {
        path: 'chat/:id',
        pathMatch: 'prefix',
        canActivate: [chatGuard],
        loadComponent: () =>
          import('./chat/chat.component').then((c) => c.ChatComponent),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./no-chat-selected/no-chat-selected.component').then(
            (c) => c.NoChatSelectedComponent
          ),
      },
    ],
  },
];
