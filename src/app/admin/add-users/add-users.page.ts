import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.page.html',
  styleUrls: ['./add-users.page.scss'],
})
export class AddUsersPage implements OnInit {

  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  id_rol: string = '2';

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(
    private menu: MenuController, 
    private alertController: AlertController,
    private router: Router, 
    private bd: DatabaseService, 
    private screenOrientation: ScreenOrientation,
    private storage: NativeStorage,
  ) {}

  async ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Función para alternar la visibilidad de la confirmación de la contraseña
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  async register() {
    const uppercaseValidation = /[A-Z]/;
    const lowercaseValidation = /[a-z]/;
    const numberValidation = /[0-9]/;
    const specialCharValidation = /[!@#$%^&*(),.?":{}|<>]/;
    const minLengthValidation = /^.{8,}$/;
    const emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernameMinLengthValidation = /^.{4,}$/;

    if (this.username == '' || this.email == '' || this.password == '' || this.confirmPassword == '') {
      const alert = await this.alertController.create({
        header: 'Empty Fields',
        message: 'Please fill in all fields.',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } 
    else if (!usernameMinLengthValidation.test(this.username)) {
      const alert = await this.alertController.create({
        header: 'Username Error',
        message: 'Username must be at least 4 characters long.',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    }
    else if (!emailValidation.test(this.email)) {
      const alert = await this.alertController.create({
        header: 'Email Error',
        message: 'Please enter a valid email address.',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } 
    else if (!minLengthValidation.test(this.password)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'Password must be at least 8 characters long.',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } 
    else if (!uppercaseValidation.test(this.password)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'Password must contain at least one uppercase letter.',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } 
    else if (!lowercaseValidation.test(this.password)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'Password must contain at least one lowercase letter.',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } 
    else if (!numberValidation.test(this.password)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'Password must contain at least one number.',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } 
    else if (!specialCharValidation.test(this.password)) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'Password must contain at least one special character.',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } 
    else if (this.password !== this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Password Error',
        message: 'Passwords do not match.',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } 
    else {
      try {
        // Check if username or email already exists
        const userByUsername = await this.bd.searchUserByUsername(this.username);
        const userByEmail = await this.bd.searchUserByEmail(this.email);

        if (userByUsername) {
          const alert = await this.alertController.create({
            header: 'Registration Error',
            message: 'Username already exists. Please choose a different username.',
            buttons: ['OK'],
            cssClass: 'alert-style'
          });
          await alert.present();
        } else if (userByEmail) {
          const alert = await this.alertController.create({
            header: 'Registration Error',
            message: 'Email already exists. Please use a different email address.',
            buttons: ['OK'],
            cssClass: 'alert-style'
          });
          await alert.present();
        } else {
          await this.bd.insertUser(this.username, this.email, this.password, '', Number(this.id_rol));
          const alert = await this.alertController.create({
            header: 'User Added',
            message: 'Successfully.',
            buttons: ['OK'],
          });
          await alert.present();
          this.router.navigate(['/users']);
        }
      } 
      catch (error) {
        const alert = await this.alertController.create({
          header: 'Registration Error',
          message: 'An error occurred during registration. Please try again.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  goToUsers(){
    this.router.navigate(['/users']);
  }
}
