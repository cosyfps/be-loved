import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-mesasterraza',
  templateUrl: './mesasterraza.page.html',
  styleUrls: ['./mesasterraza.page.scss'],
})
export class MesasterrazaPage implements OnInit {

  fechaReserva: string = ""; 
  mesas: any = [
    {numero: 1, reservada: false },
    {numero: 2, reservada: false },
    {numero: 3, reservada: false },
    {numero: 4, reservada: false },
    {numero: 5, reservada: true },
    {numero: 6, reservada: false },
    {numero: 7, reservada: false },
    {numero: 8, reservada: false },
    {numero: 9, reservada: false },
    {numero: 10, reservada: false },
    {numero: 11, reservada: false },
    {numero: 12, reservada: false },
    {numero: 13, reservada: true },
    {numero: 14, reservada: false },
    {numero: 15, reservada: false },
  ];
  mesaSeleccionada: any = null;

  constructor(private router: Router, private menu: MenuController, private alertController: AlertController) { }

  ngOnInit() {
    this.menu.enable(false);
  }

  reservarMesa(mesa: any) {
    if (this.mesaSeleccionada == mesa) {
        mesa.reservada = false;
        this.mesaSeleccionada = null;
    } else {
        if (this.mesaSeleccionada !== null) {
            this.mesaSeleccionada.reservada = false;
        }
        mesa.reservada = true;
        this.mesaSeleccionada = mesa;
    }
  }

  async confirmarReserva() {
    if (this.mesaSeleccionada != null && this.fechaReserva != null) {
      let navigationExtras: NavigationExtras = {
        state: {
          mesa: this.mesaSeleccionada,
          fecha: this.fechaReserva,
          ubicacion: 'Terraza'
        }
      };
      this.router.navigate(['/misreservas'], navigationExtras);
    } else {
      const alert = await this.alertController.create({
        header: 'Advertencia',
        message: 'Por favor, seleccione una mesa y una fecha antes de confirmar.',
        buttons: ['OK'],
        cssClass: 'estilo-alertas'
      });
      await alert.present();
    }
  }
}
