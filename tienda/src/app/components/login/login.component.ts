import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { HelperService } from 'src/app/services/helper.service';

declare var iziToast: any;
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any = {};
  public newUser: any = {};
  public usuario: any = {};
  public token: any;

  constructor(
    private _clienteService: ClienteService,
    private _helperService: HelperService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this._router.navigate(['/']);
    }
  }

  ngOnInit(): void {
  }

  login(loginForm: any) {
    if (loginForm.valid) {
      let data = {
        email: this.user.email,
        password: this.user.password
      }
      this._clienteService.login_cliente(data).subscribe(
        response => {
          if (response.data == undefined) {
            this._helperService.iziToast(response.message, 'ERROR', false);
          } else {
            this._helperService.iziToast('Hola ' + response.data.nombres.toUpperCase() + ', bienvenido/a', 'BIENVENIDO', true);

            this.usuario = response.data;
            localStorage.setItem('token', response.token);
            localStorage.setItem('_id', response.data._id);

            this._router.navigate(['/']);
          }

        },
        e => {
          this._helperService.iziToast(e.error.message, 'ERROR', false);
        }
      )
    } else {
      this._helperService.iziToast('Los datos del formulario no son válidos', 'ERROR', false);
    }
  }

  signUp(signUpForm: any) {

    if (signUpForm.valid) {
      this._clienteService.registro_cliente(this.newUser).subscribe(
        response => {
          if (response.data == undefined) {
            this._helperService.iziToast(response.message, 'ERROR', false);
          } else {
            this._helperService.iziToast('Hola ' + response.data.nombres.toUpperCase() + ', bienvenido/a', 'BIENVENIDO', true);

            this.usuario = response.data;
            localStorage.setItem('token', response.token);
            localStorage.setItem('_id', response.data._id);

            this._router.navigate(['/']);
          }

        },
        e => {
          this._helperService.iziToast(e.error.message, 'ERROR', false);
          this.user.email = this.newUser.email;
          this.newUser = {};
        }
      )
    } else {
      this._helperService.iziToast('Los datos del formulario no son válidos', 'ERROR', false);
    }
  }
}
