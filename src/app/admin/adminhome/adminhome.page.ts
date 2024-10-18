import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.page.html',
  styleUrls: ['./adminhome.page.scss'],
})
export class AdminhomePage implements OnInit {

  constructor(private router: Router, private activedrouter: ActivatedRoute, private menu: MenuController) { 
  }

  ngOnInit() {
    this.menu.enable(false);
  }
  
  goToHome(){
    this.router.navigate(['/home']);
  }

  // TODO: crear metodo isAdmin()

  goToUser(){
    this.router.navigate(['/users']);
  }

}
