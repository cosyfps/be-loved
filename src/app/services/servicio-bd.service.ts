import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from '../services/models/role';
import { User } from '../services/models/user';
import { Task } from '../services/models/task';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  // Database connection variable
  public database!: SQLiteObject;

  // Table creation variable
  // Role table
  roleTable: string = "CREATE TABLE IF NOT EXISTS Role (id_role INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, namerole VARCHAR NOT NULL);";

  insertRoleAdmin: string = "INSERT or IGNORE INTO Role(id_role, namerole) VALUES (1, 'Admin')";
  insertRoleUser: string = "INSERT or IGNORE INTO Role(id_role, namerole) VALUES (2, 'User')";

  // User table
  userTable: string = "CREATE TABLE IF NOT EXISTS User (id_user INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username VARCHAR NOT NULL UNIQUE, password VARCHAR NOT NULL, email VARCHAR NOT NULL UNIQUE, user_photo TEXT, id_role_fk INTEGER NOT NULL, FOREIGN KEY (id_role_fk) REFERENCES Role (id_role));";

  insertAdmin: string = "INSERT or IGNORE INTO User(id_user, username, password, email, user_photo, id_role_fk) VALUES (1, 'admin', 'admin', 'admin@duocuc.cl', '', 1)";
  insertUser1: string = "INSERT or IGNORE INTO User(id_user, username, password, email, user_photo, id_role_fk) VALUES (2, 'cosyfps', 'KM_2024*Cl', 'kel.moreno@duocuc.cl', '', 2)";
  insertUser2: string = "INSERT or IGNORE INTO User(id_user, username, password, email, user_photo, id_role_fk) VALUES (3, 'b3hidalgo', 'b3njA*2024', 'be.hidalgog@duocuc.cl', '', 2)";

  // Variables to store query data from tables
  roleList = new BehaviorSubject([]);
  userList = new BehaviorSubject([]);

  // Database status variable
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) {
    this.deleteAndCreateDatabase();
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Methods to manipulate observables
  fetchRole(): Observable<Role[]> {
    return this.roleList.asObservable();
  }

  fetchUser(): Observable<User[]> {
    return this.userList.asObservable();
  }

  dbState() {
    return this.isDBReady.asObservable();
  }

   // Function to delete and create the database
   deleteAndCreateDatabase() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'beloved.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        // this.deleteDatabase().then(() => {
        //   this.createTables();
        // });
        this.createTables();
      }).catch(e => {
        this.showAlert('Database', 'Error creating the database: ' + JSON.stringify(e));
      });
    });
  }

  // Function to delete the database tables
  async deleteDatabase() {
    try {
      await this.database.executeSql('DROP TABLE IF EXISTS User', []);
      await this.database.executeSql('DROP TABLE IF EXISTS Role', []);
    } catch (e) {
      this.showAlert('Database Deletion', 'Error deleting the database: ' + JSON.stringify(e));
    }
  }

  async createTables() {
    try {
      await this.database.executeSql(this.roleTable, []);
      await this.database.executeSql(this.userTable, []);

      // Execute default inserts if they exist
      await this.database.executeSql(this.insertRoleAdmin, []);
      await this.database.executeSql(this.insertRoleUser, []);
      await this.database.executeSql(this.insertAdmin, []);
      await this.database.executeSql(this.insertUser1, []);
      await this.database.executeSql(this.insertUser2, []);

      this.listUsers();
      this.isDBReady.next(true);
    } catch (e) {
      this.showAlert('Table Creation', 'Error creating tables: ' + JSON.stringify(e));
    }
  }

  // User functions

  listUsers() {
    return this.database.executeSql('SELECT * FROM User', []).then(res => {
      let items: User[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id_user: res.rows.item(i).id_user,
            username: res.rows.item(i).username,
            email: res.rows.item(i).email,
            password: res.rows.item(i).password,
            user_photo: res.rows.item(i).user_photo,
            id_role_fk: res.rows.item(i).id_role_fk,
          });
        }
      }
      this.userList.next(items);
    }).catch(e => {
      this.showAlert('Get Users', 'Error: ' + JSON.stringify(e));
    });
  }

  async insertUser(username: string, email: string, password: string, user_photo: string, id_role_fk: number) {
    return this.database.executeSql(
      'INSERT INTO User (username, email, password, user_photo, id_role_fk) VALUES (?, ?, ?, ?, ?)',
      [username, email, password, user_photo, id_role_fk]
    ).then(res => {
      this.listUsers();
    }).catch(e => {
      this.showAlert('Insert User', 'Error: ' + JSON.stringify(e));
    });
  }

  async updateUser(username: string, email: string, user_photo: string, id_user: number) {
    return this.database.executeSql(
      'UPDATE User SET username = ?, email = ?, user_photo = ? WHERE id_user = ?',
      [username, email, user_photo, id_user]
    ).then(res => {
      this.showAlert("Update", "User updated successfully");
      this.listUsers();
    }).catch(e => {
      this.showAlert('Update User', 'Error: ' + JSON.stringify(e));
    });
  }

  async deleteUser(id_user: number) {
    return this.database.executeSql('DELETE FROM User WHERE id_user = ?', [id_user]).then(res => {
      this.showAlert("Delete", "User deleted successfully");
      this.listUsers();
    }).catch(e => {
      this.showAlert('Delete User', 'Error: ' + JSON.stringify(e));
    });
  }

  async loginUser(username: string, password: string): Promise<any> {
    try {
      const res = await this.database.executeSql(
        'SELECT * FROM User WHERE username = ? AND password = ?',
        [username, password]
      );
      if (res.rows.length > 0) {
        return res.rows.item(0);
      } else {
        return null;
      }
    } catch (error) {
      this.showAlert('Login Error', 'Error: ' + JSON.stringify(error));
      return null;
    }
  }

  async searchUserByEmail(email: string) {
    return this.database.executeSql('SELECT * FROM User WHERE email = ?', [email]).then(res => {
      if (res.rows.length > 0) {
        return res.rows.item(0);
      } else {
        return null;
      }
    }).catch(e => {
      this.showAlert('Search User', 'Error: ' + JSON.stringify(e));
      return null;
    });
  }

  async searchUserByUsername(username: string) {
    return this.database.executeSql('SELECT * FROM User WHERE username = ?', [username]).then(res => {
      if (res.rows.length > 0) {
        return res.rows.item(0);
      } else {
        return null;
      }
    }).catch(e => {
      this.showAlert('Search User', 'Error: ' + JSON.stringify(e));
      return null;
    });
  }

  async searchUserById(id_user: number) {
    return this.database.executeSql('SELECT * FROM User WHERE id_user = ?', [id_user]).then(res => {
      if (res.rows.length > 0) {
        return res.rows.item(0);
      } else {
        return null;
      }
    }).catch(e => {
      this.showAlert('Search User by ID', 'Error: ' + JSON.stringify(e));
      return null;
    });
  }

  async updatePassword(password: string, id_user: number) {
    return this.database.executeSql(
      'UPDATE User SET password = ? WHERE id_user = ?',
      [password, id_user]
    ).then(res => {
      this.showAlert('Update Password', 'Password updated successfully');
      this.listUsers();
    }).catch(e => {
      this.showAlert('Update Password', 'Error: ' + JSON.stringify(e));
    });
  }

  async updateUsername(newUsername: string, id_user: number) {
    return this.database.executeSql(
      'UPDATE User SET username = ? WHERE id_user = ?',
      [newUsername, id_user]
    ).then(res => {
      this.showAlert('Update Username', 'Username updated successfully');
      this.listUsers();
    }).catch(e => {
      this.showAlert('Update Username', 'Error: ' + JSON.stringify(e));
    });
  }
}
