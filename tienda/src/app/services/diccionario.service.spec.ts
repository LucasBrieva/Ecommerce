import { TestBed } from '@angular/core/testing';

import { DiccionarioService } from './diccionario.service';

describe('DiccionarioService', () => {
  let service: DiccionarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiccionarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
