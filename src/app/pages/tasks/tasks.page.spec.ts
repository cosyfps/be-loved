import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksPage } from './tasks.page';
import { IonicModule } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';  // Importar NativeStorage

describe('TasksPage', () => {
  let component: TasksPage;
  let fixture: ComponentFixture<TasksPage>;

  beforeEach(async () => {
    // Mock de SQLite
    const mockSQLite = jasmine.createSpyObj('SQLite', ['create']);

    // Mock de DatabaseService
    const mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['initializeDB', 'executeSQL']);

    // Mock de ScreenOrientation
    const mockScreenOrientation = jasmine.createSpyObj('ScreenOrientation', ['lock', 'unlock'], {
      PORTRAIT: 'portrait', // Propiedad simulada PORTRAIT
      LANDSCAPE: 'landscape', // Propiedad simulada LANDSCAPE
      currentOrientation: 'portrait-primary', // Propiedad simulada currentOrientation
    });

    // Mock de NativeStorage
    const mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'removeItem']);
    mockNativeStorage.getItem.and.returnValue(Promise.resolve('mockValue')); // Simula un valor

    await TestBed.configureTestingModule({
      declarations: [TasksPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: SQLite, useValue: mockSQLite }, // Proveedor simulado para SQLite
        { provide: DatabaseService, useValue: mockDatabaseService }, // Proveedor simulado para DatabaseService
        { provide: ScreenOrientation, useValue: mockScreenOrientation }, // Proveedor simulado para ScreenOrientation
        { provide: NativeStorage, useValue: mockNativeStorage }, // Agregar el mock de NativeStorage
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
