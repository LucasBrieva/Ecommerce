import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  public token;
  public url;
  public carrito_arr : Array<any> = [];
  public subtotal = 0;
  public id_cliente;
  public total_pagar = 0;
  constructor(
    private _clienteService: ClienteService
  ) {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this.id_cliente = localStorage.getItem('_id');
    this._clienteService.obtener_carrito_cliente(this.id_cliente, this.token).subscribe(
      response =>{
        this.carrito_arr = response.data;
        this.calcular_carrito();
      },
      error=>{

      }
    );
   }

  ngOnInit(): void {
  }

  eliminar_item(id){
    this._clienteService.eliminar_carrito_cliente(id, this.token).subscribe(
      response=>{
        //TODO: Entiendo que acá luego va a hacer dinamica el muestreo del producto
        console.log(response);
      },
      error=>{

      }
    )
  }

  private calcular_carrito(){
    this.carrito_arr.forEach(e=>{
      this.subtotal += parseInt(e.producto.precio);
    });
    this.total_pagar = this.subtotal;
  }
}
