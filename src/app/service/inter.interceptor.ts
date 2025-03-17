import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class InterInterceptor implements HttpInterceptor {

  constructor(private token: TokenService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = req;
    const token1 = this.token.getToken();
    if (token1) {
      req = req.clone({
        setHeaders: {
          'User-Agent': 'nithyasri2023',
          'Authorization': 'Bearer ' + token1,
          'Content-Type': 'application/json', 
        }
      });
    }
    return next.handle(authReq);
  }
}
export const apiInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: InterInterceptor, multi: true },
];
