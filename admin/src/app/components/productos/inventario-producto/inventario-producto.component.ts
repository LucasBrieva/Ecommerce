import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css']
})
export class InventarioProductoComponent implements OnInit {

  public producto : any = {};
  public load_data = false;
  public id:any;
  public token:any;
  public inventarios:Array<any>=[];

  constructor(
    private _route : ActivatedRoute,
    private _productoService : ProductoService,
    private _adminService : AdminService,
  ) {
    this.token = this._adminService.getToken();
   }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this.load_data = true;
        this.id = params['id'];
        this._productoService.obetener_producto_admin(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined){
              this.producto = undefined;
            }else{
              this.producto = response.data;

              this._productoService.listar_inventario_producto_admin(this.id, this.token).subscribe(
                response=>{
                  this.inventarios = response.data;
                },
                error=>{

                }
              )
            };
          },
          error => {

          }
        );
        this.load_data = false;
      }
    )
  }

}
