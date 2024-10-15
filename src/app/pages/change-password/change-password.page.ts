import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
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

  userId!: number;

  constructor(private menu: MenuController, private router: Router, private alertController: AlertController, private toastController: ToastController, private activatedRoute: ActivatedRoute, private db: DatabaseService, private afAuth: AngularFireAuth) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.userId = this.router.getCurrentNavigation()?.extras?.state?.['id'];
        this.oldPassword = this.router.getCurrentNavigation()?.extras?.state?.['password'];
      }
    });
  }

  ngOnInit() {
    this.menu.enable(false);
  }

  async goToProfile() {

    const validateUppercase = /[A-Z]/; // Validate uppercase letters

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
    } else if (validateUppercase.test(this.newPassword) == false || validateUppercase.test(this.confirmPassword) == false) {

      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'The password must contain at least one uppercase letter',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();

    } else {

      let user = await this.afAuth.currentUser;

      if (user) {

        this.showMessage('bottom');

        // Function to modify password
        await user.updatePassword(this.newPassword);
        this.db.updatePassword(this.newPassword, this.userId).then(res => {
          this.router.navigate(['/profile']);
        });

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
