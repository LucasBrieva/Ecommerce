import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast: any;
declare var jquery:any;
declare var $:any;
@Component({
  selector: 'app-edit-producto',
  templateUrl: './edit-producto.component.html',
  styleUrls: ['./edit-producto.component.css']
})
export class EditProductoComponent implements OnInit {

  public producto : any = {};
  public config_text : any = {};
  public config : any = {};
  public imgSelect : any | ArrayBuffer;
  public load_data = false;
  public load_btn = false;
  public id:any;
  public token: any;
  public url: any;
  public file:any | File = undefined;


  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _productoService : ProductoService,
    private _adminService : AdminService,
  ) {
    this.config_text = {
      height: 250,
    },
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;
    this._adminService.obtener_config_public().subscribe(
      response=>{
        this.config = response.data;
      }
    )
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this.load_data = true;
        this.id = params['id'];
        this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined){
              this.producto = undefined;
            }else{
              this.producto = response.data;
              this.imgSelect = this.url + "obtener_portada/" + this.producto.portada;
            };
          },
          error => {

          }
        );
        this.load_data = false;
      }
    )
  }

  actualizar(actualizarForm:any){
    if(actualizarForm.valid){
      var data : any = {};

      if(this.file != undefined){
        data.portada = this.file;
      }
      data.titulo = this.producto.titulo;
      data.codigo = this.producto.codigo;
      data.stock = this.producto.stock;
      data.alerta_stock = this.producto.alerta_stock;
      data.precio = this.producto.precio;
      data.categoria = this.producto.categoria;
      data.descripcion = this.producto.descripcion;
      data.contenido = this.producto.contenido;

      this.load_btn = true;
      this._productoService.actualizar_producto_admin(data, this.id, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'Producto actualizado',
            titleColor:'#FFF',
            backgroundColor:'#83DF4E',
            class:'text-danger',
            position: 'topRight',
            message: '[' + this.producto.codigo + '] ' + this.producto.titulo + ', fue actualizado correctamente',
            messageColor:'#FFF'
          });
          this.load_btn = false;
          this._router.navigate(['/panel/productos']);

        },
        error => {
          iziToast.show({
            title: 'ERROR',
            titleColor:'#F4EDED',
            backgroundColor:'#F54646',
            class:'text-danger',
            position: 'topRight',
            message: 'No se pudo actualizar el producto',
            messageColor:'#F4EDED'
          });
          this.load_btn = false;
        }
      )
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor:'#F4EDED',
        backgroundColor:'#F54646',
        class:'text-danger',
        position: 'topRight',
        message: 'No se pudo actualizar el producto',
        messageColor:'#F4EDED'
      });
      this.load_btn = false;

    }
  }

  fileChangeEvent(event: any){
    var file:any;

    //Verifico si estamos recibiendo una imagen y valido tipo y tamaño
    if(event.target.files && event.target.files[0]){
      file = <File>event.target.files[0];
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor:'#F4EDED',
        backgroundColor:'#F54646',
        class:'text-danger',
        position: 'topRight',
        message: 'No se cargo correctamente la imagén.',
        messageColor:'#F4EDED'
      })
    }

    //Verifico que el tamaño de la imagen no sea superior a 4 mb.
    if(file.size <= 4000000){
      //
      if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif'|| file.type == 'image/jpeg'){

        const reader = new FileReader();
        //Obtengo la imagen en base 64,cadena extensa que genera imagen
        reader.onload = e => this.imgSelect = reader.result;
        //
        reader.readAsDataURL(file);

        $("#portadaText").text(file.name);
        this.file = file;

      }else{
        iziToast.show({
          title: 'ERROR',
          titleColor:'#F4EDED',
          backgroundColor:'#F54646',
          class:'text-danger',
          position: 'topRight',
          message: 'El arcivho debe ser una imagen',
          messageColor:'#F4EDED'
        });

        this.imgSelect = this.url + "obtener_portada/" + this.producto.portada;
        $("#portadaText").text(this.producto.portada);
        this.file = undefined;
      }
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor:'#F4EDED',
        backgroundColor:'#F54646',
        class:'text-danger',
        position: 'topRight',
        message: 'La imagén no puede superar los 4MB',
        messageColor:'#F4EDED'
      });

      this.imgSelect = 'assets/img/default-product.png';
      $("#portadaText").text('Seleccionar imagen');
      this.file = undefined;
    }
  }

}
