import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';
import { HelperService } from 'src/app/services/helper.service';

declare var iziToast: any;
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit {

  public producto: any = {
    categoria: '',
  };
  public file: any = undefined;
  public imgSelect: any | ArrayBuffer = 'assets/img/default-product.png';
  public config_text: any = {};
  public token: any;
  public load_btn = false;
  public config: any = {};
  private validation = {
    isValid: true,
    mensaje: "",
    tituloMensaje: ""
  };
  constructor(
    private _productoService: ProductoService,
    private _adminService: AdminService,
    private _router: Router,
    private _helperService: HelperService
  ) {
    this.config_text = {
      height: 250,
    },
      this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this._adminService.obtener_config_public().subscribe(
      response => {
        this.config = response.data;
        var search = new RegExp(this.producto.tipo, 'i');

        this.config.categorias = this.config.categorias.filter(
          (item: any) => search.test(item.tipo)
        )
      },
      error => {
      }
    );

  }

  registro(registroForm: any) {
    if (registroForm.valid) {
      if (this.file == undefined) {
        this._helperService.iziToast('Debe subir una portada para registrar', 'ERROR', false);
      }
      else {
        this.load_btn = true;
        this.validation = this._productoService.validar_datos_producto(this.producto);
        if (this.validation.isValid) {
          this._productoService.registro_producto_admin(this.producto, this.file, this.token).subscribe(
            response => {
              this._helperService.iziToast('Producto, ' + this.producto.titulo + ', fue creado correctamente', 'Producto creado', true);
              this.producto = {
                titulo: '',
                codigo: '',
                stock: '',
                alerta_stock: '',
                precio: '',
                categoria: '',
                descripcion: '',
                contenido: '',
              };
              this.load_btn = false;
              this._router.navigate(['/panel/productos']);
            },
            error => {
              this._helperService.iziToast('No se pudo crear el producto', 'ERROR', false);
              this.load_btn = false;
            }
          );
        }
        else {
          this._helperService.iziToast(this.validation.mensaje, this.validation.tituloMensaje, this.validation.isValid);
        }
      }
      this.load_btn = false;
    } else {
      this._helperService.iziToast('Los datos del formulario no son validos', 'ERROR', false);

      this.load_btn = false;
      this.imgSelect = 'assets/img/default-product.png'
      $("#portadaText").text('Seleccionar imagen');
      this.file = undefined;
    }
  }

  fileChangeEvent(event: any): void {
    var file: any;

    //Verifico si estamos recibiendo una imagen y valido tipo y tamaño
    if (event.target.files && event.target.files[0]) {
      file = <File>event.target.files[0];
    } else {
      this._helperService.iziToast('No se cargo correctamente la imagén', 'ERROR', false);
    }

    //Verifico que el tamaño de la imagen no sea superior a 4 mb.
    if (file.size <= 4000000) {
      //
      if (file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg') {

        const reader = new FileReader();
        //Obtengo la imagen en base 64,cadena extensa que genera imagen
        reader.onload = e => this.imgSelect = reader.result;
        //
        reader.readAsDataURL(file);

        $("#portadaText").text(file.name);
        this.file = file;

      } else {
        this._helperService.iziToast('El arcivho debe ser una imagen', 'ERROR', false);

        this.imgSelect = 'assets/img/default-product.png'
        $("#portadaText").text('Seleccionar imagen');
        this.file = undefined;
      }
    } else {
      this._helperService.iziToast('La imagén no puede superar los 4MB', 'ERROR', false);

      this.imgSelect = 'assets/img/default-product.png';
      $("#portadaText").text('Seleccionar imagen');
      this.file = undefined;
    }

  }
}
