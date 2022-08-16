import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiccionarioService {

  constructor() { }

  get_diccionario(opt: string) {

    switch (opt) {
      case "codigo": return "Código";
      case "titulo": return "Título";
      case "stock": return "Stock";
      case "precio": return "Precio";
      case "nventas": return "N° Ventas";
      case "categoria": return "Categoría";
      case "user": return "Usuario";
      case "cantidad": return "Cantidad";
      case "descripcion": return "Descripción";
      case "tipo": return "Tipo";
      case "valor": return "Valor";
      case "limite": return "Límite";
      case "vencimiento": return "Vencimiento";
      case "nombreCompleto": return "Nombre completo";
      case "email": return "Email";
      case "pais": return "País";
      case "telefono": return "Teléfono";
      case "genero": return "Genero";
      case "fechaNacimiento": return "Fecha de nacimiento";
      case "dni": return "D.N.I";
      default: return "";
    }
  }
}
