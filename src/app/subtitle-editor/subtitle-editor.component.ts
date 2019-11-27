import { Component, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';
import * as FileSaver from 'file-saver';

import { DataStorageService } from './services/data-storage.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SubtitleParserService } from './services/subtitle-parser.service';

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
  script: { sentence: string }[] = [];
  scriptTranslation: { sentence: string }[] = [];

  constructor(private http: HttpClient,
    private dataStorageService: DataStorageService,
    private subtitleParserService: SubtitleParserService) { }

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
    this.timeStamp = data.map((line: any) => ({ startMs: line.startTime, endMs: line.endTime }));
    this.script = this.getFullText(data).split('\r\n').map((sentence: string) => ({ sentence }));
    const scriptTranslation = [];
    for (let i = 0; i < this.timeStamp.length; i++) {
      scriptTranslation[i] = { sentence: '' };
    }
    this.scriptTranslation = scriptTranslation;
  }

  translationSelected(data: any) {
    const timeStamp = data.map((line: any) => ({ startMs: line.startTime, endMs: line.endTime }));
    const scriptTranslation = this.getFullText(data).split('\r\n').map((sentence: string) => ({ sentence }));
    if (timeStamp.length < this.timeStamp.length) {
      for (let i = timeStamp.length; i < this.timeStamp.length; i++) {
        scriptTranslation[i] = { sentence: '' };
      }
    } else if (timeStamp.length > this.timeStamp.length) {
      const script = this.script.slice();
      const timeStampTmp = this.timeStamp.slice();
      for (let i = this.timeStamp.length; i < timeStamp.length; i++) {
        timeStampTmp[i] = timeStamp[i];
        script[i] = { sentence: '' };
      }
      this.timeStamp = timeStampTmp;
      this.script = script;
    }
    this.scriptTranslation = scriptTranslation;
  }

  getFullText(srt: any) {
    return srt.map(line => line.text).join('\r\n');
  }

  export(event: { extensionExport: string, script: boolean }) {
    let blob: Blob;
    const text = event.script ? this.script : this.scriptTranslation;
    switch (event.extensionExport) {
      case 'xlsx':
        break;
      case 'txt':
        blob = new Blob([text.join('\n').replace(/\{(.*?)\}|\|/gi, '')], { type: 'text/plain' });
        break;
      case 'ass':
      case 'mss': {
        const dataJSON = this.timeStamp.map((line, index: number) => {
          return {
            id: index,
            start: line.startMs,
            end: line.endMs,
            text: text[index].sentence.trim()
          };
        });
        const dataFile = this.subtitleParserService.build(dataJSON, event.extensionExport);
        blob = new Blob([dataFile], { type: '.' + event.extensionExport });
        break;
      }
      default: {
        const dataJSON = this.timeStamp.map((line, index: number) => {
          return {
            id: index,
            start: line.startMs,
            end: line.endMs,
            text: text[index].sentence.replace(/\{(.*?)\}/gi, '').trim()
          };
        });
        const dataFile = this.subtitleParserService.build(dataJSON, event.extensionExport);
        blob = new Blob([dataFile], { type: '.' + event.extensionExport });
        break;
      }
    }
    const lang = event.script ? 'ko' : 'en';
    FileSaver.saveAs(blob, 'subtitle' + '_export_' + lang + '.' + event.extensionExport);
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
