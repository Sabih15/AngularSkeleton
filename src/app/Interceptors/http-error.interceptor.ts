import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
      //retry(1), uncomment this to inforce all http requests will be retried once before failing
      catchError((err: HttpErrorResponse) => {
        let errorMessage = '';

        if (err.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${err.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${err.status} - ${err.statusText} \nMessage: ${err.message}`;
          if (err.status) {
            switch (err.status) {
              case 401:
                {
                  this.router.navigate(["/auth/login"])
                }
              case 403:
                {
                  this.router.navigate(["/auth/login"])
                }
              case 404:
                {
                  //this.common.showErrorSnackbar(this.common.responseMessages.GeneralError);
                  break;
                }

              case 500:
                {
                  //this.common.showErrorSnackbar(this.common.responseMessages.ServerError);
                  break;
                }
            }
          }
        }

        return throwError(errorMessage);
      })
      )
  }
}
