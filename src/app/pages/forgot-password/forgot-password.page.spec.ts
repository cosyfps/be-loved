import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordPage } from './forgot-password.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { HttpClientModule } from '@angular/common/http';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

describe('ForgotPasswordPage', () => {
  let component: ForgotPasswordPage;
  let fixture: ComponentFixture<ForgotPasswordPage>;

  beforeEach(async () => {
    // Mock de SQLite
    const mockSQLite = jasmine.createSpyObj('SQLite', ['create', 'executeSql']);
    mockSQLite.create.and.returnValue(Promise.resolve()); // Simula la creación de la base de datos
    mockSQLite.executeSql.and.returnValue(Promise.resolve()); // Simula la ejecución de una consulta SQL

    // Mock de ScreenOrientation
    const mockScreenOrientation = jasmine.createSpyObj('ScreenOrientation', ['lock', 'unlock']);
    mockScreenOrientation.lock.and.returnValue(Promise.resolve()); // Simula el método lock devolviendo una Promise resuelta

    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule, // Importa FormsModule para formularios
        HttpClientModule, // Asegúrate de que HttpClientModule esté importado
      ],
      providers: [
        { provide: SQLite, useValue: mockSQLite }, // Proveedor simulado para SQLite
        { provide: DatabaseService, useValue: {} }, // Mock del servicio de base de datos
        { provide: ScreenOrientation, useValue: mockScreenOrientation }, // Proveedor simulado para ScreenOrientation
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Refleja los cambios en el componente
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
