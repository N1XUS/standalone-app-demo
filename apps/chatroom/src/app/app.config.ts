import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from './app.routes';
import { provideTheming } from '@fundamental-ngx/core/theming';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { apiPrefixInterceptor } from './interceptors/api-prefix.interceptor';
import { SocketService } from './socket/socket.service';
import { provideClientHydration } from '@angular/platform-browser';
import { SettingsGeneratorModule } from '@fundamental-ngx/platform/settings-generator';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    provideHttpClient(withInterceptors([apiPrefixInterceptor])),
    provideClientHydration(),
    importProvidersFrom(SettingsGeneratorModule),
    provideTheming({
      defaultTheme: 'sap_horizon',
    }),
    CookieService,
    SocketService,
  ],
};
