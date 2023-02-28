import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { io } from 'socket.io-client';
declare var $;
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public url;
  public token:any;
  public idUser:any;
  public user:any = undefined;
  public user_lc:any= undefined;
  public config_global:any= [];
  public op_cart = false;
  public carrito_arr : Array<any> = [];
  public subtotal = 0;
  public socket =io('http://localhost:4201/');

  constructor(
    private _clienteService: ClienteService,
    private _router: Router
  ) {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this.idUser = localStorage.getItem('_id');

    this._clienteService.obtener_config_public().subscribe(
      response => {
        this.config_global = response.data;
      },
      error => {

      }
    );

    if(this.idUser != null && this.token != null){
      if(localStorage.getItem('user_data')){
        var user_data :any = localStorage.getItem('user_data');
        this.user_lc = JSON.parse(user_data);

        this.obtener_carrito();
      }else{
        this._clienteService.obtener_cliente_guest(this.idUser, this.token).subscribe(
          res=>{
            this.user = res.data;
            this.user_lc = this.user;
            localStorage.setItem('user_data', JSON.stringify(this.user));
          },
          err=>{
            this.user = undefined;
          }
        )
        this.user_lc = undefined;
      }

    }
  }

  obtener_carrito(){
    this._clienteService.obtener_carrito_cliente(this.user_lc._id, this.token).subscribe(
      response =>{
        this.carrito_arr = response.data;
        this.subtotal = 0;
        this.calcular_carrito();
      },
      error=>{

      }
    );
  }
  ngOnInit(): void {
    this.socket.on('new-carrito', this.obtener_carrito.bind(this));
    this.socket.on('new-carrito-add', this.obtener_carrito.bind(this));
  }

  logOut(){
    localStorage.clear();
    this.user_lc = undefined;
    this._router.navigate(['/']);
  }
 // TODO: Ver de utilizar esto para el problemita con las imagenes
  opModalCart(){
    if(!this.op_cart){
      this.op_cart = true;
      $('#cart').addClass('show');
    }
    else{
      this.op_cart = false;
      $('#cart').removeClass('show');
    }
  }

  eliminar_item(id){
    this._clienteService.eliminar_carrito_cliente(id, this.token).subscribe(
      response=>{
        this.socket.emit('delete-carrito',{data:response.data});
      },
      error=>{

      }
    )
  }

  private calcular_carrito(){
    this.carrito_arr.forEach(e=>{
      this.subtotal += parseInt(e.producto.precio);
    })
  }
}
