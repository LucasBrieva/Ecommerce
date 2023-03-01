import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL"
import { HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url:any;

  constructor(
    private _http: HttpClient,
  ) {
  this.url = GLOBAL.url;
  }


  obtener_producto_slug_publico(slug): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get(this.url + 'obtener_producto_slug_publico/' + slug, { headers: headers });
  }
  listar_productos_recomendados_publico(categoria): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get(this.url + 'listar_productos_recomendados_publico/' + categoria, { headers: headers });
  }
  get_regiones(): Observable<any> {
    return this._http.get('./assets/regiones.json');
  }
  get_provincias(): Observable<any> {
    return this._http.get('./assets/provincias.json');
  }
  get_ciudades(): Observable<any> {
    return this._http.get('./assets/distritos.json');
  }
}
