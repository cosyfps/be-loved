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
  generatedCode: string | null = null; // Código generado
  enteredCode: string = ''; // Código ingresado por el usuario
  isCodeSent: boolean = false;

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
  }

  // Generar un código aleatorio
  generateCode(): string {
    const length = 6;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Simular envío del código
  async sendCode() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (this.email === '') {
      await this.showAlert('Error', 'Please enter an email address');
    } else if (!emailPattern.test(this.email)) {
      await this.showAlert('Error', 'Please enter a valid email address');
    } else {
      try {
        const user = await this.bd.searchUserByEmail(this.email);
        if (user) {
          // Generar código
          this.generatedCode = this.generateCode();
          this.isCodeSent = true;

          await this.mailgunService.sendEmail(
            this.email,
            'Reset Password | beLoved',
            'Code Sent, Your recovery code is: ' + `${this.generatedCode}`
          );

          await this.showAlert('Success', 'Code sent successfully.');

        } else {
          await this.showAlert('Error', 'Email does not exist in our system.');
        }
      } catch (error) {
        console.error(error);
        await this.showAlert('Error', 'An error occurred. Please try again.');
      }
    }
  }

  // Verificar el código ingresado
  async verifyCode() {
    if (this.generatedCode === null) {
      await this.showAlert('Error', 'No code has been generated.');
    } else if (this.enteredCode !== this.generatedCode) {
      await this.showAlert('Error', 'Invalid code. Please try again.');
    } else {
      await this.showAlert('Success', 'Code verified! You can now reset your password.');
      this.generatedCode = null; // Limpiar código
      this.router.navigate(['/reset-password']);
    }
  }

  // Mostrar alertas
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
