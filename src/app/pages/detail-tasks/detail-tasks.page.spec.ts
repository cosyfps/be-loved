import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailTasksPage } from './detail-tasks.page';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('DetailTasksPage', () => {
  let component: DetailTasksPage;
  let fixture: ComponentFixture<DetailTasksPage>;

  beforeEach(async () => {
    // Mock de ActivatedRoute
    const mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => {
          if (key === 'id') return 'mockTaskId'; // Simula un parámetro 'id'
          return null;
        }
      })
    };

    // Mock de SQLite
    const mockSQLite = jasmine.createSpyObj('SQLite', ['create']);

    // Mock de DatabaseService
    const mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['initializeDB', 'executeSQL']);

    // Mock de NativeStorage
    const mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'removeItem']);

    await TestBed.configureTestingModule({
      declarations: [DetailTasksPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SQLite, useValue: mockSQLite },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: NativeStorage, useValue: mockNativeStorage }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailTasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
