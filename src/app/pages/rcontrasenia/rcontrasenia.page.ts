import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthfireBaseService } from 'src/app/services/authfire-base.service';

@Component({
  selector: 'app-rcontrasenia',
  templateUrl: './rcontrasenia.page.html',
  styleUrls: ['./rcontrasenia.page.scss'],
})
export class RcontraseniaPage implements OnInit {
  correo: string = "";

  constructor(private menu: MenuController,private alertController: AlertController,private afAuth: AngularFireAuth, private authService: AuthfireBaseService) {}

  ngOnInit() {
    this.menu.enable(false);
  }

  async enviarCorreo() {
    if (this.correo === "") {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Debe ingresar un correo',
        buttons: ['OK'],
        cssClass: 'estilo-alertas'
      });
      await alert.present();
    } else {
      this.authService.resetContra(this.correo).then(() => {
        this.Alerta('Resetear Contraseña', 'Se ha enviado un correo para restablecer su contraseña');
        
      }).catch(() => {
        this.Alerta('Error', 'No se pudo enviar el correo');
      });
    }
  }

  async Alerta(titulo: string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
      cssClass:'estilo-alertas'
    });

    await alert.present();
  }
}