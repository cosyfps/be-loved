import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { MailgunService } from 'src/app/services/mailgun.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  email: string = '';

  constructor(
    private router: Router,
    private menu: MenuController,
    private alertController: AlertController,
    private screenOrientation: ScreenOrientation,
    private mailgunService: MailgunService,
    private storage: NativeStorage
  ) {}

  async ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    try {
      const token = await this.storage.getItem('session_token');
      if (token) {
        // Redirigir al área protegida si el usuario ya está autenticado
        this.router.navigate(['/tasks']);
      }
    } catch (error) {
      // No hay token, permite acceso normal
    }
  }

  async sendEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (this.email === '') {
      await this.showAlert('Error', 'Please enter an email address');
    } else if (!emailPattern.test(this.email)) {
      await this.showAlert('Error', 'Please enter a valid email address');
    } else {
      this.mailgunService.sendEmail(this.email, 'Reset Password | beLoved', 'Support has been contacted, wait for a response soon.')
        .then(() => {
          this.showAlert('Success', 'Email enviado exitosamente.');
        })
        .catch((error) => {
          this.showAlert('Error', 'Hubo un error al enviar el email.');
          console.error(error);
        });
    }
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
