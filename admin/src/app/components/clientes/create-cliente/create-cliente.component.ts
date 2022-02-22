import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';


declare var iziToast: any;

@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css']
})
export class CreateClienteComponent implements OnInit {

  public cliente:any = {
    genero: ''
  };

  public token:any;
  public load_btn = false;

  constructor(
    private _clienteService : ClienteService,
    private _adminService: AdminService,
    private _router: Router
  ) { 
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
  }

  registro(registroForm:any){
    if(registroForm.valid){
      this.load_btn = true;
      this._clienteService.registro_cliente_admin(this.cliente, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'Cliente creado',
            titleColor:'#FFF',
            backgroundColor:'#83DF4E',
            class:'text-danger',
            position: 'topRight',
            message: 'Cliente, '+ this.cliente.nombres + " " + this.cliente.apellidos +', fue creado correctamente',
            messageColor:'#FFF'
          });
          this.cliente={
            genero: '',
            nombres: '',
            apellidos: '',
            f_nacimiento:'',
            telefono: '',
            dni:'',
            email:'',
          }
          this.load_btn = false;
          this._router.navigate(['/panel/clientes']);
        },
        error => {
          iziToast.show({
            title: 'ERROR',
            titleColor:'#F4EDED',
            backgroundColor:'#F54646',
            class:'text-danger',
            position: 'topRight',
            message: 'No se pudo crear el cliente',
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
        message: 'No se pudo crear el cliente',
        messageColor:'#F4EDED'
      });
      this.load_btn = false;
    }
  }

}
