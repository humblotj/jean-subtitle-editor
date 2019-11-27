import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient) { }

  storeVideo(videoId: string, name: string) {
    let params = new HttpParams();
    params = params.append('id', videoId);
    params = params.append('name', name);
    const url = 'https://us-central1-phototranslatortest.cloudfunctions.net/youtubedl';
    return this.http.post(url, '', { params });
  }
}
