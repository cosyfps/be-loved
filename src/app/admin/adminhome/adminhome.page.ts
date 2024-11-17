import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.page.html',
  styleUrls: ['./adminhome.page.scss'],
})
export class AdminhomePage implements OnInit {

  constructor(private storage: NativeStorage, private router: Router, private activedrouter: ActivatedRoute, private menu: MenuController, private screenOrientation: ScreenOrientation) { 
  }

  async ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    try {
      const token = await this.storage.getItem('session_token');
      if (!token) {
        // Si no hay token, redirigir al login
        this.router.navigate(['/login']);
      }
    } catch (error) {
      // Si hay un error al obtener el token, redirigir al login
      this.router.navigate(['/login']);
    }
  }
  
  goToProfile(){
    this.router.navigate(['/profile']);
  }

  // TODO: crear metodo isAdmin()

  goToUser(){
    this.router.navigate(['/users']);
  }
  goToCategory(){
    this.router.navigate(['/category']);
  }

}
