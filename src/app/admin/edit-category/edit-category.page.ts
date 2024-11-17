import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.page.html',
  styleUrls: ['./edit-category.page.scss'],
})
export class EditCategoryPage implements OnInit {

  id_category: number;
  name: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DatabaseService,
    private alertController: AlertController,
    private screenOrientation: ScreenOrientation,
    private storage: NativeStorage,
  ) {}

  async ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id_category = parseInt(id, 10);
      this.loadCategoryDetails();
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

  async loadCategoryDetails() {
    const category = await this.db.searchCategoryById(this.id_category);
    if (category) {
      this.name = category.name;
    }
  }

  async validateAndSaveCategory() {
    if (this.name.trim().length === 0) {
      await this.showAlert('Error', 'Category name cannot be empty.');
      return;
    }

    const categoryByName = await this.db.searchCategoryByName(this.name);

    if (categoryByName && categoryByName.id_category !== this.id_category) {
      await this.showAlert('Error', 'Category name already exists.');
      return;
    }

    try {
      await this.db.updateCategory(this.id_category, this.name);
      await this.showAlert('Success', 'Category updated successfully!');
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

  goToDetailCategory(id_category: number) {
    this.router.navigate(['/detail-category', id_category]);
  }

  goToCategory(){
    this.router.navigate(['/category']);
  }
}
