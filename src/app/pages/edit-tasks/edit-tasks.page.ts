import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { Location } from '@angular/common';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController, Platform, AlertController } from '@ionic/angular';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@Component({
  selector: 'app-edit-tasks',
  templateUrl: './edit-tasks.page.html',
  styleUrls: ['./edit-tasks.page.scss'],
})
export class EditTasksPage implements OnInit {
  task_id: number;
  title: string = '';
  description: string = '';
  category_id: number;
  categories: any[] = []; // Lista de categorías

  constructor(
    private db: DatabaseService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private storage: NativeStorage,
    private menu: MenuController,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    if (this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
        .catch((err) =>
          console.warn('Screen orientation lock not supported in browser', err)
        );
    }

    this.loadCategories();
    this.loadTaskData(); // Cargar los datos de la tarea al iniciar
  }

  ionViewWillEnter() {
    if (this.platform.is('cordova')) {
      this.storage.getItem('id').then((data) => {
        console.log('Usuario en sesión:', data);
      }).catch((error) => {
        console.error('Error retrieving user data', error);
        this.router.navigate(['/login']);
      });
    }
  }

  // Cargar las categorías
  loadCategories() {
    this.db.getCategories().then((categories) => {
      this.categories = categories;
      console.log('Categorías cargadas:', this.categories);
    }).catch((error) => {
      console.error('Error al cargar las categorías:', error);
    });
  }

  // Cargar los datos de la tarea desde la base de datos
  loadTaskData() {
    const id = this.route.snapshot.paramMap.get('id'); // Obtener el ID de la tarea desde la ruta
    this.task_id = parseInt(id, 10);

    this.db.searchTaskById(this.task_id).then((task) => {
      if (task) {
        this.title = task.title;
        this.description = task.description;
        this.category_id = task.category_id;
      } else {
        console.warn('Tarea no encontrada');
      }
    }).catch((error) => {
      console.error('Error al cargar la tarea:', error);
    });
  }

  // Actualizar la tarea en la base de datos
  async updateTask() {
    if (!this.title || !this.description || !this.category_id) {
      await this.showAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    this.db.updateEditTask(this.task_id, this.title, this.description, this.category_id)
      .then(() => {
        console.log('Tarea actualizada exitosamente');
        this.location.back(); // Volver a la vista anterior
      })
      .catch(async (error) => {
        console.error('Error al actualizar la tarea:', error);
        await this.showAlert('Error', 'No se pudo actualizar la tarea. Inténtalo de nuevo.');
      });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goBack() {
    this.router.navigate(['/tasks']);
  }
}
