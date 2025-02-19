import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, NEVER, Observable, of, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { SeguridadService } from '../core/services/seguridad.service';
import { catchError, throwIfEmpty } from 'rxjs/operators';
import { FuncionesMtcService } from '../core/services/funciones-mtc.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private seguridadService: SeguridadService,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.seguridadService.isAuthenticated()) {
      const token = this.seguridadService.getToken();
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.seguridadService.postLogout();
          this.modalService.dismissAll();
          this.router.navigate(['/autenticacion/iniciar-sesion']);
          this.funcionesMtcService
            .mensajeWarn('Su sesión ha expirado, por favor inicie sesión nuevamente');
          return NEVER;
        }
        if (error.status === 403) {
          this.seguridadService.postLogout();
          this.modalService.dismissAll();
          this.router.navigate(['/autenticacion/iniciar-sesion']);
          this.funcionesMtcService
            .mensajeWarn('Usted no tiene los permisos necesarios para visualizar esta página, por favor inicie sesión nuevamente');
          return NEVER;
        }
        return throwError(error);
      })
    );
  }
}
