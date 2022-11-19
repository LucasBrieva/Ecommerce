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

      if(helper.isTokenExpired(token)){
        localStorage.clear();
        return false;
      }
      if (!decodedToken) {
        localStorage.clear();
        return false;
      }
    } catch (Exception) {
      localStorage.clear();
      return false;
    }

    return true;
  }


}
