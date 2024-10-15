import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { ServicioBDService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-editarperfil',
  templateUrl: './editarperfil.page.html',
  styleUrls: ['./editarperfil.page.scss'],
})
export class EditarperfilPage implements OnInit {
  
  // Nueva Modificacion
  usuarioNuevo: string = "";

  // Datos Antiguos
  usuarioAntiguo : string = "";
  correoAntiguo : string = "";

  // Dato para rescatar el id
  id_usuario!: number;
  imagen!: any;

  constructor(private menu:MenuController,private router: Router, private alertController: AlertController, private bd: ServicioBDService,private activedrouter: ActivatedRoute) {
    this.activedrouter.queryParams.subscribe(res=>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.usuarioNuevo = this.router.getCurrentNavigation()?.extras?.state?.['us'];
        this.id_usuario = this.router.getCurrentNavigation()?.extras?.state?.['id'];
        this.correoAntiguo = this.router.getCurrentNavigation()?.extras?.state?.['cor'];
        
        this.imagen = this.router.getCurrentNavigation()?.extras?.state?.['img'];


        this.usuarioAntiguo =  this.usuarioNuevo
      }
    })
  }
 
  ngOnInit() {
    this.menu.enable(false);
  }
  async irPerfil() {

    if (this.usuarioNuevo == ""){
      const alert = await this.alertController.create({
        header: 'Campos vacios',
        message: 'Por Favor intentelo de nuevo',
        buttons: ['OK'],
        cssClass: 'estilo-alertas'
      });
  
      await alert.present();
    } else if (this.usuarioNuevo == this.usuarioAntiguo){
      const alert = await this.alertController.create({
        header: 'Los datos no pueden ser igual a los anteriores',
        message: 'Por favor intentelo de nuevo',
        buttons: ['OK'],
        cssClass: 'estilo-alertas'
      });
      await alert.present();
    }
    else{

      this.bd.ModificarUsuario(this.usuarioNuevo, this.correoAntiguo, this.imagen, this.id_usuario)       
      this.router.navigate(['/profile']);
    } 
  }

  goToProfile(){
    this.router.navigate(['/profile']);
  }
}

