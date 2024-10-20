import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detail-tasks',
  templateUrl: './detail-tasks.page.html',
  styleUrls: ['./detail-tasks.page.scss'],
})
export class DetailTasksPage implements OnInit {
  task: any = {}; // Objeto para almacenar la tarea seleccionada
  id_task: number;

  name: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DatabaseService,
    private cdr: ChangeDetectorRef, // Detección manual de cambios
    private alertController: AlertController, // AlertController para confirmaciones
    private location: Location // Inyección del servicio Location
  ) {}

  ngOnInit() {
    const id_task = this.route.snapshot.paramMap.get('id');
    if (id_task) {
      this.loadTask(Number(id_task));
    }
  }

  // Cargar la tarea por ID
  loadTask(id: number) {
    this.db.searchTaskById(id).then((task) => {
      if (task) {
        this.task = task;
        this.id_task = task.id_task;

        // Llamar a getCategoryName() con el id_category de la tarea cargada
        if (task.category_id) {
          this.getCategoryName(task.category_id);
        }

        this.cdr.detectChanges(); // Forzar la detección de cambios
      } else {
        console.error('Tarea no encontrada');
        this.router.navigate(['/tasks']); // Redirigir si no se encuentra la tarea
      }
    }).catch((error) => {
      console.error('Error al cargar tarea:', error);
    });
  }

  // Alternar el estado de la tarea entre completada y pendiente
  toggleTaskStatus() {
    const newStatus = this.task.status === 2 ? 1 : 2;
    this.task.status = newStatus; // Cambiar estado

    this.db.updateTask(this.task).then(() => {
      console.log(`Estado de la tarea actualizado: ${this.task.status}`);
      this.cdr.detectChanges(); // Forzar actualización en la vista
    }).catch((error) => {
      console.error('Error al actualizar estado:', error);
    });
  }

  async getCategoryName(category_id: number) {
    try {
      const data = await this.db.getCategoryNameById(category_id);
      if (data) {
        this.name = data.name; // Actualiza el nombre de la categoría
        this.cdr.detectChanges(); // Forzar la detección de cambios
      } else {
        console.error('Categoria no encontrada');
      }
    } catch (error) {
      console.error('Error al cargar categoria:', error);
    }
  }

  goBack() {
    this.location.back();
  }
}