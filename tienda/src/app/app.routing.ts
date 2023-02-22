import { Routes, RouterModule } from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import { InicioComponent } from "./components/inicio/inicio.component";
import { LoginComponent } from "./components/login/login.component";
import { SeguridadGuard } from "./guards/seguridad.guard";
import { PerfilComponent } from "./components/usuario/perfil/perfil.component";
import { IndexProductoComponent } from "./components/productos/index-producto/index-producto.component";
import { DetailProductoComponent } from "./components/productos/detail-producto/detail-producto.component";
import { CarritoComponent } from "./components/carrito/carrito.component";


const appRoute : Routes =[
    {path: '', component: InicioComponent},
    {path: 'login', component: LoginComponent},
    {path: 'cuenta/perfil', component: PerfilComponent, canActivate: [SeguridadGuard]},
    {path: 'carrito', component: CarritoComponent, canActivate: [SeguridadGuard]},
    {path: 'productos', component: IndexProductoComponent},
    {path: 'productos/:slug', component: DetailProductoComponent},

]

export const appRoutingProviders : any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);
