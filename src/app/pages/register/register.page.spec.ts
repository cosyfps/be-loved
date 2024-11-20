import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Router } from '@angular/router';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let mockNativeStorage: any;
  let mockSQLite: any;
  let mockDatabaseService: any;
  let mockScreenOrientation: any;
  let mockAlertController: any;
  let mockRouter: any;

  beforeEach(async () => {
    // Mock de NativeStorage
    mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'removeItem']);
    mockNativeStorage.getItem.and.returnValue(Promise.resolve(null));

    // Mock de SQLite
    mockSQLite = jasmine.createSpyObj('SQLite', ['create']);

    // Mock de DatabaseService
    mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['initializeDB', 'executeSQL']);

    // Mock de ScreenOrientation
    mockScreenOrientation = jasmine.createSpyObj('ScreenOrientation', ['lock', 'unlock'], {
      PORTRAIT: 'portrait',
    });

    // Mock de AlertController
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);
    mockAlertController.create.and.returnValue(
      Promise.resolve({ present: jasmine.createSpy('present') })
    );

    // Mock de Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RegisterPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: NativeStorage, useValue: mockNativeStorage },
        { provide: SQLite, useValue: mockSQLite },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: ScreenOrientation, useValue: mockScreenOrientation },
        { provide: AlertController, useValue: mockAlertController },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an alert for empty fields during registration', async () => {
    component.username = '';
    component.email = '';
    component.password = '';
    component.confirmPassword = '';
    await component.register();

    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Empty Fields',
      message: 'Please fill in all fields.',
      buttons: ['OK'],
    });
    expect((await mockAlertController.create()).present).toHaveBeenCalled();
  });

  it('should display an alert for invalid email format', async () => {
    component.username = 'user';
    component.email = 'invalid-email';
    component.password = 'Password1!';
    component.confirmPassword = 'Password1!';
    await component.register();

    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Email Error',
      message: 'Please enter a valid email address.',
      buttons: ['OK'],
    });
    expect((await mockAlertController.create()).present).toHaveBeenCalled();
  });

  it('should display an alert if passwords do not match', async () => {
    component.username = 'user';
    component.email = 'user@example.com';
    component.password = 'Password1!';
    component.confirmPassword = 'Mismatch!';
    await component.register();

    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Password Error',
      message: 'Passwords do not match.',
      buttons: ['OK'],
    });
    expect((await mockAlertController.create()).present).toHaveBeenCalled();
  });

});
