import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ServicioBDService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-editarmesa',
  templateUrl: './editarmesa.page.html',
  styleUrls: ['./editarmesa.page.scss'],
})
export class EditarmesaPage implements OnInit {

  mesas: any;

  constructor(private menu: MenuController, private bd: ServicioBDService, private activedrouter: ActivatedRoute, private router: Router) { 

    this.activedrouter.queryParams.subscribe(res=>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.mesas = this.router.getCurrentNavigation()?.extras?.state?.['mesa'];
        
        if (this.mesas.id_ubi_fk == "Local") {
          this.mesas.id_ubi_fk = "2"; 
        } else if (this.mesas.id_ubi_fk == "Terraza") {
          this.mesas.id_ubi_fk = "1";
        }
      }
    })
  }

  ngOnInit() {
    this.menu.enable(false);
  }

  editarMesa(){

    // si incluye Mesa no se agrega en la bd
    const nombreMesa = this.mesas.nombre.includes("Mesa") ? this.mesas.nombre : "Mesa " + this.mesas.nombre;
    
    this.bd.modificarMesa(this.mesas.id_mesa,nombreMesa,this.mesas.c_sillas,this.mesas.id_ubi_fk);
    this.router.navigate(['/mesas']);
  }



}
