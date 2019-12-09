import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { SubtitleParserService } from './subtitle-parser.service';

@Injectable({
  providedIn: 'root'
})
export class MglishService {
  private apiServer = 'https://service.mglish.com:3443/converter/';

  constructor(private http: HttpClient, private subtitleParserService: SubtitleParserService) { }

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

  getMglishSubtitles(subtitleBuild: any) {
    const blob = new Blob([subtitleBuild], { type: '.srt' });
    return new Observable((subscriber) => {
      this.upload(blob, false, false).pipe(take(1)).subscribe(
        (result: any) => {
          const en = this.subtitleParserService.parse(result.en, 'mss');
          const ko = this.subtitleParserService.parse(result.ko, 'mss');
          const ko_dict = this.subtitleParserService.parse(result.ko_dict, 'mss');
          const rpa = this.subtitleParserService.parse(result.roman, 'mss');
          const chunked = this.subtitleParserService.parse(result.chunked, 'mss');
          const data = en.map((item, index) => ({ en: item.text, ko: ko[index].text, rpa: rpa[index].text }));
          subscriber.next(data);
          subscriber.complete();
        });
    });
  }
}
