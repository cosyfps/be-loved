import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { ServicioBDService } from 'src/app/services/servicio-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-mesaslocal',
  templateUrl: './mesaslocal.page.html',
  styleUrls: ['./mesaslocal.page.scss'],
})
export class MesaslocalPage implements OnInit {

  mesaSeleccionada: any = null;
  fechaReserva: string = ""; 
  mesas: any = [
    { id_mesa: '',
      nombre: '',
      c_sillas: '',
      id_ubi_fk: ''
    }]

  constructor(private router: Router, private menu: MenuController, private alertController: AlertController, private bd : ServicioBDService, private storage: NativeStorage) {
    
  }

  ngOnInit() {
    this.menu.enable(false); 

    this.bd.dbState().subscribe(data => {
      // validar si la base de datos esta lista
      if (data) {
        // subscribir al observable de usuarios
        this.bd.fetchMesas().subscribe(res => {
          this.mesas = res;
        });
      }
    });

  }


  async confirmarReserva() {
    if (this.mesaSeleccionada != null && this.fechaReserva != null) {
      let navigationExtras: NavigationExtras = {
        state: {
          mesa: this.mesaSeleccionada,
          fecha: this.fechaReserva,
          ubicacion: 'Local'
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

