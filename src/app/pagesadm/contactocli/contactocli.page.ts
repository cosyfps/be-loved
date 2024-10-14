import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ServicioBDService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-contactocli',
  templateUrl: './contactocli.page.html',
  styleUrls: ['./contactocli.page.scss'],
})
export class ContactocliPage implements OnInit {

  contactos: any = [
    {
      id: '',
      nombreCompleto: '',
      telefono: '',
      correo: '',
      mensaje: ''
    },
  ];
  constructor(private menu:MenuController, private bd: ServicioBDService) { }

  ngOnInit() {
    this.menu.enable(false);

    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        //subscribir al observable de la listaNoticias
        this.bd.fetchContacto().subscribe(res=>{
          this.contactos = res;
        })
      }
    })
  }

  eliminarContacto(contacto:any){
    this.bd.eliminarContacto(contacto.id_contacto);
  }

}
