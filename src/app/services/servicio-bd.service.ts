import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from './role';
import { User } from './user';
import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  // Database connection variable
  public database!: SQLiteObject;

  // Table creation variable
  // Role table

  roleTable: string = "CREATE TABLE IF NOT EXISTS rol (id_rol INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombre VARCHAR NOT NULL);";

  insertRoleAdmin: string = "INSERT or IGNORE INTO rol(id_rol, nombre) VALUES (1, 'Administrator')";
  insertRoleUser: string = "INSERT or IGNORE INTO rol(id_rol, nombre) VALUES (2, 'User')";

  // User table
  userTable: string = "CREATE TABLE IF NOT EXISTS Usuario (id_user INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username VARCHAR NOT NULL UNIQUE, password VARCHAR NOT NULL, email VARCHAR NOT NULL, user_photo TEXT, id_role_fk INTEGER NOT NULL, FOREIGN KEY (id_role_fk) REFERENCES rol (id_rol));";

  insertAdmin: string = "INSERT or IGNORE INTO Usuario(id_user, username, password, email, user_photo, id_role_fk) VALUES (1, 'admin', 'admin', 'admin@duocuc.cl', '', 1)";
  insertUser1: string = "INSERT or IGNORE INTO Usuario(id_user, username, password, email, user_photo, id_role_fk) VALUES (2, 'cosyfps', 'KM_2024*Cl', 'kel.moreno@duocuc.cl', '', 2)";
  insertUser2: string = "INSERT or IGNORE INTO Usuario(id_user, username, password, email, user_photo, id_role_fk) VALUES (3, 'b3hidalgo', 'b3njA*2024', 'be.hidalgog@duocuc.cl', '', 2)";

  // Task table
  taskTable: string = "CREATE TABLE IF NOT EXISTS Task (id_task INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title VARCHAR NOT NULL, description TEXT, due_date TEXT, status VARCHAR NOT NULL, user_id INTEGER NOT NULL, FOREIGN KEY (user_id) REFERENCES Usuario (id_user));";

  // Variables to store query data from tables
  roleList = new BehaviorSubject([]);
  userList = new BehaviorSubject([]);
  taskList = new BehaviorSubject([]);

  // Database status variable
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) {
    this.createDatabase();
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
      cssClass: 'alert-style'
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

  fetchTask(): Observable<Task[]> {
    return this.taskList.asObservable();
  }

  dbState() {
    return this.isDBReady.asObservable();
  }

  // Function to create the database
  createDatabase() {
    // Verify if the platform is available
    this.platform.ready().then(() => {
      // Create the database
      this.sqlite.create({
        name: 'beloved.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        // Capture the database connection
        this.database = db;
        // Call the function to create tables
        this.createTables();
      }).catch(e => {
        this.showAlert('Database', 'Error creating the database: ' + JSON.stringify(e));
      })
    })
  }

  async createTables() {
    try {
      // Execute table creation
      await this.database.executeSql(this.roleTable, []);
      await this.database.executeSql(this.userTable, []);
      await this.database.executeSql(this.taskTable, []);


      // Execute default inserts if they exist
      await this.database.executeSql(this.insertRoleAdmin, []);
      await this.database.executeSql(this.insertRoleUser, []);
      await this.database.executeSql(this.insertAdmin, []);
      await this.database.executeSql(this.insertUser1, []);
      await this.database.executeSql(this.insertUser2, []);

      // Call the function to select data from the tables
      this.listUsers();

      // Modify the database status
      this.isDBReady.next(true);

    } catch (e) {
      this.showAlert('Table Creation', 'Error creating tables: ' + JSON.stringify(e));
    }
  }

  // User functions

  listUsers() {
    return this.database.executeSql('SELECT u.id_user, u.username, u.email, u.user_photo, r.nombre AS id_role_fk FROM Usuario u INNER JOIN rol r ON u.id_role_fk = r.id_rol', []).then(res => {
      // Variable to store query result
      let items: User[] = [];
      // Check if at least one record is returned
      if (res.rows.length > 0) {
        // Iterate over the result
        for (var i = 0; i < res.rows.length; i++) {
          // Add records to the list
          items.push({
            id_user: res.rows.item(i).id_user,
            username: res.rows.item(i).username,
            email: res.rows.item(i).email,
            user_photo: res.rows.item(i).user_photo,
            id_role_fk: res.rows.item(i).id_role_fk,
            password: ''
          })
        }
      }
      // Update the observable
      this.userList.next(items as any);
    })
  }

  changeUserRole(id_user: string, id_role_fk: string) {
    return this.database.executeSql('UPDATE Usuario SET id_role_fk = ? WHERE id_user = ?', [id_role_fk, id_user]).then(res => {
      this.showAlert("Role", "Role changed successfully");
      this.listUsers();
    }).catch(e => {
      this.showAlert('Change Role', 'Error: ' + JSON.stringify(e));
    })
  }

  deleteUser(id_user: string) {
    return this.database.executeSql('DELETE FROM Usuario WHERE id_user = ?', [id_user]).then(res => {
      this.showAlert("Delete", "User deleted successfully");
      this.listUsers();
    }).catch(e => {
      this.showAlert('Delete', 'Error: ' + JSON.stringify(e));
    })
  }

  searchUser(username: string) {
    return this.database.executeSql('SELECT id_user, username, email, user_photo, id_role_fk FROM Usuario WHERE username = ?', [username]).then(res => {
      // Variable to store query result
      let items: User[] = [];
      // Check if at least one record is returned
      if (res.rows.length > 0) {
        // Iterate over the result
        for (var i = 0; i < res.rows.length; i++) {
          // Add records to the list
          items.push({
            id_user: res.rows.item(i).id_user,
            username: res.rows.item(i).username,
            email: res.rows.item(i).email,
            user_photo: res.rows.item(i).user_photo,
            id_role_fk: res.rows.item(i).id_role_fk,
            password: ''
          })
        }
      }
      // Update the observable
      this.userList.next(items as any);
    })
  }

  updateUser(username: String, email: String, user_photo: any, id_user: number) {
    return this.database.executeSql(
      'UPDATE Usuario SET username = ?, email = ?, user_photo = ? WHERE id_user = ?',
      [username, email, user_photo, id_user]
    ).then(res => {
      this.showAlert("Update", "User updated successfully");
      this.listUsers();
    }).catch(e => {
      this.showAlert('Update', 'Error: ' + JSON.stringify(e));
    });
  }

  updatePassword(password: string, id_user: number) {
    return this.database.executeSql(
      'UPDATE Usuario SET password = ? WHERE id_user = ?',
      [password, id_user]
    ).then(res => {
      this.listUsers();
    }).catch(e => {
      this.showAlert('Update Password', 'Error: ' + JSON.stringify(e));
    });
  }

  insertUser(username: String, email: String, password: String, user_photo: string, id_role_fk: number) {
    return this.database.executeSql(
      'INSERT INTO Usuario (username, email, password, user_photo, id_role_fk) VALUES (?, ?, ?, ?, ?)', 
      [username, email, password, user_photo, id_role_fk]
    ).then(res => {
      this.listUsers();
    }).catch(e => {
      this.showAlert('Insert User', 'Error: ' + JSON.stringify(e));
    });
  }

  loginUser(username: string, password: string) {
    return this.database.executeSql(
      'SELECT * FROM Usuario WHERE username = ? AND password = ?', [username, password]
    ).then(res => {
      if (res.rows.length > 0) {
        // If credentials are correct, return the found user
        return res.rows.item(0);
      } else {
        // If no matches, return null
        return null;
      }
    }).catch(e => {
      this.showAlert('User', 'Error: ' + JSON.stringify(e));
      return null;
    });
  }

  searchUserEmail(username: string) {
    return this.database.executeSql(
      'SELECT id_user, email FROM Usuario WHERE username = ?', [username]
    ).then(res => {
      if (res.rows.length > 0) {
        // If the credentials are correct, return the found user
        return {
          id_user: res.rows.item(0).id_user,
          email: res.rows.item(0).email
        };
      } else {
        // If no matches, return null
        return null;
      }
    }).catch(e => {
      this.showAlert('User', 'Error: ' + JSON.stringify(e));
      return null;
    });
  }

  getUserProfile(id_user: number) {
    return this.database.executeSql(
      'SELECT * FROM Usuario WHERE id_user = ?', [id_user]
    ).then(res => {
      if (res.rows.length > 0) {
        // If the credentials are correct, return the found user
        return res.rows.item(0);
      } else {
        // If no matches, return null
        return null;
      }
    }).catch(e => {
      this.showAlert('User', 'Error: ' + JSON.stringify(e));
      return null;
    });
  }

  // Task funtions
  
  listTasks() {
    return this.database.executeSql('SELECT * FROM Task', []).then(res => {
      // Variable to store query result
      let items: Task[] = [];
      // Check if at least one record is returned
      if (res.rows.length > 0) {
        // Iterate over the result
        for (var i = 0; i < res.rows.length; i++) {
          // Add records to the list
          items.push({
            id_task: res.rows.item(i).id_task,
            title: res.rows.item(i).title,
            description: res.rows.item(i).description,
            due_date: res.rows.item(i).due_date,
            status: res.rows.item(i).status,
            user_id: res.rows.item(i).user_id
          })
        }
      }
      // Update the observable
      this.taskList.next(items as any);
    })
  }

  insertTask(title: string, description: string, due_date: string, status: string, user_id: number) {
    return this.database.executeSql(
      'INSERT INTO Task (title, description, due_date, status, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, due_date, status, user_id]
    ).then(res => {
      this.listTasks();
    }).catch(e => {
      this.showAlert('Insert Task', 'Error: ' + JSON.stringify(e));
    });
  }

  updateTask(id_task: number, title: string, description: string, due_date: string, status: string) {
    return this.database.executeSql(
      'UPDATE Task SET title = ?, description = ?, due_date = ?, status = ? WHERE id_task = ?',
      [title, description, due_date, status, id_task]
    ).then(res => {
      this.listTasks();
    }).catch(e => {
      this.showAlert('Update Task', 'Error: ' + JSON.stringify(e));
    });
  }

  deleteTask(id_task: number) {
    return this.database.executeSql('DELETE FROM Task WHERE id_task = ?', [id_task]).then(res => {
      this.showAlert('Delete Task', 'Task deleted successfully');
      this.listTasks();
    }).catch(e => {
      this.showAlert('Delete Task', 'Error: ' + JSON.stringify(e));
    });
  }
}