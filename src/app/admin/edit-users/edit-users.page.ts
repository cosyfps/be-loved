import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.page.html',
  styleUrls: ['./edit-users.page.scss'],
})
export class EditUsersPage implements OnInit {
  id_user: number;
  username: string = '';
  email: string = '';
  password: string = '';
  id_role_fk: number;
  image: any;
  roles: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DatabaseService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id_user = parseInt(id, 10);
      this.loadUserDetails();
      this.loadRoles();
    }
  }

  async loadUserDetails() {
    const user = await this.db.searchUserById(this.id_user);
    if (user) {
      this.username = user.username;
      this.email = user.email;
      this.password = user.password;
      this.id_role_fk = user.id_role_fk;
      this.image = user.user_photo;
    }
  }

  async loadRoles() {
    const roles = await this.db.fetchRole().toPromise();
    this.roles = roles;
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    this.image = image.webPath;
  }

  async validateAndSaveUser() {
    const emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordValidation = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

    const userByUsername = await this.db.searchUserByUsername(this.username);
    const userByEmail = await this.db.searchUserByEmail(this.email);

    if (userByUsername && userByUsername.id_user !== this.id_user) {
      await this.showAlert('Error', 'Username already exists.');
      return;
    }

    if (userByEmail && userByEmail.id_user !== this.id_user) {
      await this.showAlert('Error', 'Email already exists.');
      return;
    }

    if (!emailValidation.test(this.email)) {
      await this.showAlert('Error', 'Please enter a valid email.');
      return;
    }

    if (!passwordValidation.test(this.password)) {
      await this.showAlert(
        'Error',
        'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.'
      );
      return;
    }

    try {
      await this.db.adminUpdateUser(this.username, this.email, this.password, this.id_role_fk, this.image, this.id_user);
      await this.showAlert('Success', 'User updated successfully!');
      this.router.navigate(['/users']);
    } catch (error) {
      await this.showAlert('Error', 'An error occurred. Please try again.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  goToDetailUsers(id_user: number){
    this.router.navigate(['/detail-users', id_user]); 
  }
}
