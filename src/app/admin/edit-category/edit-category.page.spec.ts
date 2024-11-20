import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCategoryPage } from './edit-category.page';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';  // Importar ScreenOrientation
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';  // Importar NativeStorage
import { of } from 'rxjs';

describe('EditCategoryPage', () => {
  let component: EditCategoryPage;
  let fixture: ComponentFixture<EditCategoryPage>;

  beforeEach(async () => {
    // Mock de ActivatedRoute
    const mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => {
          if (key === 'id') return 'mockCategoryId'; // Simula el parámetro 'id'
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
      PORTRAIT: 'portrait',  // Mock de propiedad PORTRAIT
      LANDSCAPE: 'landscape' // Mock de propiedad LANDSCAPE
    });

    // Mock de NativeStorage
    const mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'removeItem']);
    mockNativeStorage.getItem.and.returnValue(Promise.resolve('mockValue'));  // Simula el valor de getItem

    await TestBed.configureTestingModule({
      declarations: [EditCategoryPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SQLite, useValue: mockSQLite }, // Proveedor simulado para SQLite
        { provide: DatabaseService, useValue: mockDatabaseService }, // Proveedor simulado para DatabaseService
        { provide: ScreenOrientation, useValue: mockScreenOrientation }, // Proveedor simulado para ScreenOrientation
        { provide: NativeStorage, useValue: mockNativeStorage } // Proveedor simulado para NativeStorage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
