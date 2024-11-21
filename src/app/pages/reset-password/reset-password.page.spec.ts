import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordPage } from './reset-password.page';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/servicio-bd.service';

describe('ResetPasswordPage', () => {
  let component: ResetPasswordPage;
  let fixture: ComponentFixture<ResetPasswordPage>;
  let mockRouter: any;
  let mockDatabaseService: any;
  let mockAlertController: any;
  let mockToastController: any;

  beforeEach(async () => {
    // Mock de Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);
    mockRouter.getCurrentNavigation.and.returnValue({
      extras: { state: { email: 'test@example.com' } },
    });

    // Mock de DatabaseService
    mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['updatePasswordByEmail']);
    mockDatabaseService.updatePasswordByEmail.and.returnValue(Promise.resolve());

    // Mock de AlertController
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);
    mockAlertController.create.and.returnValue(
      Promise.resolve({ present: jasmine.createSpy('present') })
    );

    // Mock de ToastController
    mockToastController = jasmine.createSpyObj('ToastController', ['create']);
    mockToastController.create.and.returnValue(
      Promise.resolve({ present: jasmine.createSpy('present') })
    );

    await TestBed.configureTestingModule({
      declarations: [ResetPasswordPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: AlertController, useValue: mockAlertController },
        { provide: ToastController, useValue: mockToastController },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an alert if fields are empty', async () => {
    component.newPassword = '';
    component.confirmPassword = '';
    await component.resetPassword();

    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Empty Fields',
      message: 'Please fill in all fields.',
      buttons: ['OK'],
    });
    expect((await mockAlertController.create()).present).toHaveBeenCalled();
  });

  it('should show an alert if passwords do not match', async () => {
    component.newPassword = 'Password123!';
    component.confirmPassword = 'Mismatch!';
    await component.resetPassword();

    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Password Error',
      message: 'Passwords do not match.',
      buttons: ['OK'],
    });
    expect((await mockAlertController.create()).present).toHaveBeenCalled();
  });

  it('should show an alert if password does not meet length requirements', async () => {
    component.newPassword = 'Short1!';
    component.confirmPassword = 'Short1!';
    await component.resetPassword();

    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Password Error',
      message: 'Password must be at least 8 characters long.',
      buttons: ['OK'],
    });
    expect((await mockAlertController.create()).present).toHaveBeenCalled();
  });


  it('should navigate to forgot-password page', () => {
    component.goToForgotPassword();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/forgot-password']);
  });
});
