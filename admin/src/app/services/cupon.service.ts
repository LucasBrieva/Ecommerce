import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL"
import { HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CuponService {

  public url:any;

  constructor(
    private _http: HttpClient,
  ) {
  this.url = GLOBAL.url;
  }

  //#region GET

  baja_cupon_admin(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.get(this.url+'baja_producto_admin/'+ id, {headers:headers});
  }

  obtener_cupon_admin(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.get(this.url+'obtener_cupon_admin/'+ id, {headers:headers});
  }

  //#endregion

  //#region POST

  registro_cupon_admin(data:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.post(this.url+'registro_cupon_admin', data, {headers:headers});
  }

  listar_cupones_filtro_admin(filtro:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.post(this.url+'listar_cupones_filtro_admin/', filtro, {headers:headers});
  }

  //#endregion
  
  //#region PUT

  actualizar_cupon_admin(id:any, data:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.put(this.url+'actualizar_cupon_admin/'+ id, data, {headers:headers});
  }

  //#endregion
  
}
