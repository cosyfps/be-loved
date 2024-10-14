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

  contrasenia: string = "";
  usuario: string = "";

  constructor(private router:Router, private menu:MenuController,private alertController: AlertController,private storage: NativeStorage, private bd: ServicioBDService,private authFirebase: AuthfireBaseService ) {}

  ngOnInit() {
    this.menu.enable(false);
  }

  async irPagina() {
    if (this.usuario == "" || this.contrasenia == "") {

      const alert = await this.alertController.create({
        header: 'Campos Vacios',
        message: 'Por favor intente de nuevo',
        buttons: ['OK'],
        cssClass: 'estilo-alertas'
      });
      await alert.present();

    } else if (this.usuario == "admin" && this.contrasenia == "admin") {

      this.router.navigate(['/homeadmin']);
    } else {

      try {
        let CredencialFireBase = await this.authFirebase.inicioSesion(this.usuario, this.contrasenia);
        
        if (CredencialFireBase) {

          // Verificamos el usuario en la base de datos
          let ValidarUsuario = await this.bd.BuscarCorreoUsuario(this.usuario);
  
          if (ValidarUsuario) {
            await this.bd.modificarContra(this.contrasenia, ValidarUsuario.id_usuario);

            // Guardar los datos del usuario en el NativeStorage
            await this.storage.setItem('usuario', ValidarUsuario.id_usuario);
  
            // Redirigir al home
            this.router.navigate(['/home']);
          } else { 
            const alert = await this.alertController.create({
              header: 'Error al iniciar sesión',
              message: 'Usuario o contraseña incorrectos, por favor intente de nuevo.',
              buttons: ['OK'],
              cssClass: 'estilo-alertas'
            });
            await alert.present();
          }
        } else{
          const alert = await this.alertController.create({
            header: 'Error al iniciar sesión',
            message: 'Usuario o contraseña incorrectos, por favor intente de nuevo.',
            buttons: ['OK'],
            cssClass: 'estilo-alertas'
          });
          await alert.present();
        }
      } catch (error) {

        // Si ocurre algún error (en Firebase o en la base de datos)
        const alert = await this.alertController.create({
          header: 'Error al iniciar sesión',
          message: 'Usuario o contraseña incorrectos, por favor intente de nuevo.',
          buttons: ['OK'],
          cssClass: 'estilo-alertas'
        });
        await alert.present();
      }
    }
  }
}
