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
  id_user!: number;
  image: any;

  constructor(private menu: MenuController, private router: Router, private storage: NativeStorage, private db: DatabaseService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.menu.enable(true);
  }

  ionViewWillEnter() {
    this.storage.getItem('username').then(data => {
      this.id_user = data;

      // Call the query only when the ID has been obtained
      return this.db.getUserProfile(this.id_user);
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
      resultType: CameraResultType.Uri
    });
  
    // Set image as Base64
    this.image = image.webPath;

    this.db.updateUser(this.username, this.email, this.image, this.id_user);
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
}
