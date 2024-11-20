import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { v4 as uuidv4 } from 'uuid';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = "";
  password: string = "";

  constructor(private router: Router, private menu: MenuController, private alertController: AlertController, private storage: NativeStorage, private dbService: DatabaseService, private screenOrientation: ScreenOrientation) {}

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

  async goToPage() {
    if (this.username == "" || this.password == "") {
      const alert = await this.alertController.create({
        header: 'Empty Fields',
        message: 'Please try again',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      try {
        let user = await this.dbService.loginUser(this.username, this.password);

        if (user) {
          // Generate a session token
          const token = uuidv4();
          // Save token in NativeStorage
          await this.storage.setItem('session_token', token);
          await this.storage.setItem('id', user.id_user);

          // Redirect to home
          if (user.id_role_fk == 1) {
            this.router.navigate(['/adminhome']);
          } 
          else if (user.id_role_fk == 3){
            const alert = await this.alertController.create({
              header: 'Login Error',
              message: 'This User has been Banned, Contact your support.',
              buttons: ['OK'],
            });
            await alert.present();
          }else {
            this.router.navigate(['/tasks']);
          }
        } else {
          const alert = await this.alertController.create({
            header: 'Login Error',
            message: 'Incorrect username or password, please try again.',
            buttons: ['OK'],
          });
          await alert.present();
        }
      } catch (error) {
        const alert = await this.alertController.create({
          header: 'Login Error',
          message: 'An error occurred, please try again.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  goToStart() {
    this.router.navigate(['/start']);
  }
}