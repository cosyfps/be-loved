import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminhomePage } from './adminhome.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AdminhomePage', () => {
  let component: AdminhomePage;
  let fixture: ComponentFixture<AdminhomePage>;

  beforeEach(async () => {
    // Mock de NativeStorage
    const mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'removeItem']);
    
    // Mock de ScreenOrientation
    const mockScreenOrientation = jasmine.createSpyObj('ScreenOrientation', ['lock', 'unlock']);

    // Mock de ActivatedRoute
    const mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => {
          if (key === 'id') return 'mockId'; // Ajusta según los parámetros que necesites
          return null;
        }
      })
    };

    await TestBed.configureTestingModule({
      declarations: [AdminhomePage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: NativeStorage, useValue: mockNativeStorage },
        { provide: ScreenOrientation, useValue: mockScreenOrientation },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminhomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
