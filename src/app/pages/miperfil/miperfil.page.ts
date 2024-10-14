import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController } from '@ionic/angular';
import { ServicioBDService } from 'src/app/services/servicio-bd.service';
import { Camera, CameraResultType } from '@capacitor/camera';
@Component({
  selector: 'app-miperfil',
  templateUrl: './miperfil.page.html',
  styleUrls: ['./miperfil.page.scss'],
})
export class MiperfilPage implements OnInit {

  nombre: string = "";
  usuario: string = "";
  telefono: string = "";
  correo: string = "";
  contrasenia: string = "";
  id_usuario!: number;

  imagen: any;

  constructor(private menu:MenuController,private router: Router, private storage: NativeStorage, private bd: ServicioBDService, private cdr: ChangeDetectorRef ) {

  }

  ngOnInit() {
    this.menu.enable(false);
  }

  ionViewWillEnter(){

    this.storage.getItem('usuario').then(data=>{
      this.id_usuario = data;

      // llama a la consulta solo cuando se haya obtenido el id
      return this.bd.miPerfil(this.id_usuario);

    }).then(data => {
      if (data) {
        this.usuario = data.nombreusuario;
        this.nombre = data.nombrecompleto;
        this.telefono = data.telefono;
        this.correo = data.correo;
        this.contrasenia = data.contrasenia;
        this.imagen = data.fotousuario;

        this.cdr.detectChanges();
      }
    });
  }

  tomarFoto = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });
  
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    this.imagen = 'data:image/jpeg;base64,' + image.base64String;

    this.bd.ModificarUsuario(this.usuario,this.nombre,this.telefono,this.correo,this.imagen,this.id_usuario);

    this.cdr.detectChanges();
  };

  irEditarperfil(){
    let navigationExtras: NavigationExtras = {
      state: {
        nom: this.nombre,
        us: this.usuario,
        te: this.telefono,
        cor: this.correo,
        id: this.id_usuario,
        img : this.imagen
      }
    }
    this.router.navigate(['/editarperfil'], navigationExtras);
  }

  cambiarContrasenia(){
    let navigationExtras: NavigationExtras = {
      state: {
        id: this.id_usuario,
        con: this.contrasenia
      }
    }
    this.router.navigate(['/cambiarcontra'], navigationExtras);
  }
}
