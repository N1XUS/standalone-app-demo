import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ApplicationRef } from '@angular/core';
import { ThemingService } from '@fundamental-ngx/core/theming';

bootstrapApplication(AppComponent, appConfig)
  .then((appRef: ApplicationRef) => {
    const theming = appRef.injector.get(ThemingService);
    theming.setTheme(localStorage.getItem('theming') || 'sap_horizon');
  })
  .catch((err) => console.error(err));
