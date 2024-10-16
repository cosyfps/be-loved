import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from '../services/servicio-bd.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  id_user! : number;
  username : string = "";

  constructor(private menu:MenuController, private storage: NativeStorage, private bd: DatabaseService, private router:Router) { 

  }

  ngOnInit() {
    this.menu.enable(true);
  }

  /*Antes de cargar la pagina, activa el menu*/
  ionViewWillEnter() {
    this.menu.enable(true);

    this.storage.getItem('username').then(data=>{
      this.id_user = data;

      // llama a la consulta solo cuando se haya obtenido el id
      return this.bd.getUserProfile(this.id_user);

    }).then(data => {
      if (data) {
        this.username = data.username;
      }
    });
  }

  goToAddTask(){
    this.router.navigate(['/add-task']);
  }

}
