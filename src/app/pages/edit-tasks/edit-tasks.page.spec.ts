import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTasksPage } from './edit-tasks.page';
import { IonicModule } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ActivatedRoute } from '@angular/router';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { of } from 'rxjs';

describe('EditTasksPage', () => {
  let component: EditTasksPage;
  let fixture: ComponentFixture<EditTasksPage>;

  beforeEach(async () => {
    // Mock de SQLite
    const mockSQLite = jasmine.createSpyObj('SQLite', ['create']);

    // Mock de DatabaseService
    const mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['initializeDB', 'executeSQL']);

    // Mock de NativeStorage
    const mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'removeItem']);

    // Mock de ActivatedRoute
    const mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => {
          if (key === 'id') return 'mockTaskId'; // Simula el parámetro 'id' que podría estar en la ruta
          return null;
        }
      })
    };

    // Mock de ScreenOrientation
    const mockScreenOrientation = jasmine.createSpyObj('ScreenOrientation', ['lock', 'unlock'], {
      PORTRAIT: 'portrait', // Mock de propiedad PORTRAIT
      LANDSCAPE: 'landscape' // Mock de propiedad LANDSCAPE
    });

    await TestBed.configureTestingModule({
      declarations: [EditTasksPage],
      imports: [IonicModule.forRoot(), FormsModule], // Agregar FormsModule aquí
      providers: [
        { provide: SQLite, useValue: mockSQLite },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: NativeStorage, useValue: mockNativeStorage },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ScreenOrientation, useValue: mockScreenOrientation } // Proveedor simulado para ScreenOrientation
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditTasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
