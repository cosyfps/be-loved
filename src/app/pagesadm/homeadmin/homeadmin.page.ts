import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-homeadmin',
  templateUrl: './homeadmin.page.html',
  styleUrls: ['./homeadmin.page.scss'],
})
export class HomeadminPage implements OnInit {

  nombre: string = "";
  contrasenia: string = "";

  constructor(private router: Router, private activedrouter: ActivatedRoute , private menu: MenuController) { 
    // Subscribirnos a la lectura de los parametros
    this.activedrouter.queryParams.subscribe(param =>{
      //valido si viene o no informacion en la ruta
      if(this.router.getCurrentNavigation()?.extras.state){
        this.nombre = this.router.getCurrentNavigation()?.extras?.state?.['nom'];
        this.contrasenia = this.router.getCurrentNavigation()?.extras?.state?.['com'];
      }
    }) 
  }

  ngOnInit() {
    this.menu.enable(false);
  }

}
