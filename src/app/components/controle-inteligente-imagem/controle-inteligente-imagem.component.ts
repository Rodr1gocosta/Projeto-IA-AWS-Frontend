import { Component } from '@angular/core';
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
    MatIconModule
  ],
  templateUrl: './controle-inteligente-imagem.component.html',
  styleUrl: './controle-inteligente-imagem.component.scss',
  providers: [ControleInteligenteImagemService]
})

export class ControleInteligenteImagemComponent {
  displayedColumns: string[] = ['content', 'createdAt', 'title'];
  dataSource: any;

  itens: Item[] = [];

  fileName: string = '';

  selectedFile: File | null = null;
  isButtonDisabled: boolean = true;


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
    this.itemService.uploadFile(presignedUrl, this.selectedFile!, contentType).subscribe({
      next: () => this.showMessage('Arquivo enviado com sucesso!', false),
      error: () => this.showMessage('Erro ao enviar arquivo para o S3!', true),
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

  private showMessage(message: string, isError: boolean) {
    this.snackBar.open(message, 'Fechar', { duration: 3000, panelClass: isError ? 'error-snackbar' : 'success-snackbar' });
  }
}
