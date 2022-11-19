import { ThisReceiver } from '@angular/compiler';
import { Component, DebugElement, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
declare var noUiSlider: any;
declare var $: any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public config_global: any = {};
  public filter_categoria = "";
  public productos_back_up: Array<any> = [];
  public productos_filtrado: Array<any> = [];
  //TODO: RE HACER PARA QUE SEA UN OBJETO O ALGO ASÍ
  public filter_producto = "";
  public load_data = true;
  public url;

  constructor(
    private _clienteService: ClienteService
  ) {
    this.url = GLOBAL.url;
    this._clienteService.obtener_config_public().subscribe(
      response => {
        this.config_global = response.data;
      },
      error => {

      }
    );
    this.listar_productos();

  }

  ngOnInit(): void {
    var slider: any = document.getElementById('slider');
    noUiSlider.create(slider, {
      start: [0, 1000],
      connect: true,
      decimals: false,
      range: {
        'min': 0,
        'max': 1000
      },
      tooltips: [true, true],
      pips: {
        mode: 'count',
        values: 5,
      }
    })

    slider.noUiSlider.on('update', function (values: any) {
      $('.cs-range-slider-value-min').val(values[0]);
      $('.cs-range-slider-value-max').val(values[1]);
    });
    $('.noUi-tooltip').css('font-size', '11px');
  }

  buscar_categoria() {

    if (this.filter_categoria) {
      var search = new RegExp(this.filter_categoria, 'i');
      this.config_global.categorias = this.config_global.categorias.filter(
        item => search.test(item.titulo)
      )
    }
    else {
      this._clienteService.obtener_config_public().subscribe(
        response => {
          this.config_global = response.data;
        },
        error => {

        }
      );
    }

  }
  listar_productos(){
    this._clienteService.listar_productos_filtro_publico(this.filter_producto).subscribe(
      response => {
        this.productos_back_up = response.data;
        this.productos_filtrado = response.data;
        this.load_data = false;
      },
      error => {

      }
    )
  }
  buscar_producto(){
    if(this.productos_back_up.length == 0){
      this.listar_productos();
    }
    else{
      debugger;
      var search = new RegExp(this.filter_producto, 'i');

      this.productos_filtrado = this.productos_back_up.filter(
        item => search.test(item.titulo)
      )
    }
    }
}
