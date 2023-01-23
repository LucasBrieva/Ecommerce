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
    minPriceStr: '0',
    maxPriceStr: '1000',
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
    // Comprobar si la lista de productos de respaldo está vacía. Si es así, ejecutar la función listar_productos()
    if (this.productos_back_up.length == 0) {
      this.listar_productos();
    }
    else {
      // Obtener los valores mínimo y máximo del rango de búsqueda de precios y formatearlos como moneda
      let min = Math.floor(parseFloat($('.cs-range-slider-value-min').val().replace("$", "")));
      let max = Math.floor(parseFloat($('.cs-range-slider-value-max').val().replace("$", "")));
      $('.cs-range-slider-value-min').val(min.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
      $('.cs-range-slider-value-max').val(max.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
      // Utilizar el objeto RegExp para buscar productos con un título específico
      var search = new RegExp(this.filter_producto.titulo, 'i');
      this.productos_filtrado = this.productos_back_up.filter(
        item => search.test(item.titulo)
      );
      // Filtrar los productos que estén dentro del rango de precios especificado
      this.productos_filtrado = this.productos_filtrado.filter(
        item => {
          if (item.precio >= min && item.precio <= max) return true;
          return false;
        }
      );
      // Filtrar los productos por categoría si se ha seleccionado alguna
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
      // Ejecutar la función ordenar_por() para ordenar los productos filtrados
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

  // Esta función configura un control deslizante para seleccionar un rango de precios utilizando la biblioteca noUiSlider
  // El elemento HTML con ID "slider" es utilizado como contenedor para el control deslizante
  config_precios_css() {
    // Se obtiene el elemento HTML con ID "slider"
    var slider: any = document.getElementById('slider');
    // Se crea el control deslizante utilizando noUiSlider
    noUiSlider.create(slider, {
      // Se establece el rango de precios inicial utilizando las propiedades minPrice y maxPrice del objeto filter_producto
      start: [this.filter_producto.minPrice == this.filter_producto.maxPrice ? 0 : this.filter_producto.minPrice, this.filter_producto.maxPrice],
      // Se activa la opción de conectar los extremos del control deslizante
      connect: true,
      // Se establece el paso entre los valores del control deslizante en 1
      step: 1,
      // Se establece el rango mínimo y máximo del control deslizante utilizando las propiedades minPrice y maxPrice del objeto filter_producto
      range: {
        'min': this.filter_producto.minPrice == this.filter_producto.maxPrice ? 0 : this.filter_producto.minPrice,
        'max': this.filter_producto.maxPrice
      },
      // Se desactiva la opción de mostrar tooltips al mover el control deslizante
      tooltips: [false, false],
      // Se establece el modo de los indicadores (pips) en "count" y su cantidad en 2
      pips: {
        mode: 'count',
        values: 2,
      },
    })
    // Se agrega un evento de "update" al control deslizante para actualizar los valores de los elementos con clase '.cs-range-slider-value-min' y 
    //'.cs-range-slider-value-max' con los valores del control deslizante formateados como moneda en dólares
    slider.noUiSlider.on('update', function (values: any) {
      $('.cs-range-slider-value-min').val("$" + values[0].toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
      $('.cs-range-slider-value-max').val("$" + values[1].toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
    });
    // Se agrega un evento de "change" al control deslizante para llamar a la función buscar_producto() cuando el usuario suelta el control deslizante
    slider.noUiSlider.on('change', () => {
      return this.buscar_producto();
    });

  }
  // Esta función configura los precios mínimo y máximo de los productos filtrados.
  config_precios() {
    // Verifica si hay productos filtrados disponibles
    if (this.productos_filtrado.length > 0) {
      let minPrice = 0;
      let maxPrice = 0;
      for (let i = 0; i < this.productos_filtrado.length; i++) {
        // Asigna el primer precio encontrado como el precio mínimo y máximo inicial
        if (i == 0) {
          minPrice = this.productos_filtrado[i].precio;
          maxPrice = this.productos_filtrado[i].precio;
        } else {
          // Compara el precio actual con el precio mínimo y máximo existente
          if (minPrice > this.productos_filtrado[i].precio) {
            minPrice = this.productos_filtrado[i].precio;
          }
          if (maxPrice < this.productos_filtrado[i].precio) {
            maxPrice = this.productos_filtrado[i].precio;
          }
        }
      }
      // Asigna el precio mínimo y máximo al objeto de filtro de productos
      this.filter_producto.minPrice = minPrice == maxPrice ? 0 : minPrice;
      this.filter_producto.minPriceStr = this.filter_producto.minPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      this.filter_producto.maxPrice = maxPrice;
      this.filter_producto.maxPriceStr = this.filter_producto.maxPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
  }
  // Función para establecer un arreglo de categorías
  set_array_categorias(categoria) {
    // Busca si la categoría existe en el arreglo filter_producto.categorias
    var indiceExiste = this.filter_producto.categorias.indexOf(categoria);
    // Si la categoría no existe en el arreglo, agregar a la lista
    if (indiceExiste == -1) {
      this.filter_producto.categorias.push(categoria);
    } else {
      // Si la categoría ya existe en el arreglo, eliminar de la lista
      this.filter_producto.categorias.splice(indiceExiste, 1);
    }
    // Llamar a la función buscar_producto para actualizar los resultados de búsqueda
    this.buscar_producto();
  }
  ordenar_por() {
    // Selecciona el criterio de ordenamiento según el valor de sort_by
    switch (this.sort_by) {
      case "popularidad":
        // Ordena por número de ventas (mayor a menor)
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
        // Ordena por precio (mayor a menor)
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
        // Ordena por precio (menor a mayor)
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
        // Ordena por título (a-z)
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
        // Ordena por título (z-a)
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
