import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor() { }

  public isAuthenticated(): boolean {
    const token: any = localStorage.getItem('token');


    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);
      if (!decodedToken) {
        localStorage.removeItem('token');
        return false;
      }
    } catch (Exception) {
      localStorage.removeItem('token');
      return false;
    }

    return true;
  }
}
