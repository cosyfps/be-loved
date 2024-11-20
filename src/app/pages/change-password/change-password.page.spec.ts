import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordPage } from './change-password.page';
import { IonicModule } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { BehaviorSubject, of } from 'rxjs';

describe('ChangePasswordPage', () => {
  let component: ChangePasswordPage;
  let fixture: ComponentFixture<ChangePasswordPage>;

  beforeEach(async () => {
    // Mock de NativeStorage
    const mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'removeItem']);
    mockNativeStorage.getItem.and.returnValue(Promise.resolve('mockValue'));

    // Mock de ActivatedRoute con queryParams y paramMap como observables
    const mockQueryParamsSubject = new BehaviorSubject({});
    const mockActivatedRoute = {
      queryParams: mockQueryParamsSubject.asObservable(),
      paramMap: of({
        get: (key: string) => (key === 'id' ? 'mockId' : null),
      }),
    };

    // Mock de Router
    const mockRouter = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);
    mockRouter.getCurrentNavigation.and.returnValue({
      extras: {
        state: {
          id: 1,
          password: 'mockPassword',
        },
      },
    });

    // Mock de SQLite
    const mockSQLite = jasmine.createSpyObj('SQLite', ['create']);
    mockSQLite.create.and.returnValue(Promise.resolve());

    // Mock de DatabaseService
    const mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['initializeDB', 'executeSQL', 'searchUserById', 'updatePassword']);
    mockDatabaseService.executeSQL.and.returnValue(Promise.resolve([]));
    mockDatabaseService.searchUserById.and.returnValue(Promise.resolve({ password: 'oldPassword' }));
    mockDatabaseService.updatePassword.and.returnValue(Promise.resolve());

    // Mock de ScreenOrientation
    const mockScreenOrientation = jasmine.createSpyObj('ScreenOrientation', ['lock', 'unlock']);
    mockScreenOrientation.lock.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      declarations: [ChangePasswordPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NativeStorage, useValue: mockNativeStorage },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: SQLite, useValue: mockSQLite },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: ScreenOrientation, useValue: mockScreenOrientation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
