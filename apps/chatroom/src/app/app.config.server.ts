import {
  mergeApplicationConfig,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { appRoutes } from './app.routes';
import { provideTheming } from '@fundamental-ngx/core/theming';
import { provideClientHydration } from '@angular/platform-browser';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { CookieService } from 'ngx-cookie-service';
import { apiPrefixInterceptor } from './interceptors/api-prefix.interceptor';
import { ServerSocketService } from './socket/server-socket.service';
import { SocketService } from './socket/socket.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([apiPrefixInterceptor])),
    provideClientHydration(),
    provideServerRendering(),
    SsrCookieService,
    {
      provide: CookieService,
      useExisting: SsrCookieService,
    },
    {
      provide: SocketService,
      useClass: ServerSocketService,
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
