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

  public page!: number;
  public config_global: any = {};
  public filter_categoria = "";
  public productos_back_up: Array<any> = [];
  public productos_filtrado: Array<any> = [];
  //TODO: RE HACER PARA QUE SEA UN OBJETO O ALGO ASÍ
  public filter_producto = {
    titulo: "",
    minPrice: 0,
    maxPrice: 1000,
    categorias: Array<string>()
  };

  public load_data = true;
  public url;

  public sort_by = "az";
  public pageSize = 15;
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

  buscar_producto() {
    if (this.productos_back_up.length == 0) {
      this.listar_productos();
    }
    else {
      let min = parseFloat($('.cs-range-slider-value-min').val());
      let max = parseFloat($('.cs-range-slider-value-max').val());

      var search = new RegExp(this.filter_producto.titulo, 'i');
      this.productos_filtrado = this.productos_back_up.filter(
        item => search.test(item.titulo)
      );

      this.productos_filtrado = this.productos_filtrado.filter(
        item => {
          if (item.precio >= min && item.precio <= max) return true;
          return false;
        }
      );
      if (this.filter_producto.categorias.length > 0) {
        this.productos_filtrado = this.productos_filtrado.filter(
          item => {
            if (this.filter_producto.categorias.indexOf(item.categoria) != -1) {
              return true;
            }
            return false;
          }
        );
      }
      this.ordenar_por();
    }

  }

  listar_productos() {
    this._clienteService.listar_productos_filtro_publico(this.filter_producto).subscribe(
      response => {
        this.productos_back_up = response.data;
        this.productos_filtrado = response.data;
        this.config_precios();
        this.config_precios_css();
        this.ordenar_por();
        this.load_data = false;
      },
      error => {

      }
    )
  }

  config_precios_css() {
    var slider: any = document.getElementById('slider');
    noUiSlider.create(slider, {
      start: [this.filter_producto.minPrice == this.filter_producto.maxPrice ? 0 : this.filter_producto.minPrice, this.filter_producto.maxPrice],
      connect: true,
      decimals: false,
      range: {
        'min': this.filter_producto.minPrice == this.filter_producto.maxPrice ? 0 : this.filter_producto.minPrice,
        'max': this.filter_producto.maxPrice
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

    slider.noUiSlider.on('change', () => {
      return this.buscar_producto();
    });

    $('.noUi-tooltip').css('font-size', '11px');
  }
  config_precios() {
    if (this.productos_filtrado.length > 0) {
      let minPrice = 0;
      let maxPrice = 0;
      for (let i = 0; i < this.productos_filtrado.length; i++) {
        if (i == 0) {
          minPrice = this.productos_filtrado[i].precio;
          maxPrice = this.productos_filtrado[i].precio;
        } else {
          if (minPrice > this.productos_filtrado[i].precio) {
            minPrice = this.productos_filtrado[i].precio;
          }
          if (maxPrice < this.productos_filtrado[i].precio) {
            maxPrice = this.productos_filtrado[i].precio;
          }
        }
      }
      this.filter_producto.minPrice = minPrice == maxPrice ? 0 : minPrice;
      this.filter_producto.maxPrice = maxPrice
    }
  }
  set_array_categorias(categoria) {
    var indiceExiste = this.filter_producto.categorias.indexOf(categoria);
    if (indiceExiste == -1) {
      this.filter_producto.categorias.push(categoria);
    } else {
      this.filter_producto.categorias.splice(indiceExiste, 1);
    }
    this.buscar_producto();
  }
  ordenar_por() {
    switch (this.sort_by) {
      case "popularidad":
        this.productos_filtrado.sort(function (a, b) {
          if (a.nventas < b.nventas) {
            return 1;
          }
          if (a.nventas > b.nventas) {
            return -1;
          }
          return 0;
        });
        break;
      case "mayorPrecio":
        this.productos_filtrado.sort(function (a, b) {
          if (a.precio < b.precio) {
            return 1;
          }
          if (a.precio > b.precio) {
            return -1;
          }
          return 0;
        });
        break;
      case "menorPrecio":
        this.productos_filtrado.sort(function (a, b) {
          if (a.precio > b.precio) {
            return 1;
          }
          if (a.precio < b.precio) {
            return -1;
          }
          return 0;
        });
        break;
      case "az":
        this.productos_filtrado.sort(function (a, b) {
          if (a.titulo > b.titulo) {
            return 1;
          }
          if (a.titulo < b.titulo) {
            return -1;
          }
          return 0;
        });
        break;
      case "za":
        this.productos_filtrado.sort(function (a, b) {
          if (a.titulo < b.titulo) {
            return 1;
          }
          if (a.titulo > b.titulo) {
            return -1;
          }
          return 0;
        });
        break;
    }
  }
}
