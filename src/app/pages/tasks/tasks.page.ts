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

  async ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

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

  // Obtener los detalles de una tarea específica
  getTaskDetails(id_task: number) {
    this.db.searchTaskById(id_task)
      .then((task) => {
        if (task) {
          this.confirmDeleteTask(task); // Llamar a la confirmación con todos los detalles de la tarea
        }
      })
      .catch((error) => {
        console.error('Error retrieving task data', error);
      });
  }

  // Confirmar eliminación de tarea
  async confirmDeleteTask(task: any) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete the task: ${task.title}?`,
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
            this.deleteTask(task.id_task, task.title);
          },
        },
      ],
    });

    await alert.present();
  }

  // Eliminar la tarea
  deleteTask(id_task: number, task_title: string) {
    this.db.deleteTask(id_task)
      .then(() => {
        console.log(`Task "${task_title}" deleted successfully.`);
        this.loadUserTasks(); // Recargar la lista de tareas
      })
      .catch((error) => {
        console.error('Error deleting task', error);
      });
  }

  // Navegar a los detalles de la tarea
  goToDetailTask(id_task: number) {
    this.router.navigate(['/detail-tasks', id_task]);
  }

  // Navegar a la vista de edición de la tarea
  goToEditTask(id_task: number) {
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
