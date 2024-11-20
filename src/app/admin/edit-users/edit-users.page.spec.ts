import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUsersPage } from './edit-users.page';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { of } from 'rxjs';

describe('EditUsersPage', () => {
  let component: EditUsersPage;
  let fixture: ComponentFixture<EditUsersPage>;

  beforeEach(async () => {
    // Mock de ActivatedRoute
    const mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => {
          if (key === 'id') return 'mockUserId'; // Simula el parámetro 'id'
          return null;
        }
      })
    };

    // Mock de SQLite
    const mockSQLite = jasmine.createSpyObj('SQLite', ['create']);

    // Mock de DatabaseService
    const mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['initializeDB', 'executeSQL']);

    // Mock de ScreenOrientation
    const mockScreenOrientation = jasmine.createSpyObj('ScreenOrientation', ['lock', 'unlock'], {
      PORTRAIT: 'portrait', // Propiedad simulada
      LANDSCAPE: 'landscape' // Propiedad simulada
    });

    // Mock de NativeStorage
    const mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'removeItem']);

    await TestBed.configureTestingModule({
      declarations: [EditUsersPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }, // Proveedor simulado para ActivatedRoute
        { provide: SQLite, useValue: mockSQLite }, // Proveedor simulado para SQLite
        { provide: DatabaseService, useValue: mockDatabaseService }, // Proveedor simulado para DatabaseService
        { provide: ScreenOrientation, useValue: mockScreenOrientation }, // Proveedor simulado para ScreenOrientation
        { provide: NativeStorage, useValue: mockNativeStorage } // Proveedor simulado para NativeStorage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
