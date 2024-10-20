import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  oldPassword: string = "";
  validateOldPassword: string = "";
  newPassword: string = "";
  confirmPassword: string = "";

  id_user!: number;

  constructor(private menu: MenuController, private storage: NativeStorage, private router: Router, private alertController: AlertController, private toastController: ToastController, private activatedRoute: ActivatedRoute, private db: DatabaseService, private screenOrientation: ScreenOrientation) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.id_user = this.router.getCurrentNavigation()?.extras?.state?.['id'];
        this.oldPassword = this.router.getCurrentNavigation()?.extras?.state?.['password'];
      }
    });
  }

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.menu.enable(true);
  }

  ionViewWillEnter() {
    this.storage.getItem('id').then(data => {
      this.id_user = data;

      // Call the query only when the ID has been obtained
      return this.db.searchUserById(this.id_user);
    }).then(data => {
      if (data) {
        this.oldPassword = data.password;
      }
    }).catch(error => {
      console.error('Error retrieving user data', error);
    });
  }

  async goToProfile() {

    const validateUppercase = /[A-Z]/; // Validate uppercase letters
    const validateLowercase = /[a-z]/;
    const validateNumber = /[0-9]/;
    const validateSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const minLengthValidation = /^.{8,}$/;

    if (this.newPassword == "" || this.validateOldPassword == "" || this.confirmPassword == "") {
      const alert = await this.alertController.create({
        header: 'Empty Fields',
        message: 'Please try again.',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else if (this.oldPassword != this.validateOldPassword) {
      const alert = await this.alertController.create({
        header: 'Change Error',
        message: 'The password does not match the current one',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else if (this.newPassword != this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Change Error',
        message: 'Passwords do not match',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else if (this.newPassword == this.oldPassword) {
      const alert = await this.alertController.create({
        header: 'Change Error',
        message: 'The new password is the same as the current one',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else if (!minLengthValidation.test(this.newPassword)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'Password must be at least 8 characters long.',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else if (!validateUppercase.test(this.newPassword)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'The password must contain at least one uppercase letter',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else if (!validateLowercase.test(this.newPassword)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'The password must contain at least one lowercase letter',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else if (!validateNumber.test(this.newPassword)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'The password must contain at least one number',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else if (!validateSpecialChar.test(this.newPassword)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'The password must contain at least one special character',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else {
      try {
        await this.db.updatePassword(this.newPassword, this.id_user);
        this.showMessage('bottom');
        this.router.navigate(['/profile']);
      } catch (error) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'An error occurred while updating the password. Please try again.',
          buttons: ['OK'],
          cssClass: 'alert-style'
        });
        await alert.present();
      }
    }

  }

  async showMessage(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Password changed successfully!',
      duration: 2000,
      position: position,
      cssClass: 'alert-style'
    });
    await toast.present();
  }

  goToProfilePage() {
    this.router.navigate(['/profile']);
  }

}
