import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {
  tasks: any = [];

  searchTask: string = '';
  errorTask: boolean = false;
  hasTask: boolean = true;

  constructor(
    private menu: MenuController,
    private router: Router,
    private db: DatabaseService,
    private alertController: AlertController,
    private screenOrientation: ScreenOrientation
  ) {}

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.menu.enable(true);

    this.db.dbState().subscribe((data) => {
      if (data) {
        this.db.listTasks(); // Carga las tareas al iniciar
        this.db.fetchTask().subscribe((res) => {
          console.log('Tareas obtenidas:', res); // Verificar datos en consola
          this.tasks = res;
          this.hasTask = this.tasks.length > 0; // Actualiza hasTask según los resultados
        });
      }
    });
  }

  searchTasks(searchTask: string) {
    if (searchTask === '') {
      this.db.listTasks();
      this.errorTask = false;
    } else {
      this.db.searchTaskByTitle(searchTask).then((task) => {
        if (task) {
          this.tasks = [task];
          this.errorTask = false;
        } else {
          this.tasks = [];
          this.errorTask = true;
        }
      }).catch((error) => {
        console.error('Error buscando tarea:', error);
      });
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

  goToDetailTask(id_task: string) {
    this.router.navigate(['/detail-tasks', id_task]);
  }

  goToAddTask() {
    this.router.navigate(['/add-task']);
  }
}
