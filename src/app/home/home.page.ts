import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from '../services/servicio-bd.service';
import { Browser } from '@capacitor/browser';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  id_user!: number;
  username: string = "";

  constructor(private menu: MenuController, private storage: NativeStorage, private bd: DatabaseService, private router: Router, private screenOrientation: ScreenOrientation) {}

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.menu.enable(true);
  }

  /*Antes de cargar la pagina, activa el menu*/
  ionViewWillEnter() {
    this.menu.enable(true);

    this.storage.getItem('id').then(data => {
      this.id_user = data;

      // llama a la consulta solo cuando se haya obtenido el id
      return this.bd.searchUserById(this.id_user);
    }).then(data => {
      if (data) {
        this.username = data.username;
      }
    }).catch(error => {
      console.error('Error retrieving user data', error);
    });
  }

  goToAddTask() {
    this.router.navigate(['/add-task']);
  }
}
