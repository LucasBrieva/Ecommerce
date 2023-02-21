import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { subscribeOn } from 'rxjs';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { GuestService } from 'src/app/services/guest.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';


declare var tns;
declare var lightGallery;
@Component({
  selector: 'app-detail-producto',
  templateUrl: './detail-producto.component.html',
  styleUrls: ['./detail-producto.component.css']
})
export class DetailProductoComponent implements OnInit {

  public slug;
  public producto: any = {}
  public url
  public productos_rec : Array<any> = [];

  public galleryOptions: NgxGalleryOptions[];
  public galleryImages!: NgxGalleryImage[];

  constructor(
    private _route: ActivatedRoute,
    private _guestService: GuestService
  ) {
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params => {
        this.slug = params['slug'];

        this._guestService.obtener_producto_slug_publico(this.slug).subscribe(
          response => {
            this.producto = response.data;

            this.galleryImages = [{
              small: this.url + "obtener_portada/" + this.producto.portada,
              medium: this.url + "obtener_portada/" + this.producto.portada,
              big: this.url + "obtener_portada/" + this.producto.portada,
              description: this.producto.titulo
            }];

            this.producto.galeria.forEach(e => {
              this.galleryImages.push({
                small: this.url + "obtener_portada/" + e.imagen,
                medium: this.url + "obtener_portada/" + e.imagen,
                big: this.url + "obtener_portada/" + e.imagen,
                description: e.nombre,

              });
            });
            this._guestService.listar_productos_recomendados_publico(this.producto.categoria).subscribe(
              response => {
                this.productos_rec = response.data;
              })
          }
        )
      }
    );
    this.galleryOptions = [
      {
        height: "500px",
        width: "100%",
        thumbnailsColumns: 4,
        imageAutoPlay: false,
        imageInfinityMove: true,
        previewCloseOnClick: true,
        previewCloseOnEsc: true,
        previewKeyboardNavigation: true,
        previewZoom: true,
        previewSwipe: true,
        previewFullscreen: true,
        imageSwipe: true, 
        imageArrows: true,
        previewAnimation: false,
        imageAnimation: "none",
      },
    ];

    setTimeout(() => {
      tns({
        container: '.cs-carousel-inner-two',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        nav: false,
        controlsContainer: "#custom-controls-related",
        responsive:{
          0:{
            items:1,
            gutter:20
          },
          400:{
            items:2,
            gutter:24
          },
          700:{
            items:3,
            gutter:24
          },
          1100:{
            items:4,
            gutter:30
          }
        }
      })
      
    }, 500);
  }

  ngOnInit(): void {

    

    
  }

}
