import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailCategoryPage } from './detail-category.page';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('DetailCategoryPage', () => {
  let component: DetailCategoryPage;
  let fixture: ComponentFixture<DetailCategoryPage>;

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
      PORTRAIT: 'portrait', // Mock de propiedad PORTRAIT
      LANDSCAPE: 'landscape', // Mock de propiedad LANDSCAPE
      currentOrientation: 'portrait-primary' // Mock de la orientación actual
    });

    // Mock de NativeStorage
    const mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'removeItem']);

    await TestBed.configureTestingModule({
      declarations: [DetailCategoryPage],
      imports: [RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SQLite, useValue: mockSQLite },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: ScreenOrientation, useValue: mockScreenOrientation }, // Proveedor para ScreenOrientation
        { provide: NativeStorage, useValue: mockNativeStorage } // Proveedor para NativeStorage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
