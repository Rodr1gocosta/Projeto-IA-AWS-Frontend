import { Routes } from '@angular/router';
import { ControleInteligenteImagemComponent } from './components/controle-inteligente-imagem/controle-inteligente-imagem.component';

export const routes: Routes = [
    { path: '', redirectTo: 'controle', pathMatch: 'full' },
    { path: 'controle', component: ControleInteligenteImagemComponent }
];
