import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SeguridadService } from '../services/seguridad.service';

@Injectable({
  providedIn: 'root'
})
export class SeguridadGuard implements CanActivate {
  constructor(
    private _seguridadService: SeguridadService,
    private _router:Router,
  ){

  }
  canActivate():any{
    if(!this._seguridadService.isAuthenticated()){
      localStorage.clear();
      this._router.navigate(['/login']);
      return false;
    }
    return true;
  }

}
