import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from '../services/models/role';
import { User } from '../services/models/user';
import { Category } from '../services/models/category';
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

  // Category table
  categoryTable: string = "CREATE TABLE IF NOT EXISTS Category (id_category INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name VARCHAR NOT NULL UNIQUE);";

  insertCategory1: string = "INSERT or IGNORE INTO Category(id_category, name) VALUES (1, 'Work')";
  insertCategory2: string = "INSERT or IGNORE INTO Category(id_category, name) VALUES (2, 'Personal')";
  insertCategory3: string = "INSERT or IGNORE INTO Category(id_category, name) VALUES (3, 'Others')";

  // Task table
  // status -- 1 = Pendiente, 2 = Completada
  taskTable: string = "CREATE TABLE IF NOT EXISTS Task (id_task INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title VARCHAR NOT NULL, description TEXT, due_date TEXT NOT NULL, creation_date TEXT NOT NULL, completion_date TEXT, status INTEGER NOT NULL, category_id INTEGER NOT NULL, user_id INTEGER NOT NULL, FOREIGN KEY (category_id) REFERENCES Category (id_category), FOREIGN KEY (user_id) REFERENCES User (id_user));";

  insertTask1: string = "INSERT OR IGNORE INTO Task (id_task, title, description, due_date, creation_date, completion_date, status, category_id, user_id) VALUES (1, 'Limpiar patios', 'Limpiar zona de perros y darle amor a la kiba', '', '2024-10-19', NULL, 1, 2, 1);";
  insertTask2: string = "INSERT OR IGNORE INTO Task (id_task, title, description, due_date, creation_date, completion_date, status, category_id, user_id) VALUES (2, 'Develop Mobile App Completed', 'Complete the mobile application in only three days', '', '2024-10-20', NULL, 2, 1, 1);";


  // Variables to store query data from tables
  roleList = new BehaviorSubject([]);
  userList = new BehaviorSubject([]);
  categoryList = new BehaviorSubject([]);
  taskList = new BehaviorSubject([]);

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

  fetchCategory(): Observable<Category[]> {
    return this.categoryList.asObservable();
  }

  fetchTask(): Observable<Task[]> {
    return this.taskList.asObservable();
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
        this.deleteDatabase().then(() => {
          this.createTables();
        });
        // this.createTables();
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
      await this.database.executeSql('DROP TABLE IF EXISTS Category', []);
      await this.database.executeSql('DROP TABLE IF EXISTS Task', []);
    } catch (e) {
      this.showAlert('Database Deletion', 'Error deleting the database: ' + JSON.stringify(e));
    }
  }
  

  async createTables() {
    try {
      await this.database.executeSql(this.roleTable, []);
      await this.database.executeSql(this.userTable, []);
      await this.database.executeSql(this.categoryTable, []);
      await this.database.executeSql(this.taskTable, []);

      // Execute default inserts if they exist
      await this.database.executeSql(this.insertRoleAdmin, []);
      await this.database.executeSql(this.insertRoleUser, []);

      await this.database.executeSql(this.insertAdmin, []);
      await this.database.executeSql(this.insertUser1, []);
      await this.database.executeSql(this.insertUser2, []);

      await this.database.executeSql(this.insertCategory1, []);
      await this.database.executeSql(this.insertCategory2, []);
      await this.database.executeSql(this.insertCategory3, []);

      await this.database.executeSql(this.insertTask1, []);
      await this.database.executeSql(this.insertTask2, []);

      this.listUsers();
      this.listCategories();
      this.listTasks();

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

  async adminUpdateUser(username: string, email: string, password: string, id_role_fk: number,user_photo: string, id_user: number) {
    return this.database.executeSql(
      'UPDATE User SET username = ?, email = ?, password = ?, id_role_fk = ?, user_photo = ? WHERE id_user = ?',
      [username, email, password, id_role_fk, user_photo, id_user]
    ).then(res => {
      this.showAlert("Update", "Admin updated User successfully");
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

  async updateEmail(newEmail: string, id_user: number) {
    return this.database.executeSql(
      'UPDATE User SET email = ? WHERE id_user = ?',
      [newEmail, id_user]
    ).then(res => {
      this.showAlert('Update Username', 'Email updated successfully');
      this.listUsers();
    }).catch(e => {
      this.showAlert('Update Username', 'Error: ' + JSON.stringify(e));
    });
  }


  // Category functions
  listCategories() {
    return this.database.executeSql('SELECT * FROM Category', []).then(res => {
      let items: Category[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id_category: res.rows.item(i).id_category,
            name: res.rows.item(i).name,
          });
        }
      }
      this.categoryList.next(items); // Actualiza el observable con las categorías obtenidas
    }).catch(e => {
      this.showAlert('Get Categories', 'Error: ' + JSON.stringify(e));
    });
  }
  
  

  async insertCategory(name: string) {
    return this.database.executeSql('INSERT INTO Category (name) VALUES (?)', [name])
      .then(() => this.listCategories())
      .catch(e => this.showAlert('Insert Category', 'Error: ' + JSON.stringify(e)));
  }

  async updateCategory(id_category: number, name: string) {
    return this.database.executeSql('UPDATE Category SET name = ? WHERE id_category = ?', [name, id_category])
      .then(() => this.listCategories())
      .catch(e => this.showAlert('Update Category', 'Error: ' + JSON.stringify(e)));
  }

  async deleteCategory(id_category: number) {
    return this.database.executeSql('DELETE FROM Category WHERE id_category = ?', [id_category])
      .then(() => this.listCategories())
      .catch(e => this.showAlert('Delete Category', 'Error: ' + JSON.stringify(e)));
  }

  async searchCategoryByName(name: string) {
    return this.database.executeSql('SELECT * FROM Category WHERE name = ?', [name])
      .then(res => {
        if (res.rows.length > 0) {
          return {
            id_category: res.rows.item(0).id_category,
            name: res.rows.item(0).name
          };
        } else {
          return null; // No se encontró la categoría
        }
      })
      .catch(e => {
        this.showAlert('Search Category', 'Error: ' + JSON.stringify(e));
        return null;
      });
  }

  async searchCategoryById(id: number) {
    return this.database.executeSql('SELECT * FROM Category WHERE id_category = ?', [id])
      .then(res => {
        if (res.rows.length > 0) {
          return {
            id_category: res.rows.item(0).id_category,
            name: res.rows.item(0).name,
          };
        } else {
          return null;
        }
      })
      .catch(e => {
        this.showAlert('Search Category by ID', 'Error: ' + JSON.stringify(e));
        return null;
      });
  }

  async getCategoryNameById(id_category: number) {
    return this.database.executeSql('SELECT name FROM Category WHERE id_category = ?', [id_category])
      .then(res => {
        if (res.rows.length > 0) {
          return {
            name: res.rows.item(0).name,
          };
        } else {
          return null;
        }
      })
      .catch(e => {
        this.showAlert('Search Category Name by ID', 'Error: ' + JSON.stringify(e));
        return null;
      });
  }
  
  getCategories(): any {
    return this.database.executeSql('SELECT * FROM Category', [])
      .then((res) => {
        let categories: Category[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          categories.push({
            id_category: res.rows.item(i).id_category,
            name: res.rows.item(i).name,
          });
        }
        return categories;
      }).catch((error) => {
        console.error('Error al obtener categorías:', error);
        return [];
      });
  }

  

  // Task functions
  listTasks() {
    this.database.executeSql('SELECT * FROM Task', []).then(res => {
      let tasks: Task[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        tasks.push({
          id_task: res.rows.item(i).id_task,
          title: res.rows.item(i).title,
          description: res.rows.item(i).description,
          due_date: res.rows.item(i).due_date,
          creation_date: res.rows.item(i).creation_date,
          completion_date: res.rows.item(i).completion_date,
          status: res.rows.item(i).status,
          category_id: res.rows.item(i).category_id,
          user_id: res.rows.item(i).user_id,
        });
      }
      console.log('Tareas obtenidas:', tasks); // Verificar en consola
      this.taskList.next(tasks); // Actualiza el observable
    }).catch(e => {
      console.error('Error al obtener tareas:', e);
      this.showAlert('Get Tasks', 'Error: ' + JSON.stringify(e));
    });
  }
  

  async insertTask(title: string, description: string, due_date: string, creation_date: string, completion_date: string, status: number, category_id: number, user_id: number) {
    return this.database.executeSql(
      `INSERT INTO Task (title, description, due_date, creation_date, completion_date, status, category_id, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, due_date, creation_date, completion_date, status, category_id, user_id]
    ).then(() => this.listTasks())
      .catch(e => this.showAlert('Insert Task', 'Error: ' + JSON.stringify(e)));
  }

  async updateTask(task: Task) {
    const { id_task, title, description, due_date, completion_date, status, category_id, user_id } = task;
    return this.database.executeSql(
      `UPDATE Task SET title = ?, description = ?, due_date = ?, completion_date = ?, status = ?, category_id = ?, user_id = ? 
       WHERE id_task = ?`,
      [title, description, due_date, completion_date, status, category_id, user_id, id_task]
    ).then(() => this.listTasks())
      .catch(e => this.showAlert('Update Task', 'Error: ' + JSON.stringify(e)));
  }

  async deleteTask(id_task: number) {
    return this.database.executeSql('DELETE FROM Task WHERE id_task = ?', [id_task])
      .then(() => this.listTasks())
      .catch(e => this.showAlert('Delete Task', 'Error: ' + JSON.stringify(e)));
  }

  async searchTaskByTitle(title: string) {
    return this.database.executeSql('SELECT * FROM Task WHERE title LIKE ?', [`%${title}%`])
      .then((res) => {
        if (res.rows.length > 0) {
          return {
            id_task: res.rows.item(0).id_task,
            title: res.rows.item(0).title,
            description: res.rows.item(0).description,
            due_date: res.rows.item(0).due_date,
            creation_date: res.rows.item(0).creation_date,
            completion_date: res.rows.item(0).completion_date,
            status: res.rows.item(0).status,
            category_id: res.rows.item(0).category_id,
            user_id: res.rows.item(0).user_id,
          };
        } else {
          return null;
        }
      })
      .catch((e) => {
        console.error('Error buscando tarea por título:', e);
        return null;
      });
  }
  
  searchTaskById(id: number): any {
    return this.database.executeSql('SELECT * FROM Task WHERE id_task = ?', [id])
      .then((res) => {
        if (res.rows.length > 0) {
          const task = res.rows.item(0);
          return {
            id_task: task.id_task,
            title: task.title,
            description: task.description,
            due_date: task.due_date,
            creation_date: task.creation_date,
            completion_date: task.completion_date,
            status: task.status,
            category_id: task.category_id,
            user_id: task.user_id,
          };
        } else {
          console.error('Tarea no encontrada');
          return null;
        }
      }).catch((error) => {
        console.error('Error al buscar tarea por ID:', error);
        return null;
      });
  }
  
}



