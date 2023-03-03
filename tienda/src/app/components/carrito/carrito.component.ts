import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { io } from 'socket.io-client';
declare var Cleave;
declare var StickySidebar;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  public token;
  public url;
  public carrito_arr: Array<any> = [];
  public subtotal = 0;
  public id_cliente;
  public total_pagar = 0;
  public socket = io('http://localhost:4201/');
  constructor(
    private _clienteService: ClienteService
  ) {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this.id_cliente = localStorage.getItem('_id');
    this.obtener_carrito();
  }

  ngOnInit(): void {
    setTimeout(() => {
      new Cleave('#cc-number', {
        creditCard: true,
        onCreditCardTypeChanged: function (type) {
          debugger;
          if (type == 'visa') {
            this.setBlocks([4, 4, 4, 4])
          }
          else if (type == 'mastercard') {
            this.setBlocks([4, 4, 4, 4])
          }
          else if (type == 'amex') {
            this.setBlocks([4, 6, 5])
          }
          else {
            this.setBlocks([4, 4, 4, 4])
          }
        },
      });

      new Cleave('#cc-exp-date', {
        date: true,
        datePattern: ['m', 'y']
      });

      new Cleave('#cc-cvc', {
        blocks: [3],
        numericOnly: true
      });

      var sidebar = new StickySidebar('.sidebar-sticky ', { topSpacing: 20 });
    }, 500);
  }
  private obtener_carrito() {
    this._clienteService.obtener_carrito_cliente(this.id_cliente, this.token).subscribe(
      response => {
        this.carrito_arr = response.data;
        this.subtotal = 0;
        this.total_pagar = 0;
        this.calcular_carrito();
      },
      error => {

      }
    );
  }
  eliminar_item(id) {
    this._clienteService.eliminar_carrito_cliente(id, this.token).subscribe(
      response => {
        this.socket.emit('delete-carrito', { data: response.data });
        this.obtener_carrito();
      },
      error => {

      }
    )
  }

  private calcular_carrito() {
    this.carrito_arr.forEach(e => {
      this.subtotal += parseInt(e.producto.precio);
    });
    this.total_pagar = this.subtotal;
  }
}
