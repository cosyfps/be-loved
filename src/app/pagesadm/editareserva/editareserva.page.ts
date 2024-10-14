import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-editareserva',
  templateUrl: './editareserva.page.html',
  styleUrls: ['./editareserva.page.scss'],
})
export class EditareservaPage implements OnInit {



  nombreCLiente: string ="";
  telefono: string ="";
  fecha: string ="";
  nroMesa: string ="";
  tipoMesa: string ="";
  constructor(private menu:MenuController, private alertController: AlertController) { }

  ngOnInit() {
    this.menu.enable(false);
  }

  async editarReserva(){

    if(this.nombreCLiente == "" || this.telefono == "" || this.fecha == "" || this.nroMesa == "" || this.tipoMesa == ""){
      const alert = await this.alertController.create({
        header: 'Campos Vacios',
        message: 'Por favor intente de nuevo',
        buttons: ['OK'],
        cssClass: 'estilo-alertas'
      });
      await alert.present(); 
    }
  }

}
