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

    this.db.dbState().subscribe((data) => {
      if (data) {
        this.db.fetchTask().subscribe((res) => {
          // Filtrar solo las tareas con status 2 (completada)
          this.tasks = res.filter(task => task.status === 2);
          console.log('Tareas completadas:', this.tasks);
          this.hasTasksCompleted = this.tasks.length > 0; // Verificar si hay tareas
          this.groupTasksByDate(); // Agrupar por fecha
        });
      } else {
        this.hasTasksCompleted = false;
      }
    });
  }

  // Agrupar las tareas completadas por fecha de creación
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

  // Obtener las fechas de las tareas agrupadas, ordenadas de más reciente a más antigua
  get taskDates(): string[] {
    return Object.keys(this.groupedTasks).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime(); // Ordenar fechas
    });
  }

  // Buscar tareas por título dentro de las completadas
  searchTasks(query: string) {
    if (query.trim() === '') {
      this.groupTasksByDate();
      this.errorTask = false;
    } else {
      const filteredTasks = this.tasks.filter(task =>
        task.title.toLowerCase().includes(query.toLowerCase())
      );
      this.tasks = filteredTasks;
      this.groupTasksByDate();
      this.errorTask = filteredTasks.length === 0;
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

  goToAddTask(){
    this.router.navigate(['/add-task']);
  }
}
