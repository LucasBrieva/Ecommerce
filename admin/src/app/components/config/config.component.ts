import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast:any;
declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  public token:any;
  public config:any = {};

  public titulo_cat = "";
  public file:any=undefined;
  public imgSelect : any | ArrayBuffer;
  public url: any;
  constructor(
    private _adminService:AdminService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._adminService.obtener_config_admin(this.token).subscribe(
      response=>{
        this.config = response.data;
        this.imgSelect = this.url + "obtener_logo/" + this.config.logo;
      },
      error=>{
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
  }

  agregar_cat(){
    if(this.titulo_cat){
      this.config.categorias.push({
        titulo:this.titulo_cat,
        _id: uuidv4(),
      });
      this.titulo_cat = "";

    }
    else{
      iziToast.show({
        title: 'ERROR',
        titleColor:'#F4EDED',
        backgroundColor:'#F54646',
        class:'text-danger',
        position: 'topRight',
        message: 'Debe ingresar un título para la categoría',
        messageColor:'#F4EDED'
      })
    }
  }

  actualizar(configForm:any){
    if(configForm.valid){
      let data={
        razonSocial: configForm.value.razonSocial,
        nSerie: configForm.value.nSerie,
        correlativo: configForm.value.correlativo,
        categorias: this.config.categorias,
        logo: this.file,
      };

      this._adminService.actualizar_config_admin("62bb9a6476aaee93706e83c1", data, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'Configuración actualizada',
            titleColor:'#FFF',
            backgroundColor:'#83DF4E',
            class:'text-danger',
            position: 'topRight',
            message: 'Se actualizo correctamente la configuración',
            messageColor:'#FFF'
          });
        },
        error=>{

        }
      )
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor:'#F4EDED',
        backgroundColor:'#F54646',
        class:'text-danger',
        position: 'topRight',
        message: 'Complete correctamente el formulario',
        messageColor:'#F4EDED'
      })
    }
  }

  fileChangeEvent(event: any){
    var file:any;

    //Verifico si estamos recibiendo una imagen y valido tipo y tamaño
    if(event.target.files && event.target.files[0]){
      file = <File>event.target.files[0];
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor:'#F4EDED',
        backgroundColor:'#F54646',
        class:'text-danger',
        position: 'topRight',
        message: 'No se cargo correctamente la imagén.',
        messageColor:'#F4EDED'
      })
    }

    //Verifico que el tamaño de la imagen no sea superior a 4 mb.
    if(file.size <= 4000000){
      //
      if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif'|| file.type == 'image/jpeg'){

        const reader = new FileReader();
        //Obtengo la imagen en base 64,cadena extensa que genera imagen
        reader.onload = e => this.imgSelect = reader.result;
        $(".cs-file-drop-icon").addClass("cs-file-drop-preview img-thumbnail rounded");
        $(".cs-file-drop-icon").removeClass("cs-file-drop-icon cxi-upload");
        reader.readAsDataURL(file);

        $("#portadaText").text(file.name);
        this.file = file;

      }else{
        iziToast.show({
          title: 'ERROR',
          titleColor:'#F4EDED',
          backgroundColor:'#F54646',
          class:'text-danger',
          position: 'topRight',
          message: 'El arcivho debe ser una imagen',
          messageColor:'#F4EDED'
        });

        this.imgSelect = this.url + "obtener_portada/" + this.config.logo;
        $("#logoText").text(this.config.logo);
        this.file = undefined;
      }
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor:'#F4EDED',
        backgroundColor:'#F54646',
        class:'text-danger',
        position: 'topRight',
        message: 'La imagén no puede superar los 4MB',
        messageColor:'#F4EDED'
      });

      this.imgSelect = 'assets/img/default-product.png';
      $("#logoText").text('Seleccionar imagen');
      this.file = undefined;
    }
  }

  eliminar_categoria(idx:any){
    //Método para eliminar un indice de un array
    this.config.categorias.splice(idx,1);
  }

  ngDoCheck():void{
    $(".cs-file-drop-preview").html("<img src=" + this.imgSelect + ">");
  }
}
