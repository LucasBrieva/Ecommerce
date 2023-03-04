import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { format } from 'fecha';
import { DiccionarioService } from './diccionario.service';
import { EnumsService } from './enums.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  public arrHeaders: Array<any> = [];
  constructor(
    private _diccionario: DiccionarioService,
    private _enumExcel: EnumsService,
  ) { }

  descargar_excel(arrExcel: Array<any>, titulo: string, nombreArchivo: string) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(titulo);
    let headers = false;
    let numberCol = 1;

    worksheet.addRow(undefined);

    for (let x1 of arrExcel) {
      let x2 = Object.keys(x1);

      let temp = [];
      for (let y of x2) {
        if (!headers) {
          this.arrHeaders.push({ header: this._diccionario.get_diccionario(y), key: 'col' + numberCol, width: this._enumExcel.getWidthExcel(y) });
          numberCol++;
        }
        temp.push(x1[y]);
      }
      headers = true;
      worksheet.addRow(temp);
    }

    let fname = nombreArchivo + "- ";
    if(this.arrHeaders.length != 0){
      worksheet.columns = this.arrHeaders as any;
    }else{
      worksheet.columns = [{header: "No hay registros filtrados", key: 'col1', width: 30}]
    }

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + format(new Date(), 'DD/MM/YYYY') + '.xlsx');
    })
      this.arrHeaders = [];
  }
  
}
