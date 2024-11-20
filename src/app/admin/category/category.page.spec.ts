import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryPage } from './category.page';
import { IonicModule } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('CategoryPage', () => {
  let component: CategoryPage;
  let fixture: ComponentFixture<CategoryPage>;

  beforeEach(async () => {
    // Mock de SQLite
    const mockSQLite = jasmine.createSpyObj('SQLite', ['create']);

    // Mock de DatabaseService
    const mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['initializeDB', 'executeSQL']);

    // Mock de ScreenOrientation
    const mockScreenOrientation = jasmine.createSpyObj('ScreenOrientation', ['lock', 'unlock'], {
      PORTRAIT: 'portrait', // Mock de propiedad PORTRAIT
      LANDSCAPE: 'landscape' // Mock de propiedad LANDSCAPE
    });

    // Mock de NativeStorage
    const mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'removeItem']);

    await TestBed.configureTestingModule({
      declarations: [CategoryPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: SQLite, useValue: mockSQLite }, // Proveedor simulado para SQLite
        { provide: DatabaseService, useValue: mockDatabaseService }, // Proveedor simulado para DatabaseService
        { provide: ScreenOrientation, useValue: mockScreenOrientation }, // Proveedor simulado para ScreenOrientation
        { provide: NativeStorage, useValue: mockNativeStorage }, // Proveedor simulado para NativeStorage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
