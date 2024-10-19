import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  email: string = "";

  constructor(private menu: MenuController, private router: Router, private alertController: AlertController, private screenOrientation: ScreenOrientation) {}

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.menu.enable(false);
  }

  async sendEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (this.email === "") {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Please enter an email address',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else if (!emailPattern.test(this.email)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Please enter a valid email address',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else {
      this.showAlert('Password Reset', 'An email has been sent to reset your password');
    }
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
      cssClass: 'alert-style'
    });

    await alert.present();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
