import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { v4 as uuidv4 } from 'uuid';
import {Workbook} from 'exceljs';

import { ExcelService } from 'src/app/services/excel.service';

declare var iziToast: any;
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public productos: Array<any> = [];
  public producto: any = {};
  public arrExcel: Array<any> = [];

  public nueva_varidad = "";
  public load_btn = false;

  public nombreImagen: any = undefined;
  public file: any = undefined;
  public fileNombre ="";

  public load_data = true;
  public has_data = true;
  public token: any;
  public id: any;
  public page = 1;
  public pageSize = 10;
  public url: any;

  public filtro: any = {
    titulo: "",
    codigo: ""
  };

  constructor(
    private _productoService: ProductoService,
    private _adminService: AdminService,
    private _excelService: ExcelService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;

  }

  ngOnInit(): void {
    this.metFiltro();
  }

  filtrar() {
    this.metFiltro();
  }

  limpiarFiltro() {
    this.filtro.titulo = '';
    this.filtro.codigo = '';
    this.metFiltro();
  }

  metFiltro() {
    this.load_data = true;
    this._productoService.listar_productos_filtro_admin(this.filtro, this.token).subscribe(
      response => {
        this.productos = response.data;
        //Acá hago el array para el excel
        this.arrExcel = [];
        this.productos.forEach(element=>{
          this.arrExcel.push({
            codigo:element.codigo,
            titulo:element.titulo,
            stock:element.stock,
            precio:element.precio,
            nventas:element.nventas,
            categoria:element.categoria
          })
        })
        this.has_data = this.productos.length > 0;
        this.load_data = false;
      },
      error => {
        console.log(error);
      }
    )
  }

  obtenerProducto(id: any) {
    this._productoService.obtener_producto_admin(id, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this.filtro = undefined;
        } else {
          this.filtro = response.data;
        }
      },
      error => {

      }
    )
  }

  baja(id: any) {
    this._productoService.baja_producto_admin(id, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'PRODUCTO DADO DE BAJA',
          titleColor: '#FFF',
          backgroundColor: '#83DF4E',
          class: 'text-danger',
          position: 'topRight',
          message: 'El producto fue dado de baja correctamente',
          messageColor: '#FFF'
        });
        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.metFiltro();
      },
      error => {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#F4EDED',
          backgroundColor: '#F54646',
          class: 'text-danger',
          position: 'topRight',
          message: 'No se pudo dar de baja el producto',
          messageColor: '#F4EDED'
        });
        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
      }
    )
  }

  descargarExcel(){
    this._excelService.descargar_excel(this.arrExcel, "Reporte de inventario", "INVENTARIO");
  }

  //#region Variedad

  abirPopup(idx: any) {
    this._productoService.obtener_producto_admin(idx, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this.producto = undefined;
        } else {
          this.producto = response.data;
          $('#modalVariedad').modal('show');
          $('.modal-backdrop').addClass('show');
        };
      },
      error => {
      }
    );
  }

  agregar_variedad() {
    if (this.nueva_varidad) {
      this.producto.variedades.push({ titulo: this.nueva_varidad });
      this.nueva_varidad = "";
      document.getElementById("nueva_variedad")?.focus();
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#000000',
        backgroundColor: '#F4DF43',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe ingresar el título de la variedad',
        messageColor: '#000000'
      })
    }
  }

  eliminar_variedad(idx: any) {
    this.producto.variedades.splice(idx, 1);
  }

  actualizar_variedad() {
    if (this.producto.titulo_variedad) {
      if (this.producto.variedades.length > 0) {
        this.load_btn = true;
        this._productoService.actualizar_producto_variedades_admin({
          titulo_variedad: this.producto.titulo_variedad,
          variedades: this.producto.variedades
        }, this.producto._id, this.token).subscribe(
          response => {
            iziToast.show({
              title: 'Variedad actualizada',
              titleColor: '#FFF',
              backgroundColor: '#83DF4E',
              class: 'text-danger',
              position: 'topRight',
              message: 'Se actualizo correctamente las variedades',
              messageColor: '#FFF'
            });
            this.load_btn = false;
          },
          error => {
            this.load_btn = false;
          }
        )
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#000000',
          backgroundColor: '#F4DF43',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe ingresar al menos una variedad',
          messageColor: '#000000'
        });
        this.load_btn = false;
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#000000',
        backgroundColor: '#F4DF43',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe ingresar el título',
        messageColor: '#000000'
      });
      this.load_btn = false;
    }
  }

  //#endregion

  //#region Galeria

  abirPopupGaleria(idx: any) {
    this._productoService.obtener_producto_admin(idx, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this.producto = undefined;
        } else {
          console.log(response.data);
          this.producto = response.data;
          this.id = this.producto._id;
          $('#input-img').val('');
          this.nombreImagen = undefined;
          this.file = undefined;
          $('#modalGaleria').modal('show');
          $('.modal-backdrop').addClass('show');
        };
      },
      error => {
      }
    );
  }

  subir_imagen() {
    if (this.file != undefined) {
      let data = {
        imagen: this.file,
        nombre: this.fileNombre,
        _id: uuidv4(),
      };
      this._productoService.agregar_imagen_galeria_admin(this.id, data, this.token).subscribe(
        response => {
          this.producto = response.data;
          this.file = undefined;
          this.fileNombre = "";
        },
        error => {

        }
      )
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#F4EDED',
        backgroundColor: '#F54646',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe seleccionar una imagen para subir.',
        messageColor: '#F4EDED'
      })
    }
  }

  fileChangeEvent(event: any): void {
    var file: any;

    //Verifico si estamos recibiendo una imagen y valido tipo y tamaño
    if (event.target.files && event.target.files[0]) {
      file = <File>event.target.files[0];
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#F4EDED',
        backgroundColor: '#F54646',
        class: 'text-danger',
        position: 'topRight',
        message: 'No se cargo correctamente la imagén.',
        messageColor: '#F4EDED'
      })
    }

    //Verifico que el tamaño de la imagen no sea superior a 4 mb.
    if (file.size <= 4000000) {
      //
      if (file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg') {
        this.file = file;
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#F4EDED',
          backgroundColor: '#F54646',
          class: 'text-danger',
          position: 'topRight',
          message: 'El arcivho debe ser una imagen',
          messageColor: '#F4EDED'
        });
        this.file = undefined;
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#F4EDED',
        backgroundColor: '#F54646',
        class: 'text-danger',
        position: 'topRight',
        message: 'La imagén no puede superar los 4MB',
        messageColor: '#F4EDED'
      });
      this.file = undefined;
    }

  }

  eliminar_imagen(idx: any) {
    this._productoService.eliminar_imagen_galeria_admin(this.id, {_id:idx}, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'Imagen eliminada',
          titleColor: '#FFF',
          backgroundColor: '#83DF4E',
          class: 'text-danger',
          position: 'topRight',
          message: 'La imagen fue eliminada correctamente',
          messageColor: '#FFF'
        });
        $('#deleteimg-' + idx).modal('hide');
        this.producto = response.data;
        this.nombreImagen = undefined;
      },
      error => {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#F4EDED',
          backgroundColor: '#F54646',
          class: 'text-danger',
          position: 'topRight',
          message: 'No se pudo dar de baja la imagen',
          messageColor: '#F4EDED'
        });
        $('#deleteimg-' + idx).modal('hide');
      }
    )
  }

  cancelar_eliminar_imagen(idx:any){
    $('#deleteimg-' + idx).modal('hide');
  }

  showImagen(imagen:any){
    this.nombreImagen = imagen;
  }
  
  //#endregion
}
