import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-misreservas',
  templateUrl: './misreservas.page.html',
  styleUrls: ['./misreservas.page.scss'],
})
export class MisreservasPage implements OnInit {

  reservaConfirmada = false;
  mesaReservada: any;
  diaReserva: string = "";
  ubicacionReserva: string = "";

  constructor(private router: Router, private activedrouter: ActivatedRoute, private menu: MenuController,private alertController: AlertController) { 
    
    this.activedrouter.queryParams.subscribe(param => {
      if(this.router.getCurrentNavigation()?.extras.state){
        this.mesaReservada = this.router.getCurrentNavigation()?.extras?.state?.['mesa'];
        this.diaReserva = this.router.getCurrentNavigation()?.extras?.state?.['fecha'];;
        this.ubicacionReserva = this.router.getCurrentNavigation()?.extras?.state?.['ubicacion'];
        this.reservaConfirmada = true;
      }
    });
  }

  ngOnInit() {
    this.menu.enable(false);
  }

  async cancelarReserva() {
    this.reservaConfirmada = false;
    this.mesaReservada = "";
    this.diaReserva = "";
    this.ubicacionReserva = "";

    const alert = await this.alertController.create({
      header: 'Reserva Cancelada',
      message: 'Reserva Cancelada con exito',
      buttons: ['OK'],
      cssClass: 'estilo-alertas'
    });
    await alert.present();
  }
}
