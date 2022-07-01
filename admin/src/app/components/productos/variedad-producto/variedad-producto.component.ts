import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { isDebuggerStatement } from 'typescript';
declare var iziToast:any;
declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-variedad-producto',
  templateUrl: './variedad-producto.component.html',
  styleUrls: ['./variedad-producto.component.css']
})
export class VariedadProductoComponent implements OnInit {

  public producto:any = {};
  public id : any;
  public token : any;
  public nueva_varidad ="";
  public load_btn = false;
  public url:any;
  constructor(
    private _route : ActivatedRoute,
    private _productoService: ProductoService,
    private _router : Router,
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined){
              this.producto = undefined;
            }else{
              this.producto = response.data;

            };
          },
          error => {
          }
        );
      }
    )
   }

  ngOnInit(): void {
  }

  agregar_variedad(){
    if(this.nueva_varidad){
      this.producto.variedades.push({titulo: this.nueva_varidad});
      this.nueva_varidad = "";
      document.getElementById("nueva_variedad")?.focus();
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor:'#000000',
        backgroundColor:'#F4DF43',
        class:'text-danger',
        position: 'topRight',
        message: 'Debe ingresar el título de la variedad',
        messageColor:'#000000'
      })
    }
  }

  eliminar_variedad(idx:any){
    this.producto.variedades.splice(idx,1);
  }

  actualizar(){
    if(this.producto.titulo_variedad){
      if(this.producto.variedades.length > 0){
        this.load_btn = true;
        this._productoService.actualizar_producto_variedades_admin({
          titulo_variedad: this.producto.titulo_variedad,
          variedades: this.producto.variedades
        }, this.id, this.token).subscribe(
          response=>{
            iziToast.show({
              title: 'Variedad actualizada',
              titleColor:'#FFF',
              backgroundColor:'#83DF4E',
              class:'text-danger',
              position: 'topRight',
              message: 'Se actualizo correctamente las variedades',
              messageColor:'#FFF'
            });
            this.load_btn = true;
            this._router.navigate(['/panel/productos']);

          },
          error=>{
            this.load_btn = true;
          }
        )
      }else{
        iziToast.show({
          title: 'ERROR',
          titleColor:'#000000',
          backgroundColor:'#F4DF43',
          class:'text-danger',
          position: 'topRight',
          message: 'Debe ingresar al menos una variedad',
          messageColor:'#000000'
        });
        this.load_btn = true;
      }
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor:'#000000',
        backgroundColor:'#F4DF43',
        class:'text-danger',
        position: 'topRight',
        message: 'Debe ingresar el título',
        messageColor:'#000000'
      });
      this.load_btn = true;
    }
  }
}
