import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

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
  id_user: number; // ID del usuario de la sesión

  constructor(
    private menu: MenuController,
    private router: Router,
    private db: DatabaseService,
    private alertController: AlertController,
    private screenOrientation: ScreenOrientation,
    private storage: NativeStorage // Añadido para obtener el ID del usuario
  ) {}

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.menu.enable(true);
  }

  ionViewWillEnter() {
    // Obtener el ID del usuario desde el almacenamiento
    this.storage.getItem('id').then((data) => {
      this.id_user = data;
      console.log('Usuario en sesión con ID:', this.id_user);

      // Cargar solo las tareas asociadas al usuario
      this.loadUserTasks();
    }).catch(error => {
      console.error('Error retrieving user ID:', error);
      this.router.navigate(['/login']); // Redirigir si no hay usuario en sesión
    });
  }

  // Cargar todas las tareas del usuario
  loadUserTasks() {
    this.db.fetchTask().subscribe((res) => {
      // Filtrar las tareas solo para el usuario actual
      this.tasks = res.filter(task => task.user_id === this.id_user);
      this.hasTask = this.tasks.length > 0;
      this.groupTasksByDate(); // Agrupar por fecha
    }, (error) => {
      console.error('Error cargando tareas:', error);
      this.tasks = [];
      this.hasTask = false;
    });
  }

  // Agrupar las tareas por la fecha de creación
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
      this.loadUserTasks(); // Recargar tareas del usuario si no hay búsqueda
      this.errorTask = false;
    } else {
      this.db.searchTaskByTitle(query).then((task) => {
        if (task && task.user_id === this.id_user) {
          this.tasks = [task]; // Mostrar la tarea si pertenece al usuario
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
  goToEditTask(id_task: string) {
    this.router.navigate(['/edit-tasks', id_task]);
  }
  deleteTask(id_task: string) {
    this.router.navigate(['/edit-tasks', id_task]);
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
