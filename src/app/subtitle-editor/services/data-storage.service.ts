import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  itemsRef: AngularFireList<any>;
  idChanged = new Subject<string>();

  constructor(private http: HttpClient, private db: AngularFireDatabase) {
    this.itemsRef = this.db.list('subtitles2');
  }

  storeVideo(videoId: string, name: string) {
    let params = new HttpParams();
    params = params.append('id', videoId);
    params = params.append('name', name);
    const url = 'https://us-central1-phototranslatortest.cloudfunctions.net/youtubedl';
    return this.http.post(url, '', { params });
  }

  storeData(id: string, projectName: string, timeStamp: { startMs: number, endMs: number }[],
    script: string[], scriptTranslation: string[], videoId: string) {
    if (id === '') {
      id = this.db.createPushId();
    }
    const data = { videoId, projectName, timeStamp, script, scriptTranslation };

    this.itemsRef.set(id, data);
    return id;
  }

  getData(id: string) {
    return this.db.object('subtitles2/' + id).valueChanges();
  }
}
