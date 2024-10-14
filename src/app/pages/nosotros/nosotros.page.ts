import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.page.html',
  styleUrls: ['./nosotros.page.scss'],
})
export class NosotrosPage implements OnInit {

  constructor(private menu:MenuController) { }

  ngOnInit() {
    this.menu.enable(false);
  }

  async AbrirMaps(){
    await Browser.open({ url: 'https://www.google.com/maps/place/Bellavista+112,+Providencia,+Región+Metropolitana/@-33.4343443,-70.6368537,17z/data=!3m1!4b1!4m6!3m5!1s0x9662c59aca0c4097:0x7aa5b8a55bb6c43e!8m2!3d-33.4343488!4d-70.6342734!16s%2Fg%2F11cplpnctb?entry=ttu&g_ep=EgoyMDI0MTAwOS4wIKXMDSoASAFQAw%3D%3D' });
  }

}
