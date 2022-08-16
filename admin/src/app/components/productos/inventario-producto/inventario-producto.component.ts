import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { format } from 'fecha';
import { ExcelService } from 'src/app/services/excel.service';

declare var iziToast: any;
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css']
})
export class InventarioProductoComponent implements OnInit {

  public inventario: any = {};
  public producto: any = {};
  public load_data = false;
  public id: any;
  public token: any;
  public inventarios: Array<any> = [];
  public load_btn = false;
  public arrExcel: Array<any> = [];


  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService,
    private _adminService: AdminService,
    private _router: Router,
    private _excelService: ExcelService,
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this.load_data = true;
        this.id = params['id'];
        this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
          response => {
            if (response.data == undefined) {
              this.producto = undefined;
            } else {
              this.producto = response.data;

              this._productoService.listar_inventario_producto_admin(this.id, this.token).subscribe(
                response => {
                  this.inventarios = response.data;
                  this.arrExcel = [];
                  this.inventarios.forEach(element => {
                    this.arrExcel.push({
                      user: element.admin.nombres + " " + element.admin.apellidos,
                      cantidad: element.cantidad,
                      descripcion: element.proveedor,
                      tipo: element.tipo ? "Ingreso" : "Egreso",
                    })
                  })
                },
                error => {

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

  registro(registroForm: any) {
    if (registroForm.valid) {
      if (this.inventario.tipo != undefined && this.inventario.tipo != "") {
        this.load_btn = true;
        this.inventario.producto = this.producto._id;
        this._productoService.registro_inventario_producto_admin(this.inventario, this.token).subscribe(
          response => {
            iziToast.show({
              title: 'Movimiento creado',
              titleColor: '#FFF',
              backgroundColor: '#83DF4E',
              class: 'text-success',
              position: 'topRight',
              message: 'Movimiento, ' + this.inventario.proveedor + ', fue creado correctamente',
              messageColor: '#FFF'
            });
            this.inventario = {
              proveedor: '',
              cantidad: '',
              tipo: '',
              producto: '',
              categoria: '',
              descripcion: '',
              contenido: '',
            };
            this.load_btn = false;
            $('#newInventary').modal('hide');
            $('.modal-backdrop').removeClass('show');
            $('.btns').removeClass('active');
            this.ngOnInit();
          },
          error => {
            iziToast.show({
              title: 'ERROR',
              titleColor: '#F4EDED',
              backgroundColor: '#F54646',
              class: 'text-danger',
              position: 'topRight',
              message: 'No se pudo agregar el movimiento',
              messageColor: '#F4EDED'
            });
            this.load_btn = false;
          }
        );
      }
      else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#F4EDED',
          backgroundColor: '#F54646',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe seleccionar un tipo de movimiento',
          messageColor: '#F4EDED'
        });
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#F4EDED',
        backgroundColor: '#F54646',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos',
        messageColor: '#F4EDED'
      });
      this.load_btn = false;
    }
  }

  descargarExcel() {
    this._excelService.descargar_excel(this.arrExcel, "Reporte de inventario", "INVENTARIO");
  }
}
