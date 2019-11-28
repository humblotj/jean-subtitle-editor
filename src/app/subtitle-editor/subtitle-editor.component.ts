import { Component, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { DataStorageService } from './services/data-storage.service';
import { ToolsService } from './services/tools.service';
import { TranslateService } from './services/translate.service';

@Component({
  selector: 'app-subtitle-editor',
  templateUrl: './subtitle-editor.component.html',
  styleUrls: ['./subtitle-editor.component.css']
})
export class SubtitleEditorComponent implements OnInit {
  player = null;
  wavesurfer = null;
  url = '';
  videoType = '';
  subtitleList: string[] = [];

  @ViewChild(CdkVirtualScrollViewport, { static: false }) viewPort: CdkVirtualScrollViewport;
  timeStamp: { startMs: number, endMs: number }[] = [];
  script: { text: string }[] = [];
  scriptTranslation: { text: string }[] = [];
  indexActive = null;

  constructor(private http: HttpClient,
    private dataStorageService: DataStorageService,
    private toolsService: ToolsService,
    private translateService: TranslateService) { }

  ngOnInit() {
  }

  videoSelected(file: File) {
    this.videoType = file.type;
    const url = URL.createObjectURL(file);
    if (this.url !== url) {
      this.dispose();
      this.url = url;
    }
  }

  yTLinkPlayed(videoId: string) {
    this.videoType = 'video/mp4';
    this.dataStorageService
      .storeVideo(videoId, videoId)
      .pipe(take(1))
      .subscribe(
        (downloadURL: string) => {
          if (this.url !== downloadURL) {
            this.dispose();
            this.url = downloadURL;
            this.displaySubtitles(videoId);
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  displaySubtitles(videoId) {
    const url = 'https://video.google.com/timedtext';
    let params = new HttpParams();
    params = params.append('type', 'list');
    params = params.append('v', videoId);
    this.http
      .get(url, { responseType: 'text', params })
      .subscribe(result => this.parseXml(result));
  }

  parseXml(xmlStr) {
    const parser = new xml2js.Parser();
    parser.parseString(xmlStr, (err, result) => {
      let list = [];
      if (typeof result.transcript_list.track !== 'undefined') {
        list = result.transcript_list.track.map((item: any) => ({
          name: item.$.name,
          lang_code: item.$.lang_code,
          lang_translated: item.$.lang_translated
        }));
      }
      this.subtitleList = list;
    });
  }

  subtitleSelected(data: any) {
    this.indexActive = null;
    this.timeStamp = data.map((line: any) => ({ startMs: line.startTime, endMs: line.endTime }));
    const script = this.getFullText(data).split('\r\n').map((text: string) => ({ text }));
    for (let i = script.length; i < this.timeStamp.length; i++) {
      script[i] = { text: '' };
    }
    const scriptTranslation = [];
    for (let i = 0; i < this.timeStamp.length; i++) {
      scriptTranslation[i] = { text: '' };
    }
    this.indexActive = 0;
    this.script = script;
    this.scriptTranslation = scriptTranslation;
  }

  translationSelected(data: any) {
    const timeStamp = data.map((line: any) => ({ startMs: line.startTime, endMs: line.endTime }));
    const scriptTranslation = this.getFullText(data).split('\r\n').map((text: string) => ({ text }));
    if (timeStamp.length < this.timeStamp.length) {
      for (let i = timeStamp.length; i < this.timeStamp.length; i++) {
        scriptTranslation[i] = { text: '' };
      }
    } else if (timeStamp.length > this.timeStamp.length) {
      const script = this.script.slice();
      const timeStampTmp = this.timeStamp.slice();
      for (let i = this.timeStamp.length; i < timeStamp.length; i++) {
        timeStampTmp[i] = timeStamp[i];
        script[i] = { text: '' };
      }
      this.timeStamp = timeStampTmp;
      this.script = script;
    }
    this.scriptTranslation = scriptTranslation;
  }

  getFullText(srt: any) {
    return srt.map(line => line.text).join('\r\n');
  }

  translate(lang: { sourceLanguage: string, targetLanguage: string }) {
    if (this.script.length === 0) {
      this.toolsService.openSnackBar('Select Subtitle First', 2000);
    } else {
      let scriptTranslation = [];
      for (let i = 0; i < this.timeStamp.length; i++) {
        scriptTranslation[i] = { text: '' };
      }
      this.scriptTranslation = scriptTranslation;
      const fullText = this.script.map(line => line.text).join('\r\n')
        .replace(/(?<!\r)\n/g, ' ').replace(/\{(.*?)\}|\|/gi, '');
      this.translateService.translate(fullText, lang.sourceLanguage, lang.targetLanguage).subscribe(result => {
        scriptTranslation = result.split('\r\n').map((text: string) => ({ text }));
        for (let i = scriptTranslation.length; i < this.timeStamp.length; i++) {
          scriptTranslation[i] = { text: '' };
        }
        this.scriptTranslation = scriptTranslation;
      },
        err => {
          console.error(err);
        });
    }
  }

  playerInitialized(player: any) {
    this.player = player;
  }

  wavesurferInitialized(wavesurfer: any) {
    this.wavesurfer = wavesurfer;
  }

  seekTo(progress: number) {
    const time = this.player.duration() * progress / 100;
    this.player.currentTime(time);
    this.wavesurfer.seekAndCenter(progress / 100);
  }

  onPlayButton(play: boolean) {
    if (play) {
      this.player.play();
      this.wavesurfer.play();
    } else {
      this.player.pause();
      this.wavesurfer.pause();
    }
  }

  audioVolumeChanged(volume: number) {
    this.wavesurfer.setVolume(volume);
  }

  dispose() {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
      this.wavesurfer = null;
    }
    this.subtitleList = [];
  }

}
