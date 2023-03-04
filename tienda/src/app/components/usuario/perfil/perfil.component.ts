import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  public cliente: any = {
    genero: "",
    pais: ""
  };
  public id: any;
  public token: any;

  constructor(
    private _helperService: HelperService,
    private _clienteService: ClienteService,

  ) {
    this.id = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');

    if (this.id) {
      this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
        res => {
          this.cliente = res.data;
          this.cliente.pais = this.cliente.pais != undefined? this.cliente.pais : "";
          this.cliente.genero = this.cliente.genero != undefined? this.cliente.genero : "";
        },
        err => {

        }
      )
    }
  }

  ngOnInit(): void {
  }

  actualizar(actualizarForm: any) {
    if (actualizarForm.valid) {
      if(this.cliente.newPassword == this.cliente.confirmPassword){
        this._clienteService.actualizar_perfil_cliente_guest(this.id, this.cliente, this.token).subscribe(
          res => {
            this.cliente = res.data;
            this._helperService.iziToast("El perfil se ha actualizado correctamente", "Actualizado", true);
          },
          err => {
            this._helperService.iziToast('Los datos del formulario no son válidos', 'ERROR', false);
          }
        )
      }
      else{
        this._helperService.iziToast('Las contraseñas no coinciden', 'ERROR', false);
      }
    } else {
      this._helperService.iziToast('Los datos del formulario no son válidos', 'ERROR', false);
    }
  }

  togglePassword(id:string){
    this._helperService.togglePassword(id);
  }
  
}
