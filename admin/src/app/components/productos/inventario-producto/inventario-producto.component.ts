import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { format } from 'fecha';

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
                  this.inventarios.forEach(element => {
                    this.arrExcel.push({
                      admin: element.admin.nombres + " " + element.admin.apellidos,
                      cantidad: element.cantidad,
                      proveedor: element.proveedor,
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
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Inventario de " + this.producto.titulo);

    worksheet.addRow(undefined);

    for (let x1 of this.arrExcel) {
      let x2 = Object.keys(x1);

      let temp = [];
      for (let y of x2) {
        temp.push(x1[y]);
      }
      worksheet.addRow(temp);
    }

    let fname = this.producto.titulo + " - ";

    worksheet.columns = [
      { header: 'Usuario', key: 'col1', width: 30 },
      { header: 'Cantidad', key: 'col2', width: 15 },
      { header: 'Descripción', key: 'col3', width: 30 },
      { header: 'T. movimiento', key: 'col4', width: 15 },
    ] as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + format(new Date(), 'DD/MM/YYYY') + '.xlsx');
    })
  }
}
