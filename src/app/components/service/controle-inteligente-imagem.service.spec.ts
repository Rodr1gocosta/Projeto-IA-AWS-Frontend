import { TestBed } from '@angular/core/testing';

import { ControleInteligenteImagemService } from './controle-inteligente-imagem.service';

describe('ControleInteligenteImagemService', () => {
  let service: ControleInteligenteImagemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControleInteligenteImagemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
