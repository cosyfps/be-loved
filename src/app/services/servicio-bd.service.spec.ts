import { TestBed } from '@angular/core/testing';
import { DatabaseService } from './servicio-bd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; 

// Mock de SQLite
class MockSQLite {
  // Puedes agregar métodos mockeados aquí si son necesarios
  executeSql(query: string, params: any[]): Promise<any> {
    return Promise.resolve(); // Mock de la respuesta de la base de datos
  }
}

describe('ServicioBDService', () => {
  let service: DatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SQLite, useClass: MockSQLite }, // Usar el mock de SQLite
      ]
    });
    service = TestBed.inject(DatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
