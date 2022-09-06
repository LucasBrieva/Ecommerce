import { Injectable } from '@angular/core';
declare var iziToast: any;

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
  ) {

  }

  iziToast(mensaje: string, titulo: string, isSuccess: boolean) {
    iziToast.show({
      title: titulo,
      titleColor: isSuccess ? '#FFF' : '#F4EDED',
      backgroundColor: isSuccess ? '#83DF4E' : '#F54646',
      class: isSuccess ? 'text-success' : 'text-danger',
      position: 'topRight',
      message: mensaje,
      messageColor: isSuccess ? '#FFF' : '#F4EDED'
    })
  }
}
