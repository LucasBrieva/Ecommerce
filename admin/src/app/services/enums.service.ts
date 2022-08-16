import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnumsService {

  constructor() { }

  getWidthExcel(opt: any) {
    switch(opt){
      case "codigo": return 15;
      case "titulo": return 30;
      case "stock": return 15;
      case "precio": return 15;
      case "nventas": return 15;
      case "categoria": return 20;
      case "user": return 30;
      case "cantidad": return 15;
      case "descripcion": return 30;
      case "tipo": return 15;
      case "valor": return 15;
      case "limite": return 15;
      case "vencimiento": return 20;
      case "nombreCompleto": return 35;
      case "email": return 35;
      case "pais": return 15;
      case "telefono": return 15;
      case "genero": return 15;
      case "fechaNacimiento": return 20;
      case "dni": return 15;
      default: return "";
    }
  }
}
