import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.page.html',
  styleUrls: ['./add-category.page.scss'],
})
export class AddCategoryPage {
  categoryName: string = '';

  constructor(
    private router: Router,
    private db: DatabaseService,
    private alertController: AlertController,
    private storage: NativeStorage
  ) {}

  async ngOnInit() {
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
  
  async addCategory() {
    if (this.categoryName.trim().length < 3) {
      await this.showAlert('Error', 'Category name must be at least 3 characters long.');
      return;
    }

    const existingCategory = await this.db.searchCategoryByName(this.categoryName);
    if (existingCategory) {
      await this.showAlert('Error', 'Category name already exists.');
      return;
    }

    try {
      await this.db.insertCategory(this.categoryName);
      await this.showAlert('Success', 'Category added successfully!');
      this.router.navigate(['/category']);
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

  goToCategories() {
    this.router.navigate(['/category']);
  }
}
