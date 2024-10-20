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
  tasks: any[] = []; // Lista de tareas
  groupedTasks: { [key: string]: any[] } = {}; // Tareas agrupadas por fecha
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
        this.db.fetchTask().subscribe((res) => {
          console.log('Tareas obtenidas:', res);
          this.tasks = res;
          this.hasTask = this.tasks.length > 0; // Verificar si hay tareas
          this.groupTasksByDate(); // Agrupar por fecha
        });
      } else {
        this.hasTask = false;
      }
    });
  }

  // Agrupa las tareas por la fecha de creación (creation_date)
  groupTasksByDate() {
    this.groupedTasks = this.tasks.reduce((groups, task) => {
      const date = task.creation_date; // Usar la fecha directamente de la base de datos

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
      return groups;
    }, {});
  }

  // Getter para obtener las fechas de las tareas agrupadas en orden descendente
  get taskDates(): string[] {
    return Object.keys(this.groupedTasks).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime(); // Ordenar de más reciente a más antigua
    });
  }

  // Buscar tareas por título
  searchTasks(query: string) {
    if (query.trim() === '') {
      this.groupTasksByDate();
      this.errorTask = false;
    } else {
      this.db.searchTaskByTitle(query).then((task) => {
        if (task) {
          this.tasks = [task];
          this.groupTasksByDate();
          this.errorTask = false;
        } else {
          this.tasks = [];
          this.errorTask = true;
        }
      });
    }
  }

  // Navegar a los detalles de la tarea
  goToDetailTask(id_task: string) {
    this.router.navigate(['/detail-tasks', id_task]);
  }

  // Navegar a la vista para agregar tareas
  goToAddTask() {
    this.router.navigate(['/add-task']);
  }

  // Mostrar una alerta
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
