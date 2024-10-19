import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.page.html',
  styleUrls: ['./adminhome.page.scss'],
})
export class AdminhomePage implements OnInit {

  constructor(private router: Router, private activedrouter: ActivatedRoute, private menu: MenuController, private screenOrientation: ScreenOrientation) { 
  }

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.menu.enable(true);
  }
  
  goToProfile(){
    this.router.navigate(['/profile']);
  }

  // TODO: crear metodo isAdmin()

  goToUser(){
    this.router.navigate(['/users']);
  }

}
