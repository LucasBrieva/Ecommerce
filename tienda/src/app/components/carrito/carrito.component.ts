import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { io } from 'socket.io-client';
import { GuestService } from 'src/app/services/guest.service';
declare var Cleave;
declare var StickySidebar;
declare var paypal;

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  @ViewChild('paypalButton', { static: true }) paypalElement!: ElementRef;


  public token;
  public url;
  public carrito_arr: Array<any> = [];
  public subtotal = 0;
  public id_cliente;
  public total_pagar: any = 0;
  public socket = io('http://localhost:4201/');
  public direccion_princial: any = {};
  public envios: Array<any> = [];
  public precio_envio = "0";

  public venta: any = {};
  public dVenta: Array<any> = [];

  constructor(
    private _clienteService: ClienteService,
    private _guestService: GuestService
  ) {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this.id_cliente = localStorage.getItem('_id');
    this.venta.cliente = this.id_cliente;

    this._guestService.get_envios().subscribe(
      res => {
        this.envios = res;
      }
    )
  }

  ngOnInit(): void {
    this.obtener_carrito();
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
    this.get_direccion_principal();

    paypal.Buttons({
      style: {
        layout: 'horizontal',
      },
      createOrder: (data, actions) => {

        return actions.order.create({
          purchase_units: [{
            description: 'Nombre del pago',
            amount: {
              currency_code: 'USD',
              value: 999
            },
          }]
        });

      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        console.log(order);

        this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;
        console.log(this.dVenta);

      },
      onError: err => {

      },
      onCancel: function (data, actions) {

      }
    }).render(this.paypalElement.nativeElement);

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

  get_direccion_principal() {
    this._clienteService.obtener_direccion_principal_cliente(localStorage.getItem('_id'), this.token).subscribe(
      res => {
        if (res.data == undefined) this.direccion_princial = undefined;
        else {
          this.direccion_princial = res.data;
          this.venta.direccion = this.direccion_princial._id;
        }

      },
      err => {

      }
    )
  }

  private calcular_carrito() {
    this.carrito_arr.forEach(e => {
      this.subtotal += parseInt(e.producto.precio);
    });
    this.calcular_total();
  }

  private obtener_carrito() {
    this._clienteService.obtener_carrito_cliente(this.id_cliente, this.token).subscribe(
      response => {
        this.carrito_arr = response.data;
        this.carrito_arr.forEach(e => {
          this.dVenta.push({
            producto: e.producto._id,
            subtotal: e.producto.precio,
            variedad: e.variedad,
            cantidad: e.cantidad,
            cliente: this.id_cliente
          })
        });
        this.subtotal = 0;
        this.total_pagar = 0;
        this.calcular_carrito();
      },
      error => {

      }
    );
  }

  calcular_total() {
    this.total_pagar = parseFloat(this.subtotal.toString()) + parseFloat(this.precio_envio);
    this.venta.subtotal = this.total_pagar;
    this.venta.envio_precio = parseFloat(this.precio_envio);
    this.envios.forEach(e => {
      if (this.precio_envio == e.precio) {
        this.venta.envio_titulo = e.titulo;
      }
    });
  }

}
