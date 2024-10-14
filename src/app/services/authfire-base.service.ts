import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ServicioBDService } from 'src/app/services/servicio-bd.service';


@Injectable({
  providedIn: 'root'
})
export class AuthfireBaseService {

  constructor(private AFauth: AngularFireAuth, private bd : ServicioBDService) { }


  inicioSesion(nombreUsuario: string, contrasenia: string) {
    return this.bd.BuscarCorreoUsuario(nombreUsuario)
      .then(usuarioInfo => {
        if (usuarioInfo && usuarioInfo.correo) {
          // Usamos Firebase para iniciar sesión con el correo y la contraseña
          return this.AFauth.signInWithEmailAndPassword(usuarioInfo.correo, contrasenia);
        } else {
          throw new Error('No se encontró el correo del usuario');
        }
      })
      .catch(error => {
        return null;
      });
  }

  eliminarUsuario(uid: string){
    return this.AFauth.currentUser.then(user => {
      if (user) {
        // Requiere que el usuario esté autenticado
        return user.delete();
      } else {
        return null;
      }
    });
  }
  
  registro(correo: string, contrasenia: string){
    
    return this.AFauth.createUserWithEmailAndPassword(correo, contrasenia);
  }

  resetContra(email: string){
    
    return this.AFauth.sendPasswordResetEmail(email);
  }

}
