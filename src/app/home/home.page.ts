import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { ServicioBDService } from '../services/servicio-bd.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  id_usuario! : number;
  usuario : string = "";

  constructor(private menu:MenuController, private storage: NativeStorage, private bd: ServicioBDService) { 

  }

  ngOnInit() {
    this.menu.enable(true);
  }

  /*Antes de cargar la pagina, activa el menu*/
  ionViewWillEnter() {
    this.menu.enable(true);

    this.storage.getItem('usuario').then(data=>{
      this.id_usuario = data;

      // llama a la consulta solo cuando se haya obtenido el id
      return this.bd.miPerfil(this.id_usuario);

    }).then(data => {
      if (data) {
        this.usuario = data.nombreusuario;
      }
    });
  }


  async AbrirMaps(){
    await Browser.open({ url: 'https://www.google.com/maps/place/Bellavista+112,+Providencia,+Región+Metropolitana/@-33.4343443,-70.6368537,17z/data=!3m1!4b1!4m6!3m5!1s0x9662c59aca0c4097:0x7aa5b8a55bb6c43e!8m2!3d-33.4343488!4d-70.6342734!16s%2Fg%2F11cplpnctb?entry=ttu&g_ep=EgoyMDI0MTAwOS4wIKXMDSoASAFQAw%3D%3D' });
  }
}
