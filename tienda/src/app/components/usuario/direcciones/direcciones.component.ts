import { Component, OnInit } from '@angular/core';
import { GuestService } from 'src/app/services/guest.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css']
})
export class DireccionesComponent implements OnInit {
  public token;
  public direccion: any = {
    pais: '',
    region: '',
    provincia: '',
    ciudad: '',
    principal: false
  };
  public regiones: Array<any> = [];
  public provincias: Array<any> = [];
  public ciudades: Array<any> = [];

  constructor(
    private _guestService: GuestService
  ) {
    this.token = localStorage.getItem('token');
    
  }

  ngOnInit(): void {
  }

  select_pais() {
    //TODO: DEBERÍA CREAR UN ARCHIVO POR CADA PAÍS O EN CASO DE QUE SOLO SEA ARGENTINA, SACAR EL PAÍS/SETEARLO, Y QUE APAREZCAN LAS PROVINCIAS.
    if (this.direccion.pais == 'Perú') {
      $('#sl-region').prop('disabled', false);
      this._guestService.get_regiones().subscribe(
        res => {
          this.regiones = res;
        }
      )
    } else {
      $('#sl-region').prop('disabled', true);
      $('#sl-provincia').prop('disabled', true);
      $('#sl-ciudad').prop('disabled', true);

      this.regiones = [];
      this.provincias = [];
      this.ciudades = [];

      this.direccion.provincia = '';
      this.direccion.region = '';
      this.direccion.ciudad = '';
    }
  }

  select_region() {
    //Limpieza de selects
    this.provincias = [];
    this.ciudades = [];

    this.direccion.provincia = '';
    this.direccion.ciudad = '';

    $('#sl-ciudad').prop('disabled', true);

    $('#sl-provincia').prop('disabled', false);
    this._guestService.get_provincias().subscribe(
      res => {
        res.forEach(element => {
          if (element.department_id == this.direccion.region) {
            this.provincias.push(element);
          }
        });
      }
    )
  }

  select_provincia(){
    this.ciudades = [];
    this.direccion.ciudad = '';
    $('#sl-ciudad').prop('disabled', false);
    this._guestService.get_ciudades().subscribe(
      res => {
        res.forEach(element => {
          if (element.province_id == this.direccion.provincia) {
            this.ciudades.push(element);
          }
        });
      }
    )
  }
}
