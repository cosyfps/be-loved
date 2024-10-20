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
    const statusMessage = newStatus === 2 ? 'Mark as Complete' : 'Mark as Pending';

    this.task.status = newStatus; // Cambiar estado

    this.db.updateTask(this.task).then(() => {
      console.log(`Estado de la tarea actualizado: ${this.task.status}`);
      this.cdr.detectChanges(); // Forzar actualización en la vista
    }).catch((error) => {
      console.error('Error al actualizar estado:', error);
    });
  }
  

  getCategoryName(category_id: number): string {
    switch (category_id) {
      case 1:
        return 'Work';
      case 2:
        return 'Personal';
      default:
        return '';
    }
  }

  goBack() {
    this.location.back();
  }

}
