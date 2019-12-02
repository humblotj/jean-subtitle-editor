import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MglishService {
  private apiServer = 'https://service.mglish.com:3443/converter/';

  constructor(private http: HttpClient) { }

  upload(file: File | Blob, chunked, liaison) {
    const data = new FormData();
    chunked = chunked === true ? 'true' : false;
    liaison = liaison === true ? 'true' : false;

    data.append('uploadFile', file);
    data.append('without_nlp', 'true');
    // data.append('chunked', chunked);
    data.append('liaison', liaison);
    data.append('mss', 'true');

    return this.http.post(this.apiServer + 'subtitle', data);
  }
}
