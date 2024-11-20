import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { IonicModule } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/servicio-bd.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(async () => {
    // Mock de NativeStorage
    const mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'removeItem']);
    mockNativeStorage.getItem.and.returnValue(Promise.resolve('mockValue'));

    // Mock de SQLite
    const mockSQLite = jasmine.createSpyObj('SQLite', ['create']);

    // Mock de DatabaseService
    const mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['initializeDB', 'executeSQL']);
    mockDatabaseService.executeSQL.and.returnValue(Promise.resolve([]));

    // Mock de ScreenOrientation
    const mockScreenOrientation = {
      PORTRAIT: 'portrait', // Propiedad mock para PORTRAIT
      LANDSCAPE: 'landscape', // Propiedad mock para LANDSCAPE
      currentOrientation: 'portrait-primary', // Mock de la orientación actual
      lock: jasmine.createSpy('lock').and.returnValue(Promise.resolve()),
      unlock: jasmine.createSpy('unlock').and.returnValue(Promise.resolve()),
    };

    await TestBed.configureTestingModule({
      declarations: [ProfilePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NativeStorage, useValue: mockNativeStorage },
        { provide: SQLite, useValue: mockSQLite },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: ScreenOrientation, useValue: mockScreenOrientation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
