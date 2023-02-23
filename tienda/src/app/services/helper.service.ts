import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { GLOBAL } from "./GLOBAL"

declare var iziToast: any;

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  public url:any;

  constructor(
    private _http: HttpClient,
  ) {
    this.url = GLOBAL.url;
  }

  iziToast(mensaje: string, titulo: string, isSuccess: boolean) {
    iziToast.show({
      title: titulo,
      titleColor: isSuccess ? '#1DC74C' : '#FF0000',
      color: '#FFF',
      class: isSuccess ? 'text-success' : 'text-danger',
      position: 'topRight',
      message: mensaje,
    })
  }

  togglePassword(id: string){
    var input = document.getElementById(id) as HTMLInputElement | null;
    if(input != null){
      if(input.type == "password")
        input.type = "text";
      else
        input.type = "password";
    }
  }
}
