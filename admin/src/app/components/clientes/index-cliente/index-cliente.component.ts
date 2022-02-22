import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast: any;
declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css']
})
export class IndexClienteComponent implements OnInit {

  public clientes : Array<any> =[];
  public filtro_nombre = '';
  public filtro_apellido = '';
  public filtro_correo = '';
  public cliente:any = {};

  public page = 1;
  public pageSize = 10;
  public token: any;
  public load_data=true;

  constructor(
    private _clienteService : ClienteService,
    private _adminService : AdminService
  ) {
    this.token = this._adminService.getToken();
   }

  ngOnInit(): void {
    this.initData();
  }

  initData(){
    this._clienteService.listar_clientes_filtro_admin(null, null, this.token).subscribe(
      response => {
        this.clientes = response.data;
        this.load_data = false;
      },
      error=>{
      }
    )
  }

  filtro(tipo:any){
    if(tipo=="nombre"){
      if(this.filtro_nombre){
        this.metFiltro(tipo, this.filtro_nombre);
      }else{
        this.initData()
      }
    }else if(tipo == "correo"){
      if(this.filtro_correo){
        this.metFiltro(tipo, this.filtro_correo)
      }else{
        this.initData()
      }
    }
    else if(tipo == "apellido"){
      if(this.filtro_apellido){
        this.metFiltro(tipo, this.filtro_apellido)
      }else{
        this.initData()
      }
    }
  }
  metFiltro(tipo: any, filtro: any){
    this.load_data = true;
    this._clienteService.listar_clientes_filtro_admin(tipo, filtro, this.token).subscribe(
      response => {
        this.clientes = response.data;
        this.load_data = false;
      },
      error=>{
      }
    )
  }

  obtenerCliente(id:any){
    this._clienteService.obetener_cliente_admin(id,this.token).subscribe(
      response =>{
        if(response.data == undefined){
          this.cliente = undefined;
        }else{
          this.cliente = response.data;
        }
      },
      error =>{

      }
    )
  }

  baja(id:any){
    this.obtenerCliente(id);
    this._clienteService.baja_cliente_admin(id, this.cliente, this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'CLIENTE DADO DE BAJA',
          titleColor:'#FFF',
          backgroundColor:'#83DF4E',
          class:'text-danger',
          position: 'topRight',
          message: 'El cliente fue dado de baja correctamente',
          messageColor:'#FFF'
        });
        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.initData();
      },
      error=>{
        iziToast.show({
          title: 'ERROR',
          titleColor:'#F4EDED',
          backgroundColor:'#F54646',
          class:'text-danger',
          position: 'topRight',
          message: 'No se pudo dar de baja el cliente',
          messageColor:'#F4EDED'
        })
      }
    )
  }
}
