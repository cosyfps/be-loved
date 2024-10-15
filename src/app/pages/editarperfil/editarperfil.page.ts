import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-editarperfil',
  templateUrl: './editarperfil.page.html',
  styleUrls: ['./editarperfil.page.scss'],
})
export class EditarperfilPage implements OnInit {
  
  // New Modification
  newUsername: string = "";

  // Old Data
  oldUsername: string = "";
  oldEmail: string = "";

  // Data to retrieve the user ID
  userId!: number;
  image!: any;

  constructor(private menu: MenuController, private router: Router, private alertController: AlertController, private db: DatabaseService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(res => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.newUsername = this.router.getCurrentNavigation()?.extras?.state?.['us'];
        this.userId = this.router.getCurrentNavigation()?.extras?.state?.['id'];
        this.oldEmail = this.router.getCurrentNavigation()?.extras?.state?.['cor'];
        this.image = this.router.getCurrentNavigation()?.extras?.state?.['img'];

        this.oldUsername = this.newUsername;
      }
    })
  }
 
  ngOnInit() {
    this.menu.enable(false);
  }

  async successfulEdit() {
    if (this.newUsername == "") {
      const alert = await this.alertController.create({
        header: 'Empty Fields',
        message: 'Please try again',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else if (this.newUsername == this.oldUsername) {
      const alert = await this.alertController.create({
        header: 'Data cannot be the same as the previous',
        message: 'Please try again',
        buttons: ['OK'],
        cssClass: 'alert-style'
      });
      await alert.present();
    } else {
      this.db.updateUser(this.newUsername, this.oldEmail, this.image, this.userId);
      this.router.navigate(['/profile']);
    } 
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
  
}