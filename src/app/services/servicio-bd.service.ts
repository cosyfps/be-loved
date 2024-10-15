 import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Rol } from './rol';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class ServicioBDService {

  // Variable de conexion a Base de Datos
  public database!: SQLiteObject;

  // Variable de creacion de Tabla
  // tabla Rol

  tablaRol: string = "CREATE TABLE IF NOT EXISTS rol (id_rol INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombre VARCHAR NOT NULL);";

  registroRol: string = "INSERT or IGNORE INTO rol(id_rol, nombre) VALUES (1, 'Administrador')";
  registroRol2: string = "INSERT or IGNORE INTO rol(id_rol, nombre) VALUES (2, 'Usuario')";

  // Tabla Usuario
  tablaUsuario: string = "CREATE TABLE IF NOT EXISTS Usuario (id_usuario INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, rut VARCHAR(10) NOT NULL, nombreusuario VARCHAR NOT NULL UNIQUE, nombrecompleto VARCHAR NOT NULL, contrasenia VARCHAR NOT NULL, telefono INTEGER NOT NULL, correo VARCHAR NOT NULL, fotousuario TEXT, id_rol_fk INTEGER NOT NULL, FOREIGN KEY (id_rol_fk) REFERENCES Rol (id_rol));";

  registroUsuario: string = "INSERT or IGNORE INTO Usuario(id_usuario, rut, nombreusuario, nombrecompleto, contrasenia, telefono, correo, fotousuario, id_rol_fk) VALUES (1,'213781146', 'admin', 'Aroneitor', 'admin', 930935460, 'admin@duocuc.cl','', 1)";

  registroUsuario2: string = "INSERT or IGNORE INTO Usuario(id_usuario, rut, nombreusuario, nombrecompleto, contrasenia, telefono, correo, fotousuario, id_rol_fk) VALUES (2,'205902058', 'RayCL', 'Basthian Bascuñan', '123456', 959808217, 'bast.bascunan@duocuc.cl','', 2)";

  //variables para guardar los datos de las consultas en las tablas
  
  listadoRol = new BehaviorSubject([]);
  listadoUsuario = new BehaviorSubject([]);
  

  //variable para el status de la Base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) {
    this.createBD();
  }

  async Alerta(titulo: string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
      cssClass:'estilo-alertas'
    });

    await alert.present();
  }

  //metodos para manipular los observables
  fetchRol(): Observable<Rol[]>{
    return this.listadoRol.asObservable();
  }

  fetchUsuario(): Observable<Usuario[]>{
    return this.listadoUsuario.asObservable();
  }

  dbState(){
    return this.isDBReady.asObservable();
  }

  //función para crear la Base de Datos
  createBD(){
    //varificar si la plataforma esta disponible
    this.platform.ready().then(()=>{
      //crear la Base de Datos
      this.sqlite.create({
        name: 'sazonyarte.db',
        location: 'default'
      }).then((db: SQLiteObject)=>{

        //capturar la conexion a la BD
        this.database = db;
        //llamamos a la función para crear las tablas
        this.crearTablas();
      }).catch(e=>{
        this.Alerta('Base de Datos', 'Error en crear la BD: ' + JSON.stringify(e));
      })
    })
  }

  async crearTablas(){
    try{
      //ejecuto la creación de Tablas
      await this.database.executeSql(this.tablaRol, []);
      await this.database.executeSql(this.tablaUsuario, []);

      //ejecuto los insert por defecto en el caso que existan
      await this.database.executeSql(this.registroRol, []);
      await this.database.executeSql(this.registroRol2, []);
      await this.database.executeSql(this.registroUsuario, []);
      await this.database.executeSql(this.registroUsuario2, []);
      
      //llamamos a la función para seleccionar los datos de las tablas
      this.listarUsuario();
      
      //modifico el estado de la Base de Datos
      this.isDBReady.next(true);

    }catch(e){
      this.Alerta('Creación de Tablas', 'Error en crear las tablas: ' + JSON.stringify(e));
    }
  }

 //funciones de usuario

 listarUsuario() {
  return this.database.executeSql('SELECT u.id_usuario, u.rut, u.nombreusuario, u.nombrecompleto, u.correo, u.telefono, r.nombre AS id_rol_fk FROM Usuario u INNER JOIN rol r ON u.id_rol_fk = r.id_rol', []).then(res => {
    //variable para almacenar el resultado de la consulta
    let items: Usuario[]= [];
    //valido si trae al menos un registro
    if(res.rows.length > 0){
     //recorro mi resultado
      for(var i=0; i < res.rows.length; i++){
       //agrego los registros a mi lista
       items.push({
        id_usuario: res.rows.item(i).id_usuario,
        rut: res.rows.item(i).rut,
        nombreUsuario: res.rows.item(i).nombreusuario,
        nombreCompleto: res.rows.item(i).nombrecompleto,
        correo: res.rows.item(i).correo,
        telefono: res.rows.item(i).telefono,
        id_rol_fk: res.rows.item(i).id_rol_fk,

        // dudas con el profesor
        contrasenia: '',
        fotousuario:''
       })
      }
    }
    //actualizar el observable
    this.listadoUsuario.next(items as any);})
  }

  cambiarRolUsu(id_usuario: string, id_rol_fk: string){
    return this.database.executeSql('UPDATE Usuario SET id_rol_fk = ? WHERE id_usuario = ?',[id_rol_fk,id_usuario]).then(res=>{
      this.Alerta("Rol","Rol cambiado");
      this.listarUsuario();
    }).catch(e=>{
      this.Alerta('Cambiar Rol', 'Error: ' + JSON.stringify(e));
    })
  }

  eliminarUsuario(id_usuario:string){
    return this.database.executeSql('DELETE FROM usuario WHERE id_usuario = ?',[id_usuario]).then(res=>{
      this.Alerta("Eliminar","Usuario Eliminado");
      this.listarUsuario();
    }).catch(e=>{
      this.Alerta('Eliminar', 'Error: ' + JSON.stringify(e));
    })
  }

  buscarUsuario(rut:string){
    return this.database.executeSql('SELECT id_usuario, rut, nombreusuario, nombrecompleto, correo, telefono, id_rol_fk FROM Usuario WHERE rut = ?', [rut]).then(res => {
      //variable para almacenar el resultado de la consulta
      let items: Usuario[]= [];
      //valido si trae al menos un registro
      if(res.rows.length > 0){
       //recorro mi resultado
        for(var i=0; i < res.rows.length; i++){
         //agrego los registros a mi lista
         items.push({
          id_usuario: res.rows.item(i).id_usuario,
          rut: res.rows.item(i).rut,
          nombreUsuario: res.rows.item(i).nombreusuario,
          nombreCompleto: res.rows.item(i).nombrecompleto,
          correo: res.rows.item(i).correo,
          telefono: res.rows.item(i).telefono,
          id_rol_fk:res.rows.item(i).id_rol_fk,

          // dudas con el profesor
          contrasenia: '',
          fotousuario: '',
         })
        }
      }
      //actualizar el observable
      this.listadoUsuario.next(items as any);})
  }

  ModificarUsuario(nombreusuario: String, correo: String, fotousuario: any,id_usuario: number){
    return this.database.executeSql(
      'UPDATE Usuario SET nombreusuario = ?, correo = ?, fotousuario = ? WHERE id_usuario = ?',
      [nombreusuario, correo, fotousuario, id_usuario]
    ).then(res => {
      this.Alerta("Modificar", "Usuario modificado exitosamente.");
      this.listarUsuario();
    }).catch(e => {
      this.Alerta('Modificar', 'Error: ' + JSON.stringify(e));
    });
  }
  modificarContra(contrasenia: string, id_usuario: number){
    return this.database.executeSql(
      'UPDATE Usuario SET contrasenia = ? WHERE id_usuario = ?',
      [contrasenia, id_usuario]
    ).then(res => {
      this.listarUsuario();
    }).catch(e => {
      this.Alerta('Modificar', 'Error: ' + JSON.stringify(e));
    });
  }

  insertarUsuario(nombreusuario: String, correo: String, contrasenia: String, fotousuario: string, id_rol_fk: number) {
    return this.database.executeSql(
      'INSERT INTO Usuario (nombreusuario, correo, contrasenia, fotousuario, id_rol_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
      [nombreusuario, correo, contrasenia, fotousuario, id_rol_fk]
    ).then(res => {
      this.listarUsuario();
    }).catch(e => {
      this.Alerta('Agregar', 'Error: ' + JSON.stringify(e));
    });
  }

  IniciarSesion(usuario: string, contrasenia: string) {
    return this.database.executeSql(
      'SELECT * FROM Usuario WHERE nombreusuario = ? AND contrasenia = ?', [usuario, contrasenia]
    ).then(res => {
      if (res.rows.length > 0) {
        // Si las credenciales son correctas, retorna el usuario encontrado
        return res.rows.item(0);
      } else {
        // Si no hay coincidencias, retorna null
        return null;
      }
    }).catch(e => {
      this.Alerta('Usuario', 'Error: ' + JSON.stringify(e));
      return null;
    });
  }

  BuscarCorreoUsuario(usuario: string) {
    return this.database.executeSql(
      'SELECT id_usuario, correo FROM Usuario WHERE nombreusuario = ?', [usuario]
    ).then(res => {
      if (res.rows.length > 0) {
        // Si las credenciales son correctas, retorna el usuario encontrado
        return {
          id_usuario: res.rows.item(0).id_usuario,
          correo: res.rows.item(0).correo
        };
      } else {
        // Si no hay coincidencias, retorna null
        return null;
      }
    }).catch(e => {
      this.Alerta('Usuario', 'Error: ' + JSON.stringify(e));
      return null;
    });
  }

  miPerfil(id_usuario: number){
    return this.database.executeSql(
      'SELECT * FROM Usuario WHERE id_usuario = ?', [id_usuario]
    ).then(res => {
      if (res.rows.length > 0) {
        // Si las credenciales son correctas, retorna el usuario encontrado
        return res.rows.item(0);
      } else {
        // Si no hay coincidencias, retorna null
        return null;
      }
    }).catch(e => {
      this.Alerta('Usuario', 'Error: ' + JSON.stringify(e));
      return null;
    });
  }
 
  
}