import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController,MenuController } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
})
export class ReservarPage implements OnInit {
  tipomesa: string = "";
  
  constructor(private menu:MenuController,private router:Router,private alertController: AlertController, private storage: NativeStorage) { }

  ngOnInit() {
    this.menu.enable(false);
  }

  async confirmarSeleccion() {
    if (this.tipomesa == "2") {
      await this.storage.setItem('Tipomesa', '2');
      this.router.navigate(['/mesaslocal']);
    } else if (this.tipomesa == "1") {
      await this.storage.setItem('Tipomesa', '1');
      this.router.navigate(['/mesasterraza']);
    } else {
      const alert = await this.alertController.create({
        header: 'Tiene que seleccionar una opcion',
        message: 'Por favor intentelo de nuevo',
        buttons: ['OK'],
        cssClass: 'estilo-alertas'
      });
      await alert.present();
    }
}
}