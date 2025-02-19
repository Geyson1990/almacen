import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { SeguridadService } from '../core/services/seguridad.service';
import { FuncionesMtcService } from '../core/services/funciones-mtc.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(
    private router: Router,
    private seguridadService: SeguridadService,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal
  ) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.seguridadService.isAuthenticated()) {
      this.seguridadService.postLogout();
      this.modalService.dismissAll();
      this.funcionesMtcService.mensajeWarn('Su sesión ha expirado, vuelva a iniciar sesión');
      this.router.navigate(['autenticacion/iniciar-sesion']);
      return false;
    }
    return true;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.seguridadService.isAuthenticated()) {
      this.seguridadService.postLogout();
      this.modalService.dismissAll();
      this.funcionesMtcService.mensajeWarn('Su sesión ha expirado, vuelva a iniciar sesión');
      return this.router.createUrlTree(['autenticacion/iniciar-sesion']);
    }
    return true;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.seguridadService.isAuthenticated()) {
      this.seguridadService.postLogout();
      this.modalService.dismissAll();
      this.funcionesMtcService.mensajeWarn('Su sesión ha expirado, vuelva a iniciar sesión');
      return this.router.createUrlTree(['autenticacion/iniciar-sesion']);
    }
    return true;
  }

}
