import { Injectable } from '@angular/core';
import { Item } from '../model/item';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ControleInteligenteImagemService {

  constructor(private http: HttpClient) { }

  findItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${environment.baseUrl}/Prod/list-items`);
  }

  getPresignedUrl(fileName: string, contentType: string): Observable<{ url: string }> {
    const params = new HttpParams()
      .set('fileName', fileName)
      .set('contentType', contentType);
  
    return this.http.get<{ url: string }>(`${environment.baseUrl}/Prod/presigned-url`, { params });
  }

  uploadFile(presignedUrl: string, file: File, contentType: string) {
    const headers = new HttpHeaders({
      'Content-Type': contentType,
    });

    return this.http.put(presignedUrl, file, { headers });
  }
}
