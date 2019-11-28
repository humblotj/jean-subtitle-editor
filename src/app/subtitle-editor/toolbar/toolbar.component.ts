import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';

import { ToolsService } from '../services/tools.service';
import { SubtitleParserService } from '../services/subtitle-parser.service';
import { HttpParams, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {
  @Output() videoSelected: EventEmitter<File> = new EventEmitter();
  @Output() yTLinkPlayed: EventEmitter<string> = new EventEmitter();
  @Output() subtitleSelected: EventEmitter<any> = new EventEmitter();
  @Output() translationSelected: EventEmitter<any> = new EventEmitter();
  @Output() translate: EventEmitter<{ sourceLanguage: string, targetLanguage: string }> = new EventEmitter();
  @Output() export: EventEmitter<{ extensionExport: string, script: boolean }> = new EventEmitter();
  @Input() subtitleList: { name: string, lang_code: string, lang_translated: string }[];

  youtubeLink = '';
  private videoId = '';

  languagesSupported = [
    { value: 'ko', viewValue: 'Korean' },
    { value: 'en', viewValue: 'English' },
    { value: 'zh-cn', viewValue: 'Chinese (Simplified)' },
    { value: 'zh-tw', viewValue: 'Chinese (Traditional)' },
    { value: 'ja', viewValue: 'Japanese' },
  ];
  sourceLanguage = 'en';
  targetLanguage = 'ko';
  private oldSourceLanguage = '';
  private oldTargetLanguage = '';

  constructor(private toolsService: ToolsService, private subtitleParserService: SubtitleParserService, private http: HttpClient) { }

  ngOnInit() {
  }

  onOpenVideo(event: any) {
    const file = event.target.files[0];
    if (file != null) {
      const type: string = file.type;
      if (type === 'video/mp4' || type === 'video/webm' || type === 'video/ogg' || type.startsWith('audio/')) {
        this.videoId = '';
        this.videoSelected.emit(file);
      }
    }
  }

  onPlayYTLink() {
    if (this.isYoutubeLink()) {
      if (this.youtubeLink.startsWith('https://www.youtube.com/watch?v=')) {
        const url: any = new URL(this.youtubeLink);
        this.videoId = url.searchParams.get('v');
      } else {
        this.videoId = this.youtubeLink.substring(17);
      }
      this.yTLinkPlayed.emit(this.videoId);
    } else {
      this.toolsService.openSnackBar('This is not a YouTube link.', 2000);
    }
  }

  isYoutubeLink(): boolean {
    return (
      this.youtubeLink.startsWith('https://www.youtube.com/watch?v=') ||
      this.youtubeLink.startsWith('https://youtu.be/')
    );
  }

  copyURL(el: any) {
    this.toolsService.copyInput(el);
  }

  onSubtitleFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file != null) {
      const filename = file.name.split('.').pop().toLowerCase();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const data = fileReader.result;
        this.subtitleSelected.emit(this.subtitleParserService.parse(data, filename));
      };
      fileReader.readAsText(file);
    }
  }

  onSubtitleSelected(subtitle: { name: string, lang_code: string, lang_translated: string }) {
    const url = 'https://video.google.com/timedtext';
    let params = new HttpParams();
    if (subtitle.name !== '') {
      params = params.append('name', subtitle.name);
    }
    params = params.append('lang', subtitle.lang_code);
    params = params.append('v', this.videoId);
    params = params.append('fmt', 'vtt');
    this.http.get(url, { responseType: 'text', params }).subscribe(
      result => {
        this.subtitleSelected.emit(this.subtitleParserService.fromVtt(result));
      },
      error => {
        console.error(error);
      });
  }

  onTranslationFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file != null) {
      const filename = file.name.split('.').pop().toLowerCase();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const data = fileReader.result;
        this.translationSelected.emit(this.subtitleParserService.parse(data, filename));
      };
      fileReader.readAsText(file);
    }
  }

  onTranslationSelected(subtitle: { name: string, lang_code: string, lang_translated: string }) {
    const url = 'https://video.google.com/timedtext';
    let params = new HttpParams();
    if (subtitle.name !== '') {
      params = params.append('name', subtitle.name);
    }
    params = params.append('lang', subtitle.lang_code);
    params = params.append('v', this.videoId);
    params = params.append('fmt', 'vtt');
    this.http.get(url, { responseType: 'text', params }).subscribe(
      result => {
        this.translationSelected.emit(this.subtitleParserService.fromVtt(result));
      },
      error => {
        console.error(error);
      });
  }

  onTranslate() {
    this.translate.next({ sourceLanguage: this.sourceLanguage, targetLanguage: this.targetLanguage });
  }

  setOldTargetLanguage() {
    this.oldTargetLanguage = this.targetLanguage;
  }

  setOldSourceLanguage() {
    this.oldSourceLanguage = this.sourceLanguage;
  }
  onTLSelected(event: any) {
    if (this.sourceLanguage === event.value) {
      this.sourceLanguage = this.oldTargetLanguage;
    }
  }

  onSLSelected(event: any) {
    if (this.targetLanguage === event.value) {
      this.targetLanguage = this.oldSourceLanguage;
    }
  }

  swapLanguages() {
    const tmp = this.sourceLanguage;
    this.sourceLanguage = this.targetLanguage;
    this.targetLanguage = tmp;
  }

  onExportSubtitle(extensionExport: string): void {
    this.export.emit({ extensionExport, script: true });
  }

  onExportTranslation(extensionExport: string): void {
    this.export.emit({ extensionExport, script: false });
  }
}
