import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { ServicioBDService } from 'src/app/services/servicio-bd.service';
import { AuthfireBaseService } from 'src/app/services/authfire-base.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = "";
  password: string = "";

  constructor(private router: Router, private menu: MenuController, private alertController: AlertController, private storage: NativeStorage, private dbService: ServicioBDService, private authFirebase: AuthfireBaseService) {}

  ngOnInit() {
    this.menu.enable(false);
  }

  async goToPage() {
    if (this.username == "" || this.password == "") {
      const alert = await this.alertController.create({
        header: 'Empty Fields',
        message: 'Please try again',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else if (this.username == "admin" && this.password == "admin") {
      this.router.navigate(['/homeadmin']);
    } else {
      try {
        let firebaseCredential = await this.authFirebase.inicioSesion(this.username, this.password);
        
        if (firebaseCredential) {
          // Verify user in the database
          let validatedUser = await this.dbService.BuscarCorreoUsuario(this.username);
  
          if (validatedUser) {
            await this.dbService.modificarContra(this.password, validatedUser.id_usuario);

            // Save user data in NativeStorage
            await this.storage.setItem('username', validatedUser.id_usuario);
  
            // Redirect to home
            this.router.navigate(['/home']);
          } else { 
            const alert = await this.alertController.create({
              header: 'Login Error',
              message: 'Incorrect username or password, please try again.',
              buttons: ['OK'],
              cssClass: 'alert-style'
            });
            await alert.present();
          }
        } else {
          const alert = await this.alertController.create({
            header: 'Login Error',
            message: 'Incorrect username or password, please try again.',
            buttons: ['OK'],
            cssClass: 'alert-style'
          });
          await alert.present();
        }
      } catch (error) {
        // Handle any errors (in Firebase or database)
        const alert = await this.alertController.create({
          header: 'Login Error',
          message: 'An error occurred, please try again.',
          buttons: ['OK'],
          cssClass: 'alert-style'
        });
        await alert.present();
      }
    }
  }

  goToRcontrasenia(){
    this.router.navigate(['/rcontrasenia']);
  }

  goToStart(){
    this.router.navigate(['/start']);
  }
}