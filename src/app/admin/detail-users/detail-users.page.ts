import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-detail-users',
  templateUrl: './detail-users.page.html',
  styleUrls: ['./detail-users.page.scss'],
})
export class DetailUsersPage implements OnInit {
  user: any = {};
  id_user: number;
  username: string = '';
  email: string = '';
  password: string = '';
  id_role_fk: number;
  image: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private db: DatabaseService,
    private cdr: ChangeDetectorRef, // Inyección del ChangeDetectorRef
    private alertController: AlertController,
    private screenOrientation: ScreenOrientation,  // Inyección del ScreenOrientationService
    private storage: NativeStorage
  ) {}

  async ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    const id_user = this.route.snapshot.paramMap.get('id');
    if (id_user) {
      this.getUserDetails(parseInt(id_user, 10));
    }

    try {
      const token = await this.storage.getItem('session_token');
      if (!token) {
        // Si no hay token, redirigir al login
        this.router.navigate(['/login']);
      }
    } catch (error) {
      // Si hay un error al obtener el token, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  getUserDetails(id: number) {
    this.db.searchUserById(id)
      .then((data) => {
        if (data) {
          this.user = data; // Almacenar todo el usuario
          this.username = data.username;
          this.email = data.email;
          this.password = data.password;
          this.id_user = data.id_user;
          this.id_role_fk = data.id_role_fk;
          this.image = data.user_photo;

          // Detectar cambios manualmente
          this.cdr.detectChanges();
        }
      })
      .catch((error) => {
        console.error('Error retrieving user data', error);
      });
  }

  
  takePhoto = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
  
    // Set image as Base64
    this.image = image.webPath;

    try {
      await this.db.updateUser(this.username, this.email, this.image, this.id_user);
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'User photo updated successfully',
        buttons: ['OK'],
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'An error occurred while updating the profile photo. Please try again.',
        buttons: ['OK'],
      });
      await alert.present();
    }

    this.cdr.detectChanges();
  };

  async confirmDeleteUser() {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete the user: ${this.username}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Deletion cancelled');
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteUser();
          },
        },
      ],
    });

    await alert.present();
  }

  deleteUser() {
    this.db.deleteUser(this.id_user)
      .then(() => {
        console.log(`User ${this.username} deleted successfully.`);
        this.router.navigate(['/users']); // Redirige a la lista de usuarios
      })
      .catch((error) => {
        console.error('Error deleting user', error);
      });
  }

  goToAdminUsers(){
    this.router.navigate(['/users']);
  }

  goToEditUser(id_user: number){
    this.router.navigate(['/edit-users', id_user]);
  }
}
