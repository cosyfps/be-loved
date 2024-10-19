import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  category: any = [
    {
      id_category: '',
      name: '',
    },
  ];

  searchCategory: string = "";
  errorCategory: boolean = false;

  constructor(
    private menu: MenuController,
    private router: Router,
    private db: DatabaseService,
    private alertController: AlertController,
    private screenOrientation: ScreenOrientation
  ) { }

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.menu.enable(true);

    this.db.dbState().subscribe(data => {
    if (data) {
      this.db.listCategories();
      this.db.fetchCategory().subscribe((res) => {
        console.log('Categorías obtenidas:', res); // Verificar los datos
        this.category = res;
      });
    }
  });
  }

  searchCategorys(searchCategory: string) {
    if (searchCategory === "") {
      this.db.listCategories();
      this.errorCategory = false;
    } else {
      // Search the category by name
      this.db.searchCategoryByName(searchCategory).then((cat) => {
        if (cat) {
          this.category = [cat];
          this.errorCategory = false;
        } else {
          this.category = [];
          this.errorCategory = true;
        }
      }).catch(error => {
        console.error('Error searching for category', error);
      });
    }
  }

  goToAdmin() {
    this.router.navigate(['/adminhome']);
  }

  goToDetailCategory(id_category: string) {
    this.router.navigate(['/detail-category', id_category]);
  }

  goToAddCategory() {
    this.router.navigate(['/add-category']);
  }
}
