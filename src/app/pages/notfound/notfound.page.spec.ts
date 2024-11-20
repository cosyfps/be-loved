import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotfoundPage } from './notfound.page';
import { IonicModule } from '@ionic/angular';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

describe('NotfoundPage', () => {
  let component: NotfoundPage;
  let fixture: ComponentFixture<NotfoundPage>;

  beforeEach(async () => {
    // Mock completo de ScreenOrientation
    const mockScreenOrientation = {
      PORTRAIT: 'portrait', // Propiedad mock para PORTRAIT
      LANDSCAPE: 'landscape', // Propiedad mock para LANDSCAPE
      currentOrientation: 'portrait-primary', // Mock de la orientación actual
      lock: jasmine.createSpy('lock').and.returnValue(Promise.resolve()),
      unlock: jasmine.createSpy('unlock').and.returnValue(Promise.resolve()),
    };

    await TestBed.configureTestingModule({
      declarations: [NotfoundPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ScreenOrientation, useValue: mockScreenOrientation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotfoundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
