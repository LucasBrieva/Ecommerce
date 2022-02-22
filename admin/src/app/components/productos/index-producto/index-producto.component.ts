import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public productos : Array<any> =[];
  public filtro_titulo = '';
  public filtro_codigo = '';
  //public filtro_categoria = '';

  public load_data=true;
  public token: any;
  public page = 1;
  public pageSize = 10;
  public url:any; 
  constructor(
    private _productoService : ProductoService,
    private _adminService : AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;
   }

  ngOnInit(): void {
    this.initData();
  }

  initData(){
    this._productoService.listar_productos_filtro_admin(null, null, this.token).subscribe(
      response => {
        this.productos = response.data;
        this.load_data = false;

      },
      error=>{
        console.log(error);
      }
    )
  }

  filtro(tipo:any){
    if(tipo=="titulo"){
      if(this.filtro_titulo){
        this.metFiltro(tipo, this.filtro_titulo);
      }else{
        this.initData()
      }
    }else if(tipo == "codigo"){
      if(this.filtro_codigo){
        this.metFiltro(tipo, this.filtro_codigo);
      }else{
        this.initData();
      }
    };
    /*else if(tipo == "apellido"){
      if(this.filtro_apellido){
        this.metFiltro(tipo, this.filtro_apellido)
      }else{
        this.initData()
      }
    }*/
  }
  metFiltro(tipo: any, filtro: any){
    this.load_data = true;
    this._productoService.listar_productos_filtro_admin(tipo, filtro, this.token).subscribe(
      response => {
        this.productos = response.data;
        this.load_data = false;
      },
      error=>{
        console.log(error);
      }
    )
  }
  
}
