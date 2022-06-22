import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { CuponService } from 'src/app/services/cupon.service';
import { GLOBAL } from 'src/app/services/GLOBAL';

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css']
})
export class IndexCuponComponent implements OnInit {

  public load_data = true;
  public page = 1;
  public pageSize = 10;
  public filtro_codigo = '';
  public cupones : Array<any> =[];
  public url:any; 
  public token: any;

  constructor(
    private _cuponService : CuponService,
    private _adminService : AdminService,
  ) {
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;
   }

  ngOnInit(): void {
    this.initData();
  }
  initData(){
    this._cuponService.listar_cupones_filtro_admin(this.filtro_codigo, this.token).subscribe(
      response => {
        this.cupones = response.data;
        this.load_data = false;
      },
      error=>{
        console.log(error);
      }
    )
  }
  filtrar(){
        this.initData();
  }
}