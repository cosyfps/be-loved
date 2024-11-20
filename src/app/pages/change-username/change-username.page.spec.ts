import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeUsernamePage } from './change-username.page';
import { IonicModule } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { of } from 'rxjs';

describe('ChangeUsernamePage', () => {
  let component: ChangeUsernamePage;
  let fixture: ComponentFixture<ChangeUsernamePage>;

  beforeEach(async () => {
    // Mock de SQLite
    const mockSQLite = jasmine.createSpyObj('SQLite', ['create']);

    // Mock de DatabaseService
    const mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['initializeDB', 'executeSQL']);
    mockDatabaseService.initializeDB.and.returnValue(Promise.resolve());
    mockDatabaseService.executeSQL.and.returnValue(Promise.resolve([{ id: 1, username: 'mockUser' }]));

    // Mock de NativeStorage
    const mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'removeItem']);
    mockNativeStorage.getItem.and.returnValue(Promise.resolve('mockValue'));

    // Mock de ScreenOrientation
    const mockScreenOrientation = jasmine.createSpyObj('ScreenOrientation', ['lock', 'unlock'], {
      PORTRAIT: 'portrait',
      LANDSCAPE: 'landscape',
    });
    mockScreenOrientation.lock.and.returnValue(Promise.resolve());

    // Mock de ActivatedRoute con un observable válido
    const mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => (key === 'id' ? 'mockUserId' : null),
        getAll: (key: string) => (key === 'id' ? ['mockUserId'] : []),
        keys: ['id'],
        has: (key: string) => key === 'id',
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [ChangeUsernamePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: SQLite, useValue: mockSQLite },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NativeStorage, useValue: mockNativeStorage },
        { provide: ScreenOrientation, useValue: mockScreenOrientation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeUsernamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
