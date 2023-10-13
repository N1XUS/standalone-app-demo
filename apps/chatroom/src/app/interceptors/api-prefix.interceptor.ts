import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { environment } from '../environments/environment';

export const apiPrefixInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  if (!/^(http|https):/i.test(req.url)) {
    req = req.clone({
      url: `${environment.serverUrl}${
        !environment.serverUrl.endsWith('/') && req.url.startsWith('/')
          ? ''
          : '/'
      }${req.url}`,
    });
  }
  return next(req);
};
