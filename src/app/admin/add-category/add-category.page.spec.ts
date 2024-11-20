import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCategoryPage } from './add-category.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para ngForm
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('AddCategoryPage', () => {
  let component: AddCategoryPage;
  let fixture: ComponentFixture<AddCategoryPage>;

  beforeEach(async () => {
    // Mock de SQLite
    const mockSQLite = jasmine.createSpyObj('SQLite', ['create']);

    // Mock de DatabaseService
    const mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['initializeDB', 'executeSQL']);

    // Mock de NativeStorage
    const mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'removeItem']);

    await TestBed.configureTestingModule({
      declarations: [AddCategoryPage],
      imports: [IonicModule.forRoot(), FormsModule], // FormsModule agregado aquí
      providers: [
        { provide: SQLite, useValue: mockSQLite },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: NativeStorage, useValue: mockNativeStorage }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
