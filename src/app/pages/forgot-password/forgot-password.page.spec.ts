import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordPage } from './forgot-password.page';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { MailgunService } from 'src/app/services/mailgun.service';
import { Router } from '@angular/router';

describe('ForgotPasswordPage', () => {
  let component: ForgotPasswordPage;
  let fixture: ComponentFixture<ForgotPasswordPage>;
  let mockScreenOrientation: any;
  let mockDatabaseService: any;
  let mockMailgunService: any;
  let mockRouter: any;
  let mockAlertController: any;

  beforeEach(async () => {
    // Mock de ScreenOrientation
    mockScreenOrientation = jasmine.createSpyObj('ScreenOrientation', ['lock']);
    mockScreenOrientation.lock.and.returnValue(Promise.resolve());

    // Mock de DatabaseService
    mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['searchUserByEmail']);
    mockDatabaseService.searchUserByEmail.and.returnValue(Promise.resolve(null));

    // Mock de MailgunService
    mockMailgunService = jasmine.createSpyObj('MailgunService', ['sendEmail']);
    mockMailgunService.sendEmail.and.returnValue(Promise.resolve());

    // Mock de Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Mock de AlertController
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);
    mockAlertController.create.and.returnValue(
      Promise.resolve({ present: jasmine.createSpy('present') })
    );

    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        HttpClientModule,
      ],
      providers: [
        { provide: ScreenOrientation, useValue: mockScreenOrientation },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: MailgunService, useValue: mockMailgunService },
        { provide: Router, useValue: mockRouter },
        { provide: AlertController, useValue: mockAlertController },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should display an error alert if email is empty', async () => {
    component.email = '';
    await component.sendCode();

    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Please enter an email address',
      buttons: ['OK'],
    });
    expect((await mockAlertController.create()).present).toHaveBeenCalled();
  });

  it('should display an error alert if email is invalid', async () => {
    component.email = 'invalid-email';
    await component.sendCode();

    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Please enter a valid email address',
      buttons: ['OK'],
    });
    expect((await mockAlertController.create()).present).toHaveBeenCalled();
  });

  it('should display an error alert if entered code does not match generated code', async () => {
    component.generatedCode = 'ABC123';
    component.enteredCode = 'WRONG';
    await component.verifyCode();

    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Invalid code. Please try again.',
      buttons: ['OK'],
    });
    expect((await mockAlertController.create()).present).toHaveBeenCalled();
  });
  
});
