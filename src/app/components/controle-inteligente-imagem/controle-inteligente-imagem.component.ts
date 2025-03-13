import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ControleInteligenteImagemService } from '../service/controle-inteligente-imagem.service';
import { Item } from '../model/item';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-controle-inteligente-imagem',
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
    MatCardModule
    ],
  templateUrl: './controle-inteligente-imagem.component.html',
  styleUrl: './controle-inteligente-imagem.component.scss',
  providers: [ControleInteligenteImagemService]
})

export class ControleInteligenteImagemComponent {
  displayedColumns: string[] = ['title', 'content', 'createdAt'];
  dataSource: any;

  itens: Item[] = [];
  selectedFile: File | null = null;
  isButtonDisabled: boolean = true;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  fileName: string = '';

  constructor(
    private snackBar: MatSnackBar,
    private itemService: ControleInteligenteImagemService
  ) { }

  ngOnInit() {
    this.findItems();
  }

  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const [file] = input.files;

      this.fileName = file.name;
      this.selectedFile = file;

      setTimeout(() => {
        this.isButtonDisabled = false;
      }, 500);
    } else {
      this.fileName = '';
      this.selectedFile = null;
      this.isButtonDisabled = true;
    }
  }

  getPresignedUrl() {
    if (!this.selectedFile) {
      this.showMessage('Por favor, selecione um arquivo!', true);
      return;
    }

    const fileName = this.selectedFile.name.replace(/\s+/g, "_");
    const contentType = this.selectedFile.type;

    this.itemService.getPresignedUrl(fileName, contentType).subscribe({
      next: (response) => this.uploadFile(response.url, contentType),
      error: () => this.showMessage('Erro ao obter URL pré-assinada!', true),
    });

  }

  uploadFile(presignedUrl: string, contentType: string) {
    this.isUploading = true;
    this.uploadProgress = 0;
  
    const interval = setInterval(() => {
      if (this.uploadProgress < 100) {
        this.uploadProgress += 100 / 15;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    this.itemService.uploadFile(presignedUrl, this.selectedFile!, contentType).subscribe({
      next: () => {
        this.showMessage('Arquivo enviado com sucesso. Aguarde o carregamento na tabela!', false);

        setTimeout(() => {
          this.isUploading = false;
          this.findItems();
        }, 15000);
      },

      error: () => {
        this.showMessage('Erro ao enviar arquivo para o S3!', true);
        clearInterval(interval);
        this.isUploading = false;
      },
    });
  }

  findItems() {
    this.itemService.findItems().subscribe({
      next: (response) => {
        this.itens = response as Item[];
        this.dataSource = new MatTableDataSource<Item>(this.itens);
      },
      error: () => this.showMessage('Erro ao buscar itens!', true),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private showMessage(message: string, isError: boolean) {
    this.snackBar.open(message, 'Fechar', { duration: 3000, panelClass: isError ? 'error-snackbar' : 'success-snackbar' });
  }
}
