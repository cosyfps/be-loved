import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-completed-tasks',
  templateUrl: './completed-tasks.page.html',
  styleUrls: ['./completed-tasks.page.scss'],
})
export class CompletedTasksPage implements OnInit {

  hasTasksCompleted: boolean = false; // Cambia esto a 'true' si hay tareas disponibles

  constructor(private router:Router) { }

  ngOnInit() {
  }

  goToHome(){
    this.router.navigate(['/home']);
  }
}
