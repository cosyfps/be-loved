import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Browser } from '@capacitor/browser';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-change-username',
  templateUrl: './change-username.page.html',
  styleUrls: ['./change-username.page.scss'],
})
export class ChangeUsernamePage implements OnInit {

  // New Modification
  newUsername: string = "";

  // Old Data
  oldUsername: string = "";
  oldEmail: string = "";

  // Data to retrieve the user ID
  id_user!: number;
  image!: any;

  constructor(private menu: MenuController, private router: Router, private alertController: AlertController, private db: DatabaseService, private activatedRoute: ActivatedRoute, private storage: NativeStorage) {
    this.activatedRoute.queryParams.subscribe(res => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.newUsername = this.router.getCurrentNavigation()?.extras?.state?.['us'];
        this.id_user = this.router.getCurrentNavigation()?.extras?.state?.['id'];
        this.oldEmail = this.router.getCurrentNavigation()?.extras?.state?.['cor'];
        this.image = this.router.getCurrentNavigation()?.extras?.state?.['img'];

        this.oldUsername = this.newUsername;
      }
    })
  }

  ngOnInit() {
    this.menu.enable(true);
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
    if (this.newUsername == "") {
      const alert = await this.alertController.create({
        header: 'Empty Fields',
        message: 'Please try again',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else if (this.newUsername == this.oldUsername) {
      const alert = await this.alertController.create({
        header: 'Data cannot be the same as the previous',
        message: 'Please try again',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else {
      try {
        await this.db.updateUsername(this.newUsername, this.id_user);
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Username updated successfully',
          buttons: ['OK'],
          cssClass: 'alert-style'
        });
        await alert.present();
        this.router.navigate(['/profile']);
      } catch (error) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'An error occurred while updating the username. Please try again.',
          buttons: ['OK'],
          cssClass: 'alert-style'
        });
        await alert.present();
      }
    }
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
