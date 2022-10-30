import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public token:any;
  public idUser:any;
  public user:any = undefined;
  public user_lc:any= undefined;
  constructor(
    private clienteService: ClienteService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');
    this.idUser = localStorage.getItem('_id');
    if(this.idUser != null && this.token != null){
      if(localStorage.getItem('user_data')){
        var user_data :any = localStorage.getItem('user_data');
        this.user_lc = JSON.parse(user_data);
      }else{
        this.clienteService.obtener_cliente_guest(this.idUser, this.token).subscribe(
          res=>{
            this.user = res.data;
            this.user_lc = this.user;
            localStorage.setItem('user_data', JSON.stringify(this.user));
          },
          err=>{
            debugger;
            this.user = undefined;
          }
        )
        this.user_lc = undefined;
      }

    }
  }

  ngOnInit(): void {
  }

  logOut(){
    localStorage.clear();
    this.user_lc = undefined;
    this._router.navigate(['/']);
  }

}
