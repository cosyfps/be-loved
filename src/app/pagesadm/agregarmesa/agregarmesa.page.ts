import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { ServicioBDService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-agregarmesa',
  templateUrl: './agregarmesa.page.html',
  styleUrls: ['./agregarmesa.page.scss'],
})
export class AgregarmesaPage implements OnInit {
  
  nroMesa: string ="";
  c_sillas: string ="";
  id_ubi_fk: string ="";

  constructor(private menu: MenuController,private alertController: AlertController, private bd: ServicioBDService, private router: Router) { }

  ngOnInit() {
    this.menu.enable(false);
  }



  async agregarMesa(){

    if (this.nroMesa == "" || this.c_sillas == "" || this.id_ubi_fk == ""){
      const alert = await this.alertController.create({
        header: 'Campos Vacios',
        message: 'Por favor intente de nuevo',
        buttons: ['OK'],
        cssClass: 'estilo-alertas'
      });

      await alert.present();
    } 
    else{
      this.bd.insertarMesa('Mesa ' + this.nroMesa, this.c_sillas, this.id_ubi_fk);
      this.router.navigate(['/mesas']);
    }

  }
}
