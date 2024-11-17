import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Camera, CameraResultType } from '@capacitor/camera';
import { MenuController, AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  username: string = "";
  email: string = "";
  password: string = "";
  id_user!: number;
  id_role_fk!: number;
  image: any;

  constructor(private menu: MenuController, private router: Router, private storage: NativeStorage, private db: DatabaseService, private cdr: ChangeDetectorRef, private alertController: AlertController, private screenOrientation: ScreenOrientation) {}

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
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.id_role_fk = data.id_role_fk;
        this.image = data.user_photo;

        this.cdr.detectChanges();
      }
    }).catch(error => {
      console.error('Error retrieving user data', error);
    });
  }

  takePhoto = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
  
    // Set image as Base64
    this.image = image.webPath;

    try {
      await this.db.updateUser(this.username, this.email, this.image, this.id_user);
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Profile photo updated successfully',
        buttons: ['OK'],
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'An error occurred while updating the profile photo. Please try again.',
        buttons: ['OK'],
      });
      await alert.present();
    }

    this.cdr.detectChanges();
  };

  goToEditProfile() {
    let navigationExtras: NavigationExtras = {
      state: {
        us: this.username,
        cor: this.email,
        id: this.id_user,
        img: this.image
      }
    }
    this.router.navigate(['/change-username'], navigationExtras);
  }

  changePassword() {
    let navigationExtras: NavigationExtras = {
      state: {
        id: this.id_user,
        con: this.password
      }
    }
    this.router.navigate(['/change-password'], navigationExtras);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  openSettings(){
    this.router.navigate(['/adminhome']);
  }

  async logout() {
    try {
      await this.storage.clear(); // Limpia todos los datos de almacenamiento
      this.router.navigate(['/login']);

    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Logout Error',
        message: 'An error occurred while logging out. Please try again.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

}
