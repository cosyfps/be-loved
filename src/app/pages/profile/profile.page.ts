import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Camera, CameraResultType } from '@capacitor/camera';
import { MenuController } from '@ionic/angular';
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
  userId!: number;
  image: any;

  constructor(private menu: MenuController, private router: Router, private storage: NativeStorage, private db: DatabaseService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.menu.enable(false);
  }

  ionViewWillEnter() {
    this.storage.getItem('username').then(data => {
      this.userId = data;

      // Call the query only when the ID has been obtained
      return this.db.getUserProfile(this.userId);
    }).then(data => {
      if (data) {
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.image = data.user_photo;

        this.cdr.detectChanges();
      }
    });
  }

  takePhoto = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });
  
    // Set image as Base64
    this.image = 'data:image/jpeg;base64,' + image.base64String;

    this.db.updateUser(this.username, this.email, this.image, this.userId);
    this.cdr.detectChanges();
  };

  goToEditProfile() {
    let navigationExtras: NavigationExtras = {
      state: {
        us: this.username,
        cor: this.email,
        id: this.userId,
        img: this.image
      }
    }
    this.router.navigate(['/editarperfil'], navigationExtras);
  }

  changePassword() {
    let navigationExtras: NavigationExtras = {
      state: {
        id: this.userId,
        con: this.password
      }
    }
    this.router.navigate(['/cambiarcontra'], navigationExtras);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
