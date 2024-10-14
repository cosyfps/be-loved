import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ServicioBDService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.page.html',
  styleUrls: ['./mesas.page.scss'],
})
export class MesasPage implements OnInit {

  mesas: any = [
    {
      id_mesa:'',
      nombre:'',
      c_sillas:'',
      id_ubi_fk:''
    }
  ]

  buscarMesa: string ="";
  constructor( private menu: MenuController, private bd: ServicioBDService, private router: Router) { }

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

  listarMesas(id_ubi_fk:string) {
    this.bd.buscarMesa(id_ubi_fk);
  }

  irEditar(x:any) {
    let navigationsExtras: NavigationExtras = {
      state: {
        mesa: x
      }
    }
    this.buscarMesa = "";
    this.router.navigate(['/editarmesa'], navigationsExtras);
  }

  eliminarMesa(mesa: any){

    this.buscarMesa = "";
    this.bd.eliminarMesa(mesa.id_mesa);
  }

  irAgregar(){
    this.buscarMesa = "";
    this.router.navigate(['/agregarmesa']);

  }

}
