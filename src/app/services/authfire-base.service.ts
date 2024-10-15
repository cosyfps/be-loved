import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DatabaseService } from 'src/app/services/servicio-bd.service';


@Injectable({
  providedIn: 'root'
})
export class AuthfireBaseService {

  constructor(private afAuth: AngularFireAuth, private db: DatabaseService) { }

  login(username: string, password: string) {
    return this.db.searchUserEmail(username)
      .then(userInfo => {
        if (userInfo && userInfo.email) {
          // Use Firebase to sign in with email and password
          return this.afAuth.signInWithEmailAndPassword(userInfo.email, password);
        } else {
          throw new Error('User email not found');
        }
      })
      .catch(error => {
        return null;
      });
  }

  deleteUser(uid: string) {
    return this.afAuth.currentUser.then(user => {
      if (user) {
        // Requires the user to be authenticated
        return user.delete();
      } else {
        return null;
      }
    });
  }
  
  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

}
