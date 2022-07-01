import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { CuponService } from 'src/app/services/cupon.service';
import { GLOBAL } from 'src/app/services/GLOBAL';

declare var iziToast: any;
declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css']
})
export class IndexCuponComponent implements OnInit {

  public load_data = true;
  public has_data=true;
  public page = 1;
  public pageSize = 10;
  public cupones : Array<any> =[];
  public url:any;
  public token: any;
  public filtro:any = {
    codigo: "",
    tipo: ""
  };
  constructor(
    private _cuponService : CuponService,
    private _adminService : AdminService,
  ) {
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;
  }
  ngOnInit(): void {
    this.metFiltro();
  }
  metFiltro(){
    this.load_data = true;
    this._cuponService.listar_cupones_filtro_admin(this.filtro, this.token).subscribe(
      response => {
        this.cupones = response.data;
        this.has_data = this.cupones.length > 0;
        this.load_data = false;
      },
      error=>{
        console.log(error);
      }
    )
  }
  filtrar(){
    this.metFiltro();
  }
  limpiarFiltro(){
    this.filtro.tipo = '';
    this.filtro.codigo = '';
    this.metFiltro();
  }
  baja(id:any){
    this._cuponService.baja_cupon_admin(id, this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'CUPÓN DADO DE BAJA',
          titleColor:'#FFF',
          backgroundColor:'#83DF4E',
          class:'text-danger',
          position: 'topRight',
          message: 'El cupón fue dado de baja correctamente',
          messageColor:'#FFF'
        });
        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.metFiltro();
      },
      error=>{
        iziToast.show({
          title: 'ERROR',
          titleColor:'#F4EDED',
          backgroundColor:'#F54646',
          class:'text-danger',
          position: 'topRight',
          message: 'No se pudo dar de baja el cupón',
          messageColor:'#F4EDED'
        });
        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
      }
    )
  }
}
