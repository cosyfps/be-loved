import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeUsernamePage } from './change-username.page';
import { IonicModule } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { BehaviorSubject, of } from 'rxjs';

describe('ChangeUsernamePage', () => {
  let component: ChangeUsernamePage;
  let fixture: ComponentFixture<ChangeUsernamePage>;

  beforeEach(async () => {
    // Mock de SQLite
    const mockSQLite = jasmine.createSpyObj('SQLite', ['create']);

    // Mock de DatabaseService
    const mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['initializeDB', 'executeSQL', 'searchUserById', 'updateUsername', 'updateEmail']);
    mockDatabaseService.initializeDB.and.returnValue(Promise.resolve());
    mockDatabaseService.executeSQL.and.returnValue(Promise.resolve([{ id: 1, username: 'mockUser' }]));
    mockDatabaseService.searchUserById.and.returnValue(Promise.resolve({ username: 'mockUser', email: 'mockEmail', user_photo: 'mockImage' }));
    mockDatabaseService.updateUsername.and.returnValue(Promise.resolve());
    mockDatabaseService.updateEmail.and.returnValue(Promise.resolve());

    // Mock de NativeStorage
    const mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'removeItem']);
    mockNativeStorage.getItem.and.returnValue(Promise.resolve('mockValue'));

    // Mock de ScreenOrientation
    const mockScreenOrientation = jasmine.createSpyObj('ScreenOrientation', ['lock', 'unlock']);
    mockScreenOrientation.lock.and.returnValue(Promise.resolve());

    // Mock de ActivatedRoute con un observable válido para queryParams
    const queryParamsSubject = new BehaviorSubject({});
    const mockActivatedRoute = {
      queryParams: queryParamsSubject.asObservable(), // Simula el observable queryParams
      paramMap: of({
        get: (key: string) => (key === 'id' ? 'mockUserId' : null), // Simula un parámetro 'id'
      }),
    };

    // Mock de Router
    const mockRouter = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);
    mockRouter.getCurrentNavigation.and.returnValue({
      extras: {
        state: {
          us: 'mockUser',
          id: 1,
          cor: 'mockEmail',
          img: 'mockImage',
        },
      },
    });

    await TestBed.configureTestingModule({
      declarations: [ChangeUsernamePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: SQLite, useValue: mockSQLite },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NativeStorage, useValue: mockNativeStorage },
        { provide: ScreenOrientation, useValue: mockScreenOrientation },
        { provide: Router, useValue: mockRouter },
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
