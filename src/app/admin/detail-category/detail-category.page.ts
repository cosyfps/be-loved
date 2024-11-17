import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-detail-category',
  templateUrl: './detail-category.page.html',
  styleUrls: ['./detail-category.page.scss'],
})
export class DetailCategoryPage implements OnInit {

  category: any = {};
  id_category: number;
  name: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private db: DatabaseService,
    private cdr: ChangeDetectorRef, // Inyección de ChangeDetectorRef
    private alertController: AlertController,
    private screenOrientation: ScreenOrientation, // Inyección del ScreenOrientationService
    private storage: NativeStorage
  ) {}

  async ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    const id_category = this.route.snapshot.paramMap.get('id');
    if (id_category) {
      this.getCategoryDetails(parseInt(id_category, 10));
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

  getCategoryDetails(id: number) {
    this.db.searchCategoryById(id)
      .then((data) => {
        if (data) {
          this.category = data;
          this.name = data.name;
          this.id_category = data.id_category;

          // Forzar la detección de cambios
          this.cdr.detectChanges();
        }
      })
      .catch((error) => {
        console.error('Error retrieving category data', error);
      });
  }

  async confirmDeleteCategory() {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete the category: ${this.name}?`,
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
            this.deleteCategory();
          },
        },
      ],
    });

    await alert.present();
  }

  deleteCategory() {
    this.db.deleteCategory(this.id_category)
      .then(() => {
        console.log(`Category with ID ${this.id_category} deleted successfully.`);
        this.router.navigate(['/category']); // Redirige a la lista de categorías
      })
      .catch((error) => {
        console.error('Error deleting category', error);
      });
  }

  goToAdminCategory() {
    this.router.navigate(['/category']);
  }

  goToEditCategory(id_category: number) {
    this.router.navigate(['/edit-category', id_category]);
  }
}
