import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL"
import { HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public url:any;

  constructor(
    private _http: HttpClient,
  ) {
  this.url = GLOBAL.url;
  }

  login_cliente(data):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url+'login_cliente/', data, {headers:headers});

  }

  obtener_cliente_guest(id, token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.get(this.url+'obtener_cliente_guest/' + id, {headers:headers});
  }

  actualizar_perfil_cliente_guest(id, data, token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.put(this.url+'actualizar_perfil_cliente_guest/' + id, data, {headers:headers});
  }

  registro_cliente(data):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url+'registro_cliente/', data, {headers:headers});
  }

  obtener_config_public(): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get(this.url + 'obtener_config_public/', { headers: headers });
  }
  listar_productos_filtro_publico(filtro): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get(this.url + 'listar_productos_filtro_publico/' + filtro, { headers: headers });
  }

  agregar_carrito_cliente(data, token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.post(this.url+'agregar_carrito_cliente/', data, {headers:headers});
  }

  obtener_carrito_cliente(id, token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization': token});
    return this._http.get(this.url+'obtener_carrito_cliente/' + id, {headers:headers});
  }

  eliminar_carrito_cliente(id, token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.delete(this.url + 'eliminar_carrito_cliente/' +id, {headers:headers});
  }
}
