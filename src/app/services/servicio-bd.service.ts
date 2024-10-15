 import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contacto } from './contacto';
import { Bloque } from './bloque';
import { Ubicacion } from './ubicacion';
import { Mesas } from './mesas';
import { Reserva } from './reserva';
import { Rol } from './rol';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class ServicioBDService {

  // Variable de conexion a Base de Datos
  public database!: SQLiteObject;

  // Variable de creacion de Tablas

  // Tabla de contacto

  tablaContacto: string = "CREATE TABLE IF NOT EXISTS contacto ( id_contacto INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombrecompleto VARCHAR NOT NULL, telefono INTEGER NOT NULL, correo VARCHAR NOT NULL, mensaje TEXT NOT NULL);";

  registroContacto: string = "INSERT or IGNORE INTO contacto(id_contacto, nombrecompleto, telefono, correo, mensaje) VALUES (1,'Esteban', '959808217', 'este.toledo@duocuc.cl', 'Este es un mensaje de prueba')";
  registroContacto2: string = "INSERT or IGNORE INTO contacto(id_contacto, nombrecompleto, telefono, correo, mensaje) VALUES (2,'PEPE', '959808217', 'este.toledo@duocuc.cl', 'Este es un mensaje de prueba')";

  // Tabla Bloque

  tablaBloque: string = "CREATE TABLE IF NOT EXISTS bloque (id_bloque INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, h_inicio DATETIME NOT NULL, h_fin DATETIME NOT NULL, dia DATE NOT NULL,mes DATE NOT NULL);";

  registroBloque: string = "INSERT or IGNORE INTO bloque(id_bloque, h_inicio, h_fin, dia, mes) VALUES (1, '10:45', '11:45', '02', '10')";

  // Tabla Ubicacion

  tablaUbicacion: string = "CREATE TABLE IF NOT EXISTS ubicacion (id_ubicacion INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombre VARCHAR NOT NULL);";

  registroUbicacion: string = "INSERT or IGNORE INTO ubicacion(id_ubicacion, nombre) VALUES (1, 'Terraza')";
  registroUbicacion2: string = "INSERT or IGNORE INTO ubicacion(id_ubicacion, nombre) VALUES (2, 'Local')";

  // Tabla Mesas

  tablaMesas: string = "CREATE TABLE IF NOT EXISTS mesas (id_mesa INTEGER NOT NULL PRIMARY KEY, nombre VARCHAR NOT NULL, c_sillas INTEGER NOT NULL, id_ubi_fk INTEGER, FOREIGN KEY (id_ubi_fk) REFERENCES Ubicacion (id_ubicacion));";

  // Mesas Terrazas
  registroMesaTerraza: string = "INSERT or IGNORE INTO mesas(id_mesa, nombre, c_sillas, id_ubi_fk) VALUES (1, 'Mesa 1', 4, 1)";
  registroMesaTerraza2: string = "INSERT or IGNORE INTO mesas(id_mesa, nombre, c_sillas, id_ubi_fk) VALUES (2, 'Mesa 2', 2, 1)";
  registroMesaTerraza3: string = "INSERT or IGNORE INTO mesas(id_mesa, nombre, c_sillas, id_ubi_fk) VALUES (3, 'Mesa 3', 3, 1)";

  // Mesas Locales
  registroMesaLocal: string = "INSERT or IGNORE INTO mesas(id_mesa, nombre, c_sillas, id_ubi_fk) VALUES (4, 'Mesa 1', 4, 2)";
  registroMesaLocal2: string = "INSERT or IGNORE INTO mesas(id_mesa, nombre, c_sillas, id_ubi_fk) VALUES (5, 'Mesa 2', 5, 2)";
  registroMesaLocal3: string = "INSERT or IGNORE INTO mesas(id_mesa, nombre, c_sillas, id_ubi_fk) VALUES (6, 'Mesa 3', 3, 2)";

  // Tabla Reservas

  tablaReservas: string = "CREATE TABLE IF NOT EXISTS reserva (id_reserva INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, f_reserva DATE NOT NULL, f_creacion DATE NOT NULL, id_usuario_fk INTEGER NOT NULL, id_mesa_fk INTEGER NOT NULL, id_bloque_fk INTEGER NOT NULL, FOREIGN KEY (id_usuario_fk) REFERENCES Usuario (id_usuario), FOREIGN KEY (id_mesa_fk) REFERENCES Mesas (id_mesa), FOREIGN KEY (id_bloque_fk) REFERENCES Bloque (id_bloque));";

  // tabla Rol

  tablaRol: string = "CREATE TABLE IF NOT EXISTS rol (id_rol INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombre VARCHAR NOT NULL);";

  registroRol: string = "INSERT or IGNORE INTO rol(id_rol, nombre) VALUES (1, 'Administrador')";
  registroRol2: string = "INSERT or IGNORE INTO rol(id_rol, nombre) VALUES (2, 'Usuario')";

  // Tabla Usuario

  tablaUsuario: string = "CREATE TABLE IF NOT EXISTS Usuario (id_usuario INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, rut VARCHAR(10) NOT NULL, nombreusuario VARCHAR NOT NULL UNIQUE, nombrecompleto VARCHAR NOT NULL, contrasenia VARCHAR NOT NULL, telefono INTEGER NOT NULL, correo VARCHAR NOT NULL, fotousuario TEXT, id_rol_fk INTEGER NOT NULL, FOREIGN KEY (id_rol_fk) REFERENCES Rol (id_rol));";

  registroUsuario: string = "INSERT or IGNORE INTO Usuario(id_usuario, rut, nombreusuario, nombrecompleto, contrasenia, telefono, correo, fotousuario, id_rol_fk) VALUES (1,'213781146', 'admin', 'Aroneitor', 'admin', 930935460, 'admin@duocuc.cl','', 1)";

  registroUsuario2: string = "INSERT or IGNORE INTO Usuario(id_usuario, rut, nombreusuario, nombrecompleto, contrasenia, telefono, correo, fotousuario, id_rol_fk) VALUES (2,'205902058', 'RayCL', 'Basthian Bascuñan', '123456', 959808217, 'bast.bascunan@duocuc.cl','', 2)";

  //variables para guardar los datos de las consultas en las tablas
  
  listadoContacto = new BehaviorSubject([]);
  listadoBloque = new BehaviorSubject([]);
  listadoUbicacion = new BehaviorSubject([]);
  listadoMesas = new BehaviorSubject([]);
  listadoReservas = new BehaviorSubject([]);
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

  fetchContacto(): Observable<Contacto[]>{
    return this.listadoContacto.asObservable();
  }
  fetchBloque(): Observable<Bloque[]>{
    return this.listadoBloque.asObservable();
  }

  fetchUbicacion(): Observable<Ubicacion[]>{
    return this.listadoUbicacion.asObservable();
  }

  fetchMesas(): Observable<Mesas[]>{
    return this.listadoMesas.asObservable();
  }
  fetchReservas(): Observable<Reserva[]>{
    return this.listadoReservas.asObservable();
  }

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
      await this.database.executeSql(this.tablaContacto, []);
      await this.database.executeSql(this.tablaBloque, []);
      await this.database.executeSql(this.tablaUbicacion, []);
      await this.database.executeSql(this.tablaMesas, []);
      await this.database.executeSql(this.tablaReservas, []);
      await this.database.executeSql(this.tablaRol, []);
      await this.database.executeSql(this.tablaUsuario, []);

      //ejecuto los insert por defecto en el caso que existan
      await this.database.executeSql(this.registroContacto, []);
      await this.database.executeSql(this.registroContacto2, []);
      await this.database.executeSql(this.registroBloque, []);
      await this.database.executeSql(this.registroUbicacion, []);
      await this.database.executeSql(this.registroUbicacion2, []);
      await this.database.executeSql(this.registroMesaTerraza, []);
      await this.database.executeSql(this.registroMesaTerraza2, []);
      await this.database.executeSql(this.registroMesaTerraza3, []);
      await this.database.executeSql(this.registroMesaLocal, []);
      await this.database.executeSql(this.registroMesaLocal2, []);
      await this.database.executeSql(this.registroMesaLocal3, []);

      await this.database.executeSql(this.registroRol, []);
      await this.database.executeSql(this.registroRol2, []);
      await this.database.executeSql(this.registroUsuario, []);
      await this.database.executeSql(this.registroUsuario2, []);
      
      //llamamos a la función para seleccionar los datos de las tablas

      this.listarContactos();
      this.listarUsuario();
      this.listarReservas();
      
      //modifico el estado de la Base de Datos
      this.isDBReady.next(true);

    }catch(e){
      this.Alerta('Creación de Tablas', 'Error en crear las tablas: ' + JSON.stringify(e));
    }
  }

  // funciones de contacto
  listarContactos(){
    return this.database.executeSql('SELECT * FROM contacto', []).then(res=>{
      //variable para almacenar el resultado de la consulta
      let items: Contacto[] = [];
      //valido si trae al menos un registro
      if(res.rows.length > 0){
       //recorro mi resultado
       for(var i=0; i < res.rows.length; i++){
         //agrego los registros a mi lista
         items.push({
          id_contacto: res.rows.item(i).id_contacto,
          nombreCompleto: res.rows.item(i).nombrecompleto,
          telefono: res.rows.item(i).telefono,
          correo: res.rows.item(i).correo,
          mensaje: res.rows.item(i).mensaje
         })
       }
       
      }
      //actualizar el observable
      this.listadoContacto.next(items as any);

   })
  }
  eliminarContacto(id_contacto:string){
    return this.database.executeSql('DELETE FROM contacto WHERE id_contacto = ?',[id_contacto]).then(res=>{
      this.Alerta("Eliminar","Contacto Eliminado");
      this.listarContactos();
    }).catch(e=>{
      this.Alerta('Eliminar', 'Error: ' + JSON.stringify(e));
    })
  }

  insertarContacto(nombrecompleto: string, telefono: string, correo: string, mensaje: string) {
    return this.database.executeSql(
      'INSERT INTO contacto (nombrecompleto, telefono, correo, mensaje) VALUES (?, ?, ?, ?)', 
      [nombrecompleto, telefono, correo, mensaje]
    ).then(res => {
      this.listarContactos();
    }).catch(e => {
      this.Alerta('Contacto', 'Error: ' + JSON.stringify(e));
    });
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

  // Funciones de mesa
  buscarMesa(id_ubi_fk: string) {
    return this.database.executeSql('SELECT m.id_mesa, m.nombre, m.c_sillas, u.nombre AS id_ubi_fk FROM mesas m INNER JOIN ubicacion u ON m.id_ubi_fk = u.id_ubicacion WHERE m.id_ubi_fk = ?  ', [id_ubi_fk]).then(res => {
      //variable para almacenar el resultado de la consulta
      let items: Mesas[]= [];
      //valido si trae al menos un registro
      if(res.rows.length > 0){
      //recorro mi resultado
        for(var i=0; i < res.rows.length; i++){
        //agrego los registros a mi lista
          items.push({
            id_mesa: res.rows.item(i).id_mesa,
            nombre: res.rows.item(i).nombre,
            c_sillas: res.rows.item(i).c_sillas,
            id_ubi_fk: res.rows.item(i).id_ubi_fk
          })
        }
      }
      //actualizar el observable
      this.listadoMesas.next(items as any);})
  }

  insertarMesa(nombre: string, c_sillas: string, id_ubi_fk: string) {
    return this.database.executeSql(
      'INSERT INTO mesas (nombre, c_sillas, id_ubi_fk) VALUES (?, ?, ?)', 
      [nombre, c_sillas, id_ubi_fk]
    ).then(res => {
      this.Alerta("Agregar", "Mesa agregada exitosamente.");
      this.buscarMesa(id_ubi_fk);
    }).catch(e => {
      this.Alerta('Agregar', 'Error: ' + JSON.stringify(e));
    });
  }

  eliminarMesa(id_mesa:string){
    return this.database.executeSql('DELETE FROM mesas WHERE id_mesa = ?',[id_mesa]).then(res=>{
      this.Alerta("Eliminar","Mesa Eliminada");
      this.buscarMesa(id_mesa);
    }).catch(e=>{
      this.Alerta('Eliminar', 'Error: ' + JSON.stringify(e));
    })
  }
  modificarMesa(id_mesa:string, nombre:string, c_sillas: string, id_ubi_fk:string){
    return this.database.executeSql('UPDATE mesas SET nombre = ?, c_sillas = ?, id_ubi_fk = ? WHERE id_mesa = ?',[nombre,c_sillas, id_ubi_fk,id_mesa]).then(res=>{
      this.Alerta("Modificar","Mesa Modificada");
      this.buscarMesa(id_mesa);
    }).catch(e=>{
      this.Alerta('Modificar', 'Error: ' + JSON.stringify(e));
    })

  }


  // RESERVAS

  listarReservas(){
      return this.database.executeSql('SELECT * FROM reserva', []).then(res => {
        //variable para almacenar el resultado de la consulta
        let items: Reserva[]= [];
        //valido si trae al menos un registro
        if(res.rows.length > 0){
         //recorro mi resultado
          for(var i=0; i < res.rows.length; i++){
           //agrego los registros a mi lista
           items.push({
            id_reserva: res.rows.item(i).id_reserva,
            f_reserva: res.rows.item(i).f_reserva,
            f_creacion: res.rows.item(i).f_creacion,
            id_usuario_fk: res.rows.item(i).id_usuario_fk,
            id_mesa_fk: res.rows.item(i).id_mesa_fk,
            id_bloque_fk: res.rows.item(i).id_bloque_fk,
           })
          }
        }
        //actualizar el observable
        this.listadoReservas.next(items as any);})
  }

  insertarReserva(f_reserva:string, f_creacion: string, id_usuario_fk : number, id_mesa_fk: number, id_bloque_fk: string) {
    return this.database.executeSql(
      'INSERT INTO reserva (f_reserva, f_creacion, id_usuario_fk, id_mesa_fk, id_bloque_fk) VALUES (?, ?, ?, ?, ?)', 
      [f_reserva, f_creacion, id_usuario_fk, id_mesa_fk, id_bloque_fk]
    ).then(res => {
      this.Alerta("Agregar", "Mesa agregada exitosamente.");
      this.listarReservas();
    }).catch(e => {
      this.Alerta('Agregar', 'Error: ' + JSON.stringify(e));
    });
  }
 
  
}