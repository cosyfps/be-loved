import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-completed-tasks',
  templateUrl: './completed-tasks.page.html',
  styleUrls: ['./completed-tasks.page.scss'],
})
export class CompletedTasksPage implements OnInit {
  tasks: any[] = []; // Lista de tareas completadas
  groupedTasks: { [key: string]: any[] } = {}; // Tareas agrupadas por fecha
  searchTask: string = '';
  errorTask: boolean = false;
  hasTasksCompleted: boolean = true;

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
    this.loadCompletedTasks(); // Cargar solo tareas completadas al iniciar
  }

  // Cargar todas las tareas completadas
  loadCompletedTasks() {
    this.db.fetchTask().subscribe((res) => {
      // Filtrar solo las tareas con status 2 (completada)
      this.tasks = res.filter(task => task.status === 2);
      console.log('Tareas completadas:', this.tasks);
      this.hasTasksCompleted = this.tasks.length > 0;
      this.groupTasksByDate(); // Agrupar por fecha
    }, (error) => {
      console.error('Error al cargar tareas:', error);
      this.tasks = [];
      this.hasTasksCompleted = false;
    });
  }

  // Agrupar las tareas completadas por fecha de creación
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

  // Obtener las fechas de las tareas agrupadas, ordenadas de más reciente a más antigua
  get taskDates(): string[] {
    return Object.keys(this.groupedTasks).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime(); // Ordenar fechas
    });
  }

  // Buscar tareas completadas por título
  searchTasks(searchTask: string) {
    if (searchTask.trim() === '') {
      // Si no hay búsqueda, recargar las tareas completadas
      this.loadCompletedTasks();
      this.errorTask = false;
    } else {
      // Buscar tareas completadas por título
      this.db.searchTaskByTitle(searchTask).then((task) => {
        if (task && task.status === 2) {
          this.tasks = [task]; // Mostrar solo si está completada
          this.errorTask = false;
        } else {
          this.tasks = [];
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

  // Mostrar una alerta
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Navegar a la vista para agregar tareas
  goToAddTask() {
    this.router.navigate(['/add-task']);
  }
}
