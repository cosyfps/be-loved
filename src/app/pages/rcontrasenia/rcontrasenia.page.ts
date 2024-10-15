import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthfireBaseService } from 'src/app/services/authfire-base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rcontrasenia',
  templateUrl: './rcontrasenia.page.html',
  styleUrls: ['./rcontrasenia.page.scss'],
})
export class RcontraseniaPage implements OnInit {
  
  email: string = "";

  constructor(private menu: MenuController, private router: Router, private alertController: AlertController, private afAuth: AngularFireAuth, private authService: AuthfireBaseService) {}

  ngOnInit() {
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
      this.authService.resetContra(this.email).then(() => {
        this.showAlert('Password Reset', 'An email has been sent to reset your password');
      }).catch(() => {
        this.showAlert('Error', 'Failed to send email');
      });
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