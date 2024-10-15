import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { AuthfireBaseService } from 'src/app/services/authfire-base.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  users: any = [
    {
      userId: '',
      username: '',
      email: '',
      roleId: ''
    },
  ];

  searchUsername: string = "";
  errorUsername: boolean = false;

  constructor(private menu: MenuController, private db: DatabaseService, private authFireBase: AuthfireBaseService) { }

  ngOnInit() {
    this.menu.enable(false);

    this.db.dbState().subscribe(data => {
      // Validate if the database is ready
      if (data) {
        // Subscribe to the users observable
        this.db.fetchUser().subscribe(res => {
          this.users = res;
        });
      }
    });
  }

  deleteUser(user: any) {
    this.authFireBase.deleteUser(user.userId);
    this.db.deleteUser(user.userId);
  }

  searchUser(searchUsername: any) {
    if (searchUsername == "") {
      this.db.listUsers();
      this.errorUsername = false;
    } else {
      // Search the user by Rut
      this.db.searchUser(searchUsername).then(() => {
        // If no results, activate the ngIf
        if (this.users.length == 0) {
          this.errorUsername = true;
        }
      });
    }
  }

  changeUserRole(user: any) {
    if (user.roleId == "User") {
      this.db.changeUserRole(user.userId, "1");
    } else {
      this.db.changeUserRole(user.userId, "2");
    }
  }
}
