import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {


  reservas: any = [
    { id: 1, nombreCliente: "Daryen Fernandez", fechaReserva: "28/08/2024", nroMesa: "Mesa 7", tipoMesa: "Terraza"},
    { id: 2, nombreCliente: "Esteban Toledo", fechaReserva: "28/08/2024", nroMesa: "Mesa 13", tipoMesa: "Local"},
    { id: 3, nombreCliente: "Andy Madrid", fechaReserva: "28/08/2024", nroMesa: "Mesa 18", tipoMesa: "Terraza"},
   
  ]
  constructor(private menu: MenuController) { }

  ngOnInit() {
    this.menu.enable(false);
  }

}
