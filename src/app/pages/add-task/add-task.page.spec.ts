import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTaskPage } from './add-task.page';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('AddTaskPage', () => {
  let component: AddTaskPage;
  let fixture: ComponentFixture<AddTaskPage>;
  let mockRouter: any;
  let mockLocation: any;
  let mockDatabaseService: any;
  let mockNativeStorage: any;
  let mockScreenOrientation: any;
  let mockAlertController: any;

  beforeEach(async () => {
    // Mock de Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    // Mock de Location
    mockLocation = jasmine.createSpyObj('Location', ['back']);
    // Mock de DatabaseService
    mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['getCategories', 'insertTask', 'searchUserById']);
    mockDatabaseService.getCategories.and.returnValue(Promise.resolve([{ id: 1, name: 'Work' }]));
    mockDatabaseService.insertTask.and.returnValue(Promise.resolve());
    // Mock de NativeStorage
    mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem']);
    mockNativeStorage.getItem.and.returnValue(Promise.resolve('mock_token'));
    // Mock de ScreenOrientation
    mockScreenOrientation = jasmine.createSpyObj('ScreenOrientation', ['lock']);
    mockScreenOrientation.lock.and.returnValue(Promise.resolve());
    // Mock de AlertController
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);
    mockAlertController.create.and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') }));

    await TestBed.configureTestingModule({
      declarations: [AddTaskPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: NativeStorage, useValue: mockNativeStorage },
        { provide: ScreenOrientation, useValue: mockScreenOrientation },
        { provide: AlertController, useValue: mockAlertController },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an alert if required fields are empty', async () => {
    component.title = '';
    component.description = '';
    component.category_id = undefined;
    await component.addTask();

    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'All fields are required. Please fill in all fields before adding a task.',
      buttons: ['OK'],
    });
    expect((await mockAlertController.create()).present).toHaveBeenCalled();
  });


});
