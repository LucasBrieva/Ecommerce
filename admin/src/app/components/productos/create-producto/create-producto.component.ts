import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';
declare var iziToast: any;
declare var jquery:any;
declare var $:any;
@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit {

  public producto: any ={
    categoria:'',
    tipo: 'vehiculo'
  };
  public file:any=undefined;
  public imgSelect : any | ArrayBuffer = 'assets/img/default-product.png';
  public config_text: any = {};
  public token: any;
  public load_btn = false;
  public config: any = {};

  constructor(
    private _productoService : ProductoService,
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.config_text = {
      height: 250,
    },
    this.token = this._adminService.getToken();
    this._adminService.obtener_config_public().subscribe(
      response=>{
        this.config = response.data;
      },
      error=>{

      }
    );
   }

  ngOnInit(): void {
  }

  registro(registroForm : any){
    if(registroForm.valid){
      if(this.file == undefined){
        iziToast.show({
          title: 'ERROR',
          titleColor:'#F4EDED',
          backgroundColor:'#F54646',
          class:'text-danger',
          position: 'topRight',
          message: 'Debe subir una portada para registrar',
          messageColor:'#F4EDED'
        });
      }
      else{
        this.load_btn = true;
      this._productoService.registro_producto_admin(this.producto, this.file, this.token).subscribe(
        response=>{
          iziToast.show({
            title: 'Producto creado',
            titleColor:'#FFF',
            backgroundColor:'#83DF4E',
            class:'text-danger',
            position: 'topRight',
            message: 'Producto, '+ this.producto.titulo +', fue creado correctamente',
            messageColor:'#FFF'
          });
          this.producto={
            titulo: '',
            codigo: '',
            stock: '',
            alerta_stock: '',
            precio:'',
            categoria: '',
            descripcion:'',
            contenido:'',
          };
          this.load_btn = false;
          this._router.navigate(['/panel/productos']);
        },
        error=>{
          iziToast.show({
            title: 'ERROR',
            titleColor:'#F4EDED',
            backgroundColor:'#F54646',
            class:'text-danger',
            position: 'topRight',
            message: 'No se pudo crear el producto',
            messageColor:'#F4EDED'
          });
          this.load_btn = false;
        }
      );
      }

    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor:'#F4EDED',
        backgroundColor:'#F54646',
        class:'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos',
        messageColor:'#F4EDED'
      });
      this.load_btn = false;
      this.imgSelect = 'assets/img/default-product.png'
        $("#portadaText").text('Seleccionar imagen');
        this.file = undefined;
    }
  }

  fileChangeEvent(event:any):void{
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

        this.imgSelect = 'assets/img/default-product.png'
        $("#portadaText").text('Seleccionar imagen');
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
