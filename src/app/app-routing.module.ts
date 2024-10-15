import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
    path: 'start',
    loadChildren: () => import('./pages/start/start.module').then( m => m.StartPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'reservar',
    loadChildren: () => import('./pages/reservar/reservar.module').then( m => m.ReservarPageModule)
  },
  {
    path: 'nosotros',
    loadChildren: () => import('./pages/nosotros/nosotros.module').then( m => m.NosotrosPageModule)
  },
  {
    path: 'rcontrasenia',
    loadChildren: () => import('./pages/rcontrasenia/rcontrasenia.module').then( m => m.RcontraseniaPageModule)
  },
  {
    path: 'contacto',
    loadChildren: () => import('./pages/contacto/contacto.module').then( m => m.ContactoPageModule)
  },
  {
    path: 'editarperfil',
    loadChildren: () => import('./pages/editarperfil/editarperfil.module').then( m => m.EditarperfilPageModule)
  },
  {
    path: 'cambiarcontra',
    loadChildren: () => import('./pages/cambiarcontra/cambiarcontra.module').then( m => m.CambiarcontraPageModule)
  },
  {
    path: 'misreservas',
    loadChildren: () => import('./pages/misreservas/misreservas.module').then( m => m.MisreservasPageModule)
  },
  {
    path: 'mesasterraza',
    loadChildren: () => import('./pages/mesasterraza/mesasterraza.module').then( m => m.MesasterrazaPageModule)
  },
  {
    path: 'mesaslocal',
    loadChildren: () => import('./pages/mesaslocal/mesaslocal.module').then( m => m.MesaslocalPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pagesadm/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'reservas',
    loadChildren: () => import('./pagesadm/reservas/reservas.module').then( m => m.ReservasPageModule)
  },
  {
    path: 'mesas',
    loadChildren: () => import('./pagesadm/mesas/mesas.module').then( m => m.MesasPageModule)
  },
  {
    path: 'homeadmin',
    loadChildren: () => import('./pagesadm/homeadmin/homeadmin.module').then( m => m.HomeadminPageModule)
  },
  {
    path: 'editareserva',
    loadChildren: () => import('./pagesadm/editareserva/editareserva.module').then( m => m.EditareservaPageModule)
  },
  {
    path: 'contactocli',
    loadChildren: () => import('./pagesadm/contactocli/contactocli.module').then( m => m.ContactocliPageModule)
  },
  {
    path: 'agregarmesa',
    loadChildren: () => import('./pagesadm/agregarmesa/agregarmesa.module').then( m => m.AgregarmesaPageModule)
  },
  {
    path: 'editarmesa',
    loadChildren: () => import('./pagesadm/editarmesa/editarmesa.module').then( m => m.EditarmesaPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  },
  

  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
