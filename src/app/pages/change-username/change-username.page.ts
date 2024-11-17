import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@Component({
  selector: 'app-change-username',
  templateUrl: './change-username.page.html',
  styleUrls: ['./change-username.page.scss'],
})
export class ChangeUsernamePage implements OnInit {

  // New Modification
  newUsername: string = "";
  newEmail: string = "";

  // Old Data
  oldUsername: string = "";
  oldEmail: string = "";

  // Data to retrieve the user ID
  id_user!: number;
  image!: any;

  constructor(private menu: MenuController, private router: Router, private alertController: AlertController, private db: DatabaseService, private activatedRoute: ActivatedRoute, private storage: NativeStorage, private screenOrientation: ScreenOrientation) {
    this.activatedRoute.queryParams.subscribe(res => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.newUsername = this.router.getCurrentNavigation()?.extras?.state?.['us'];
        this.id_user = this.router.getCurrentNavigation()?.extras?.state?.['id'];
        this.newEmail = this.router.getCurrentNavigation()?.extras?.state?.['cor'];
        this.oldEmail = this.router.getCurrentNavigation()?.extras?.state?.['cor'];
        this.image = this.router.getCurrentNavigation()?.extras?.state?.['img'];

        this.oldUsername = this.newUsername;
      }
    });
  }

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

  }

  ionViewWillEnter() {
    this.storage.getItem('id').then(data => {
      this.id_user = data;

      // Call the query only when the ID has been obtained
      return this.db.searchUserById(this.id_user);
    }).then(data => {
      if (data) {
        this.oldUsername = data.username;
        this.oldEmail = data.email;
        this.image = data.user_photo;
      }
    }).catch(error => {
      console.error('Error retrieving user data', error);
    });
  }

  async successfulEdit() {
    // Validación del email y username
    const emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernameMinLength = 4;

    if (this.newUsername == "" || this.newEmail == "") {
      const alert = await this.alertController.create({
        header: 'Empty Fields',
        message: 'Please fill in all fields',
        buttons: ['OK'],
      });
      await alert.present();
    } else if (this.newUsername == this.oldUsername && this.newEmail == this.oldEmail) {
      const alert = await this.alertController.create({
        header: 'Data cannot be the same as the previous',
        message: 'Please try again',
        buttons: ['OK'],
      });
      await alert.present();
    } else if (this.newUsername.length < usernameMinLength) {
      const alert = await this.alertController.create({
        header: 'Username Error',
        message: `Username must be at least ${usernameMinLength} characters long.`,
        buttons: ['OK'],
      });
      await alert.present();
    } else if (!emailValidation.test(this.newEmail)) {
      const alert = await this.alertController.create({
        header: 'Email Error',
        message: 'Please enter a valid email address.',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      try {
        // Validaciones para comprobar si el username o email ya existen
        const userByUsername = await this.db.searchUserByUsername(this.newUsername);
        const userByEmail = await this.db.searchUserByEmail(this.newEmail);

        if (userByUsername && userByUsername.id_user !== this.id_user) {
          const alert = await this.alertController.create({
            header: 'Username Error',
            message: 'Username already exists. Please choose a different one.',
            buttons: ['OK'],
          });
          await alert.present();
          return;
        }

        if (userByEmail && userByEmail.id_user !== this.id_user) {
          const alert = await this.alertController.create({
            header: 'Email Error',
            message: 'Email already exists. Please choose a different one.',
            buttons: ['OK'],
          });
          await alert.present();
          return;
        }

        // Actualiza el nombre de usuario y el correo electrónico
        await this.db.updateUsername(this.newUsername, this.id_user);
        await this.db.updateEmail(this.newEmail, this.id_user);

        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Username and Email updated successfully',
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigate(['/profile']);
      } catch (error) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'An error occurred while updating. Please try again.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
