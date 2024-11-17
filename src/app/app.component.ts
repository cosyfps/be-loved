import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {


  constructor(private router: Router, private storage: NativeStorage, private alertController: AlertController) {}

  ngOnInit() {
  }

  async logout() {
    try {
      await this.storage.remove('session_token');
      await this.storage.remove('username');
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