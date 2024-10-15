import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-homeadmin',
  templateUrl: './homeadmin.page.html',
  styleUrls: ['./homeadmin.page.scss'],
})
export class HomeadminPage implements OnInit {

  constructor(private router: Router, private activedrouter: ActivatedRoute , private menu: MenuController) { 
  }

  ngOnInit() {
    this.menu.enable(false);
  }
  
  goToLogin(){
    this.router.navigate(['login']);
  }

  // TODO: crear metodo isAdmin()

  goToUser(){
    this.router.navigate(['/usuarios']);
  }

}
