import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GuestService } from 'src/app/services/guest.service';
import { HelperService } from 'src/app/services/helper.service';

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
  public regiones_arr: Array<any> = [];
  public provincias_arr: Array<any> = [];
  public ciudades_arr: Array<any> = [];

  constructor(
    private _guestService: GuestService,
    private _helperService: HelperService,
    private _clienteService : ClienteService
  ) {
    this.token = localStorage.getItem('token');
    this._guestService.get_regiones().subscribe(
      res => {
        this.regiones_arr = res;
      }
    );
    this._guestService.get_provincias().subscribe(
      res => {
        this.provincias_arr = res;
      }
    );
    this._guestService.get_ciudades().subscribe(
      res => {
        this.ciudades_arr = res;
      }
    )
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
  registrar(registroForm){
    if(registroForm.valid){
      //TODO: Esto lo puedo reemplazar por un find. 
      this.regiones_arr.forEach(e=>{
        if(parseInt(e.id) == parseInt(this.direccion.region)){
          this.direccion.region = e.name;
        }
      });
      this.provincias_arr.forEach(e=>{
        if(parseInt(e.id) == parseInt(this.direccion.provincia)){
          this.direccion.provincia = e.name;
        }
      });this.ciudades_arr.forEach(e=>{
        if(parseInt(e.id) == parseInt(this.direccion.ciudad)){
          this.direccion.ciudad = e.name;
        }
      });
      let data = {
        destinatario: this.direccion.destinatario,
        dni: this.direccion.dni,
        zip: this.direccion.zip,
        direccion: this.direccion.direccion,
        telefono: this.direccion.telefono,
        pais: this.direccion.pais,
        region: this.direccion.region,
        provincia: this.direccion.provincia,
        ciudad: this.direccion.ciudad,
        principal: this.direccion.principal,
        cliente: localStorage.getItem('_id')
      }

      this._clienteService.registro_direccion_cliente(data, this.token).subscribe(
        res=>{
          this.direccion = {
            pais: '',
            region: '',
            provincia: '',
            ciudad: '',
            principal: false
          };
          this._helperService.iziToast("La dirección ha sido agregada correctamente", "Actualizado", true);
        },
        err=>{

        }
      );
    }else{
      this._helperService.iziToast('Los datos del formulario no son válidos', 'ERROR', false);
    }
  }
}
