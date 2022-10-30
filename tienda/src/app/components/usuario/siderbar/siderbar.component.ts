import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styleUrls: ['./siderbar.component.css']
})
export class SiderbarComponent implements OnInit {

  public token:any;
  public user:any = undefined;
  public user_lc:any= undefined;
  public idUser:any;

  constructor(
    private clienteService: ClienteService,
  ) {
    this.token = localStorage.getItem('token');
    this.idUser = localStorage.getItem('_id');
    if(this.token != null){

      this.clienteService.obtener_cliente_guest(this.idUser, this.token).subscribe(
        res=>{
          this.user = res.data;
          this.user_lc = this.user;
          localStorage.setItem('user_data', JSON.stringify(this.user));
        },
        err=>{
          this.user = undefined;
        }
      )

    }
  }

  ngOnInit(): void {
  }

}
