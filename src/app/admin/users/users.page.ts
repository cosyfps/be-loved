import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: any = [
    {
      id_user: '',
      username: '',
      email: '',
      id_role_fk: ''
    },
  ];

  searchUsername: string = "";
  errorUsername: boolean = false;

  constructor(private menu: MenuController, private router: Router, private db: DatabaseService, private alertController: AlertController, private screenOrientation: ScreenOrientation) { }

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.menu.enable(true);

    this.db.dbState().subscribe(data => {
      // Validate if the database is ready
      if (data) {
        // Subscribe to the users observable
        this.db.listUsers();
        this.db.fetchUser().subscribe(res => {
          this.users = res;
        });
      }
    });
  }

  searchUser(searchUsername: any) {
    if (searchUsername == "") {
      this.db.listUsers();
      this.errorUsername = false;
    } else {
      // Search the user by username
      this.db.searchUserByUsername(searchUsername).then((user) => {
        if (user) {
          this.users = [user];
          this.errorUsername = false;
        } else {
          this.users = [];
          this.errorUsername = true;
        }
      }).catch(error => {
        console.error('Error searching for user', error);
      });
    }
  }

  goToAdmin() {
    this.router.navigate(['/adminhome']);
  }

  goToDetail(id_user: string) {
    this.router.navigate(['/detail-users', id_user]);
  }

  goToAddUsers(){
    this.router.navigate(['/add-users']);
  }

}
