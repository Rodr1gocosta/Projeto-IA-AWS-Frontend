import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleInteligenteImagemComponent } from './controle-inteligente-imagem.component';

describe('ControleInteligenteImagemComponent', () => {
  let component: ControleInteligenteImagemComponent;
  let fixture: ComponentFixture<ControleInteligenteImagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControleInteligenteImagemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControleInteligenteImagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
