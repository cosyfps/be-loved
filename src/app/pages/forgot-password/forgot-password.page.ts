import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
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
    private bd: DatabaseService
  ) {}

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.menu.enable(true);
  }

  async sendEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (this.email === '') {
      await this.showAlert('Error', 'Please enter an email address');
    } else if (!emailPattern.test(this.email)) {
      await this.showAlert('Error', 'Please enter a valid email address');
    } else {
      try {
        // Check if the email exists in the database
        const user = await this.bd.searchUserByEmail(this.email);

        if (user) {
          // Send the email
          await this.mailgunService.sendEmail(
            this.email,
            'Reset Password | beLoved',
            'Support has been contacted, wait for a response soon.'
          );
          await this.showAlert('Success', 'Email sent successfully.');
        } else {
          await this.showAlert('Error', 'Email does not exist in our system.');
        }
      } catch (error) {
        await this.showAlert('Error', 'An error occurred while sending the email.');
        console.error(error);
      }
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
