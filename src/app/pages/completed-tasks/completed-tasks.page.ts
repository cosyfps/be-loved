import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

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
  id_user: number; // ID del usuario en sesión

  constructor(
    private menu: MenuController,
    private router: Router,
    private db: DatabaseService,
    private alertController: AlertController,
    private screenOrientation: ScreenOrientation,
    private storage: NativeStorage // Para obtener el ID del usuario en sesión
  ) {}

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.menu.enable(true);
  }

  ionViewWillEnter() {
    // Obtener el ID del usuario en sesión desde el almacenamiento
    this.storage.getItem('id').then((data) => {
      this.id_user = data;
      console.log('Usuario en sesión con ID:', this.id_user);

      // Cargar las tareas completadas del usuario
      this.loadCompletedTasks();
    }).catch(error => {
      console.error('Error retrieving user ID:', error);
      this.router.navigate(['/login']); // Redirigir si no hay usuario en sesión
    });
  }

  // Cargar todas las tareas completadas del usuario
  loadCompletedTasks() {
    this.db.fetchTask().subscribe((res) => {
      // Filtrar tareas con status 2 (completada) y del usuario en sesión
      this.tasks = res.filter(task => task.status === 2 && task.user_id === this.id_user);
      console.log('Tareas completadas del usuario:', this.tasks);
      this.hasTasksCompleted = this.tasks.length > 0;
      this.groupTasksByDate(); // Agrupar por fecha
    }, (error) => {
      console.error('Error al cargar tareas:', error);
      this.tasks = [];
      this.hasTasksCompleted = false;
    });
  }

  // Agrupar las tareas por fecha de creación
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

  // Obtener las fechas agrupadas, ordenadas de más reciente a más antigua
  get taskDates(): string[] {
    return Object.keys(this.groupedTasks).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime(); // Ordenar fechas
    });
  }

  // Buscar tareas completadas por título
  searchTasks(searchTask: string) {
    if (searchTask.trim() === '') {
      // Si no hay búsqueda, recargar las tareas completadas del usuario
      this.loadCompletedTasks();
      this.errorTask = false;
    } else {
      // Buscar tareas completadas por título
      this.db.searchTaskByTitle(searchTask).then((task) => {
        if (task && task.status === 2 && task.user_id === this.id_user) {
          this.tasks = [task]; // Mostrar solo si es completada y pertenece al usuario
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
        this.loadCompletedTasks(); // Recargar la lista de tareas
      })
      .catch((error) => {
        console.error('Error deleting task', error);
      });
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

  // Navegar a la vista para agregar tareas
  goToAddTask() {
    this.router.navigate(['/add-task']);
  }
}
