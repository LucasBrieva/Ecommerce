import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast: any;
declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {
  
  public productos : Array<any> =[];
  //public filtro_categoria = '';

  public load_data=true;
  public token: any;
  public page = 1;
  public pageSize = 10;
  public url:any; 
  public filtro:any = {
    titulo: "",
    codigo: ""
  };

  constructor(
    private _productoService : ProductoService,
    private _adminService : AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;
   }

  ngOnInit(): void {
    this.metFiltro();
  }

  filtrar(){
    this.metFiltro();
  }
  limpiarFiltro(){
    this.filtro.titulo = '';
    this.filtro.codigo = '';
    this.metFiltro();
  }
  metFiltro(){
    this.load_data = true;
    this._productoService.listar_productos_filtro_admin(this.filtro, this.token).subscribe(
      response => {
        this.productos = response.data;
        this.load_data = false;
      },
      error=>{
        console.log(error);
      }
    )
  }
  
  obtenerProducto(id:any){
    this._productoService.obetener_producto_admin(id,this.token).subscribe(
      response =>{
        if(response.data == undefined){
          this.filtro = undefined;
        }else{
          this.filtro = response.data;
        }
      },
      error =>{

      }
    )
  }

  baja(id:any){
    this._productoService.baja_producto_admin(id, this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'PRODUCTO DADO DE BAJA',
          titleColor:'#FFF',
          backgroundColor:'#83DF4E',
          class:'text-danger',
          position: 'topRight',
          message: 'El producto fue dado de baja correctamente',
          messageColor:'#FFF'
        });
        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.metFiltro();
      },
      error=>{
        console.log(error);
        
        iziToast.show({
          title: 'ERROR',
          titleColor:'#F4EDED',
          backgroundColor:'#F54646',
          class:'text-danger',
          position: 'topRight',
          message: 'No se pudo dar de baja el producto',
          messageColor:'#F4EDED'
        });
        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
      }
    )
  }
}
