import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { Location } from '@angular/common';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {
  title: string = '';
  description: string = '';
  due_date: string = '';
  creation_date: string = new Date().toISOString();
  completion_date: string = '';
  status: number = 1;
  category_id: number;
  user_id: number;
  categories: any[] = []; // Lista de categorías

  constructor(
    private db: DatabaseService,
    private router: Router,
    private location: Location,
    private storage: NativeStorage,
    private menu: MenuController,
    private screenOrientation: ScreenOrientation,
    private platform: Platform
  ) {}

  ngOnInit() {
    if (this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
        .catch((err) =>
          console.warn('Screen orientation lock not supported in browser', err)
        );
    }

    this.menu.enable(true);
    this.loadCategories(); // Cargar categorías al iniciar
  }

  ionViewWillEnter() {
    if (this.platform.is('cordova')) {
      this.storage.getItem('id').then((data) => {
        this.user_id = data;
        return this.db.searchUserById(this.user_id);
      }).then((data) => {
        if (data) {
          console.log('Usuario en sesión:', data.username);
        }
      }).catch((error) => {
        console.error('Error retrieving user data', error);
        this.router.navigate(['/login']);
      });
    } else {
      console.warn('NativeStorage not available in browser');
      this.user_id = 1;
    }
  }

  // Cargar las categorías usando la nueva función del servicio
  loadCategories() {
    this.db.getCategories().then((categories) => {
      this.categories = categories;
      console.log('Categorías cargadas:', this.categories);
    }).catch((error) => {
      console.error('Error al cargar las categorías:', error);
    });
  }

  addTask() {
    if (!this.title || !this.description || !this.category_id) {
      console.error('All fields are required');
      return;
    }

    this.db.insertTask(
      this.title,
      this.description,
      this.due_date,
      this.creation_date,
      this.completion_date,
      this.status,
      this.category_id,
      this.user_id
    ).then(() => {
      console.log('Task added successfully');
      this.location.back();
    }).catch((error) => {
      console.error('Error adding task:', error);
    });
  }

  goBack() {
    this.location.back();
  }
}
