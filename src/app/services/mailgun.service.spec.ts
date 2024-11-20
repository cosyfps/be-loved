import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Importa el módulo de pruebas
import { MailgunService } from './mailgun.service';

describe('MailgunService', () => {
  let service: MailgunService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Agrega HttpClientTestingModule aquí
    });
    service = TestBed.inject(MailgunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
