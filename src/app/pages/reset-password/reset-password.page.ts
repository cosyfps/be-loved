import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  newPassword: string = '';
  confirmPassword: string = '';
  email: string = ''; // El email recibido de la página anterior
  passwordVisibleNew: boolean = false;
  passwordVisibleConfirm: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private db: DatabaseService
  ) { }

  ngOnInit() {
    // Obtener el email desde NavigationExtras
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.email = navigation.extras.state['email'] || '';
    }
  }

  togglePasswordVisibility(field: string) {
    if (field === 'new') {
      this.passwordVisibleNew = !this.passwordVisibleNew;
    } else if (field === 'confirm') {
      this.passwordVisibleConfirm = !this.passwordVisibleConfirm;
    }
  }

  async resetPassword() {
    const validateUppercase = /[A-Z]/; // Validar letras mayúsculas
    const validateLowercase = /[a-z]/;
    const validateNumber = /[0-9]/;
    const validateSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const minLengthValidation = /^.{8,}$/;

    if (this.newPassword === '' || this.confirmPassword === '') {
      const alert = await this.alertController.create({
        header: 'Empty Fields',
        message: 'Please fill in all fields.',
        buttons: ['OK'],
      });
      await alert.present();
    } else if (this.newPassword !== this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'Passwords do not match.',
        buttons: ['OK'],
      });
      await alert.present();
    } else if (!minLengthValidation.test(this.newPassword)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'Password must be at least 8 characters long.',
        buttons: ['OK'],
      });
      await alert.present();
    } else if (!validateUppercase.test(this.newPassword)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'Password must contain at least one uppercase letter.',
        buttons: ['OK'],
      });
      await alert.present();
    } else if (!validateLowercase.test(this.newPassword)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'Password must contain at least one lowercase letter.',
        buttons: ['OK'],
      });
      await alert.present();
    } else if (!validateNumber.test(this.newPassword)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'Password must contain at least one number.',
        buttons: ['OK'],
      });
      await alert.present();
    } else if (!validateSpecialChar.test(this.newPassword)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'Password must contain at least one special character.',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      try {
        // Actualizar la contraseña en la base de datos
        await this.db.updatePasswordByEmail(this.newPassword, this.email);
        this.showToast('Password reset successfully!', 'bottom');
        this.router.navigate(['/login']); // Redirigir al login
      } catch (error) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'An error occurred while resetting the password. Please try again.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  async showToast(message: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position,
    });
    await toast.present();
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
