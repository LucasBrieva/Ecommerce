import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CuponService } from 'src/app/services/cupon.service';
declare var iziToast: any;
declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-edit-cupon',
  templateUrl: './edit-cupon.component.html',
  styleUrls: ['./edit-cupon.component.css']
})
export class EditCuponComponent implements OnInit {
  public token:any; 
  public id:any;
  public cupon : any = {
  };
  public load_btn = false;
  public load_data = true;

  constructor(
    private _cuponService : CuponService,
    private _route : ActivatedRoute,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');
   }

  ngOnInit(): void {
    this._route.params.subscribe(
      params =>{
        this.id = params['id'];

        this._cuponService.obtener_cupon_admin(this.id,this.token).subscribe(
          response =>{
            if(response.data == undefined){
              this.cupon = undefined;
              this.load_data = false;
            }else{
              this.cupon = response.data;
              //TODO: CHEQUEAR CON LUKE
              this.cupon.tipo = response.data.tipo.toString();
              this.cupon.vencimiento = moment(this.cupon.vencimiento).add('hours',4).format('yyyy-MM-DD');
              setTimeout(() => {
                this.load_data = false;
              }, 2000);
            }
          },
          error =>{

          }
        )
      }
    )
  }

  update(updateForm:any){
    if(updateForm.valid){
      debugger;
      this.load_btn = true;
      this._cuponService.actualizar_cupon_admin(this.id, this.cupon, this.token).subscribe(
        response=>{
          iziToast.show({
            title: 'Cupón actualizado',
            titleColor:'#FFF',
            backgroundColor:'#83DF4E',
            class:'text-danger',
            position: 'topRight',
            message: 'Cupón, '+ this.cupon.codigo +', fue actualizado correctamente',
            messageColor:'#FFF'
          });
          this.load_btn = false;
          this._router.navigate(['/panel/cupones']);
        },
        error => {
        }
      )
    }else{
      iziToast.show({
        title: 'DATOS INCORRECTOS',
        titleColor:'#F4EDED',
        backgroundColor:'#F54646',
        class:'text-danger',
        position: 'topRight',
        message: 'No se pudo actualizar el cupón',
        messageColor:'#F4EDED'
      })
    }
  }
}
