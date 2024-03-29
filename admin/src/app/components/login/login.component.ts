import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

declare var jquery:any;
declare var $:any;
declare var iziToast: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user : any = {};
  public usuario:any = {};
  public token:any = '';

  constructor(
    private _adminService:AdminService,
    private _router: Router
  ) {
    this.token= this._adminService.getToken();
   }

  ngOnInit(): void {
    if(this.token){
      this._router.navigate(['']);
    }
    else{
      
    }
  }

  login(loginForm: any){
    if(loginForm.valid){

      let data={
        email: this.user.email,
        password: this.user.password
      }
      this._adminService.login_admin(data).subscribe(
        response => {
          if(response.data == undefined){
            iziToast.show({
              title: 'ERROR',
              titleColor:'#F4EDED',
              backgroundColor:'#F54646',
              class:'text-danger',
              position: 'topRight',
              message: response.message,
              messageColor:'#F4EDED'
            })
          }else{
            iziToast.show({
              title: 'BIENVENIDO',
              titleColor:'#FFF',
              backgroundColor:'#83DF4E',
              class:'text-danger',
              position: 'topRight',
              message: 'Hola ' + response.data.nombres.toUpperCase() + ', bienvenido/a',
              messageColor:'#FFF'
            })
            this.usuario= response.data;
            localStorage.setItem('token', response.token);
            localStorage.setItem('_id',response.data._id)
            setTimeout(() => {
              this._router.navigate(['/']);
            }, 2000);
          }
          
        },
        error => {
          console.log(error);
        }
      )
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor:'#F4EDED',
        backgroundColor:'#F54646',
        class:'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos',
        messageColor:'#F4EDED'
      })
    }
  }

}
