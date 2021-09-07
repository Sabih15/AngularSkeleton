import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HelperService } from '../Services/helper.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private helperService: HelperService){

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${'Your token here'}`,
      },
    });

    return next.handle(req);
  }
}