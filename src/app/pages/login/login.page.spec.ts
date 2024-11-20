import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule, AlertController } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let mockRouter: any;
  let mockNativeStorage: any;
  let mockDatabaseService: any;
  let mockScreenOrientation: any;
  let mockAlertController: any;

  beforeEach(async () => {
    // Mock de Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Mock de NativeStorage
    mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem']);
    mockNativeStorage.getItem.and.returnValue(Promise.resolve(null));

    // Mock de DatabaseService
    mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['loginUser']);
    mockDatabaseService.loginUser.and.returnValue(Promise.resolve(null));

    // Mock de ScreenOrientation
    mockScreenOrientation = jasmine.createSpyObj('ScreenOrientation', ['lock', 'unlock'], {
      PORTRAIT: 'portrait',
    });

    // Mock de AlertController
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);
    mockAlertController.create.and.returnValue(
      Promise.resolve({ present: jasmine.createSpy('present') })
    );

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: NativeStorage, useValue: mockNativeStorage },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: ScreenOrientation, useValue: mockScreenOrientation },
        { provide: AlertController, useValue: mockAlertController },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.passwordVisible).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeFalse();
  });

  it('should display an alert if fields are empty', async () => {
    component.username = '';
    component.password = '';
    await component.goToPage();

    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Empty Fields',
      message: 'Please try again',
      buttons: ['OK'],
    });
    expect((await mockAlertController.create()).present).toHaveBeenCalled();
  });

  it('should navigate to forgot-password page', () => {
    component.goToForgotPassword();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/forgot-password']);
  });

  it('should navigate to start page', () => {
    component.goToStart();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/start']);
  });
});
