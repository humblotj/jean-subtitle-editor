import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor(private http: HttpClient) { }

  translate(text: string, sourceLanguage: string, targetLanguage: string) {
    const translations = [];
    const textArray = this.splitText(text);
    for (const textSplit of textArray) {
      translations.push(this.translate1000char(textSplit, sourceLanguage, targetLanguage));
    }
    return forkJoin(translations).pipe(map((results: string[]) => results.join('\n')));
  }

  private translate1000char(textRecognized: string, sourceLanguage: string, targetLanguage: string): any {
    let params = new HttpParams();
    params = params.append('q', textRecognized);
    params = params.append('target', targetLanguage);
    params = params.append('source', sourceLanguage);
    params = params.append('key', environment.googleAPIKey);
    params = params.append('format', 'text');
    const url = 'https://cors-anywhere.herokuapp.com/https://translation.googleapis.com/language/translate/v2';
    return this.http.post(url, '', { params }).pipe(
      (map((result: any) => result.data.translations[0].translatedText)));
  }

  private splitText(str: string) {
    return str.replace(/(.|\n|\r\n){1,1000}(\n|\r\n|$)/g, '$&@').slice(0, str.length - 1).split(/\n+@/);
  }
}

