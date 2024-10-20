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
  tasks: any[] = [];
  groupedTasks: { [key: string]: any[] } = {};
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

    // Suscribirse al estado de la base de datos y cargar tareas
    this.db.dbState().subscribe((data) => {
      if (data) {
        this.loadTasks(); // Cargar todas las tareas al iniciar
      } else {
        this.hasTask = false;
      }
    });
  }

  // Cargar todas las tareas y agruparlas por fecha
  loadTasks() {
    this.db.fetchTask().subscribe((res) => {
      this.tasks = res;
      this.hasTask = this.tasks.length > 0;
      this.groupTasksByDate(); // Agrupar por fecha
    }, (error) => {
      console.error('Error cargando tareas:', error);
      this.tasks = [];
      this.hasTask = false;
    });
  }
  

  // Agrupa las tareas por la fecha de creación (sin la hora)
  groupTasksByDate() {
    this.groupedTasks = this.tasks.reduce((groups, task) => {
      const date = task.creation_date.split('T')[0]; // Usar solo la fecha
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
      return groups;
    }, {});
  }

  // Obtener las fechas agrupadas en orden descendente
  get taskDates(): string[] {
    return Object.keys(this.groupedTasks).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }

  // Buscar tareas por título
  searchTasks(query: string) {
    if (query.trim() === '') {
      // Si no hay búsqueda, cargar todas las tareas
      this.loadTasks();
      this.errorTask = false;
    } else {
      // Realizar la búsqueda con Promises
      this.db.searchTaskByTitle(query).then((task) => {
        if (task) {
          this.tasks = [task]; // Mostrar la tarea encontrada
          this.errorTask = false;
        } else {
          this.tasks = []; // No se encontró la tarea
          this.errorTask = true;
        }
        this.groupTasksByDate(); // Agrupar después de buscar
      }).catch((error) => {
        console.error('Error buscando tarea:', error);
        this.tasks = [];
        this.errorTask = true;
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

  // Mostrar alerta
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
