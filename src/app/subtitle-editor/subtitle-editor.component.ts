import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { take } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatMenuTrigger } from '@angular/material';
import * as xml2js from 'xml2js';
import * as FileSaver from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { DataStorageService } from './services/data-storage.service';
import { ToolsService } from './services/tools.service';
import { TranslateService } from './services/translate.service';
import { SubtitleParserService } from './services/subtitle-parser.service';
import { MglishService } from './services/mglish.service';
import { MglishnlService } from './services/mglishnl.service';

@Component({
  selector: 'app-subtitle-editor',
  templateUrl: './subtitle-editor.component.html',
  styleUrls: ['./subtitle-editor.component.css']
})
export class SubtitleEditorComponent implements OnInit {
  projectKey = '';
  projectName = 'Subtitle';
  lastSaveDate: Date = null;

  player = null;
  wavesurfer = null;
  url = '';
  videoType = '';
  videoId = '';
  subtitleList: string[] = [];

  private repeatTimeout = null;
  private regions = [];
  private adjacentTimeTmp: any = {}; // save adjacent timestamp for resizing purpose
  private adjacentTimeUpdated = false;
  private labelSelected = 'original text';

  chunkMode = false;

  @ViewChild(CdkVirtualScrollViewport, { static: false }) viewPort: CdkVirtualScrollViewport;
  timeStamp: { startMs: number, endMs: number }[] = [];
  script: string[] = [];
  scriptTranslation: string[] = [];
  preview: { en: string, ko: string, rpa: string }[];
  indexActive: number = null;
  previousIndexActive: number = null;

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  dataUndoArray: Array<{
    timeStamp: { startMs: number, endMs: number }[], script: string[],
    scriptTranslation: string[], preview: { en: string, ko: string, rpa: string }[];
  }> = [];
  dataRedoArray: Array<{
    timeStamp: { startMs: number, endMs: number }[], script: string[],
    scriptTranslation: string[], preview: { en: string, ko: string, rpa: string }[];
  }> = [];
  undoLimit = 5;
  showUndo = false;
  showRedo = false;

  // @HostListener('keydown', ['$event'])
  // keyEvent(event: KeyboardEvent) {
  //   if (event.key === 'ArrowUp') {
  //     event.preventDefault();
  //     if (this.indexActive !== 0) {
  //       this.setIndexActive(this.indexActive - 1);
  //     }
  //   } else if (event.key === 'ArrowDown') {
  //     event.preventDefault();
  //     if (this.indexActive !== this.timeStamp.length - 1) {
  //       this.setIndexActive(this.indexActive + 1);
  //     }
  //   }
  // }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private dataStorageService: DataStorageService,
    private toolsService: ToolsService,
    private translateService: TranslateService,
    private subtitleParserService: SubtitleParserService,
    private mglishService: MglishService,
    private mglishNLService: MglishnlService) { }

  ngOnInit() {
    const id = this.route.snapshot.queryParams.id;
    if (typeof id !== 'undefined') {
      this.projectKey = id;
      this.onLoad(id);
    }
  }

  videoSelected(file: File) {
    this.videoId = '';
    this.videoType = file.type;
    const url = URL.createObjectURL(file);
    if (this.url !== url) {
      this.dispose();
      this.url = url;
    }
  }

  yTLinkPlayed(videoId: string) {
    this.videoId = videoId;
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
    this.projectKey = '';
    this.previousIndexActive = null;
    this.indexActive = null;
    this.timeStamp = data.map((line: any) => ({ startMs: line.startTime, endMs: line.endTime }));
    const script: string[] = this.getFullText(data).split('\r\n');
    for (let i = script.length; i < this.timeStamp.length; i++) {
      script[i] = '';
    }
    const scriptTranslation: string[] = [];
    for (let i = 0; i < this.timeStamp.length; i++) {
      scriptTranslation[i] = '';
    }
    const dataJSON = this.timeStamp.map((line, index: number) => {
      return {
        id: index,
        start: line.startMs,
        end: line.endMs,
        text: script[index].replace(/\{(.*?)\}/gi, '').trim()
      };
    });
    const dataFile = this.subtitleParserService.build(dataJSON, 'srt');
    this.mglishService.getMglishSubtitles(dataFile).subscribe(
      (result: any) => { this.preview = result; });
    this.indexActive = 0;
    this.script = script;
    this.scriptTranslation = scriptTranslation;
    if (this.wavesurfer) {
      this.loadRegions();
    }
  }

  translationSelected(data: any) {
    const timeStamp = data.map((line: any) => ({ startMs: line.startTime, endMs: line.endTime }));
    const scriptTranslation: string[] = this.getFullText(data).split('\r\n');
    if (timeStamp.length < this.timeStamp.length) {
      for (let i = timeStamp.length; i < this.timeStamp.length; i++) {
        scriptTranslation[i] = '';
      }
    } else if (timeStamp.length > this.timeStamp.length) {
      const script = this.script.slice();
      const timeStampTmp = this.timeStamp.slice();
      for (let i = this.timeStamp.length; i < timeStamp.length; i++) {
        timeStampTmp[i] = timeStamp[i];
        script[i] = '';
      }
      this.timeStamp = timeStampTmp;
      this.script = script;
    }
    this.scriptTranslation = scriptTranslation;
    this.loadRegions();
  }

  getFullText(srt: any) {
    return srt.map(line => line.text).join('\r\n');
  }

  translate(lang: { sourceLanguage: string, targetLanguage: string }) {
    if (this.script.length === 0) {
      this.toolsService.openSnackBar('Select Subtitle First', 2000);
    } else {
      this.do();
      let scriptTranslation: string[] = [];
      for (let i = 0; i < this.timeStamp.length; i++) {
        scriptTranslation[i] = '';
      }
      this.scriptTranslation = scriptTranslation;
      const fullText = this.script.join('\r\n')
        .replace(/(?<!\r)\n/g, ' ').replace(/\{(.*?)\}|\|/gi, '');
      this.translateService.translate(fullText, lang.sourceLanguage, lang.targetLanguage).subscribe(result => {
        scriptTranslation = result.split('\r\n');
        for (let i = scriptTranslation.length; i < this.timeStamp.length; i++) {
          scriptTranslation[i] = '';
        }
        this.scriptTranslation = scriptTranslation;
      },
        err => {
          console.error(err);
        });
    }
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
            text: text[index].trim()
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
            text: text[index].replace(/\{(.*?)\}/gi, '').trim()
          };
        });
        const dataFile = this.subtitleParserService.build(dataJSON, event.extensionExport);
        blob = new Blob([dataFile], { type: '.' + event.extensionExport });
        break;
      }
    }
    const lang = event.script ? 'ko' : 'en';
    FileSaver.saveAs(blob, this.projectName + lang + '.' + event.extensionExport);
  }

  playerInitialized(player: any) {
    this.player = player;
  }

  wavesurferInitialized(wavesurfer: any) {
    this.wavesurfer = wavesurfer;
    this.wavesurfer.on('loading', (e) => {
      if (e === 100) {
        this.timeoutLoadRegions();
      }
    });
    this.wavesurfer.on('region-updated', (e) => {
      this.timeStamp[e.id].startMs = Math.floor(e.start * 100) * 10;
      this.timeStamp[e.id].endMs = Math.floor(e.end * 100) * 10;

      // save adjacent timestamp for resizing purpose
      if (this.adjacentTimeUpdated === false) {
        if (e.id !== this.timeStamp.length - 1) {
          this.adjacentTimeTmp.start = this.timeStamp[e.id + 1].startMs;
        }
        if (e.id !== 0) {
          this.adjacentTimeTmp.end = this.timeStamp[e.id - 1].endMs;
        }
        this.adjacentTimeUpdated = true;
      }
    });

    this.wavesurfer.on('region-update-end', () => {
      this.adjacentTimeUpdated = false;
    });

    this.wavesurfer.on('region-click', (event) => {
      if (event.id !== this.indexActive) {
        this.setIndexActive(event.id);
        this.pause();
      }
    });

    this.wavesurfer.on('region-in', (event) => {
      if (event.id !== this.indexActive && this.repeatTimeout === null) {
        if (this.timeStamp[event.id].startMs - this.timeStamp[this.indexActive].startMs > 300) {
          this.setIndexActive(event.id);
        }
      }
    });
  }

  setIndexActive(index: number) {
    this.previousIndexActive = this.indexActive;
    if (this.wavesurfer) {
      if (this.previousIndexActive !== null && this.previousIndexActive !== index &&
        typeof this.wavesurfer.regions.list[this.previousIndexActive] !== 'undefined') {
        this.wavesurfer.regions.list[this.previousIndexActive].unAll();
        this.wavesurfer.regions.list[this.previousIndexActive].remove();

        this.addRegion(this.previousIndexActive, false,
          this.previousIndexActive % 2 === 0 ? 'rgba(0,0,128,.1)' : 'hsla(100, 100%, 30%, 0.1)');
      }
      if (typeof this.wavesurfer.regions.list[index] !== 'undefined') {
        this.wavesurfer.regions.list[index].remove();
        this.addRegionActive(index);
      }
    }
    this.indexActive = index;
  }

  seekTo(progress: number) {
    if (progress >= 0 && progress <= 100) {
      if (this.player) {
        const time = this.player.duration() * progress / 100;
        this.player.currentTime(time);
      }
      if (this.wavesurfer) {
        this.wavesurfer.seekAndCenter(progress / 100);
      }
    }
  }

  pause() {
    clearTimeout(this.repeatTimeout);
    this.repeatTimeout = null;
    if (this.player) {
      this.player.pause();
    }
    if (this.wavesurfer) {
      this.wavesurfer.pause();
    }
  }

  lineClick(index: number) {
    this.setIndexActive(index);
    this.pause();
    const duration = this.wavesurfer ? this.wavesurfer.getDuration() : this.player ? this.player.getDuration() : null;
    if (duration) {
      this.seekTo((this.timeStamp[index].startMs / 10) / duration);
    }
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

  private timeoutLoadRegions() {
    if (this.wavesurfer.isReady) {
      if (this.timeStamp.length) {
        this.loadRegions();
      }
    } else {
      setTimeout(() => this.timeoutLoadRegions(), 1000);
    }
  }

  loadRegions() {
    this.wavesurfer.clearRegions();
    for (let i = 0; i < this.timeStamp.length; i++) {
      if (i !== this.indexActive) {
        this.addRegion(i, false, i % 2 === 0 ? 'rgba(0,0,128,.1)' : 'hsla(100, 100%, 30%, 0.1)');
      }
    }
    this.addRegionActive(this.indexActive);
  }

  addRegion(id: number, resize: boolean, color: string) {
    const duration = this.wavesurfer.getDuration();
    if (this.timeStamp[id].endMs / 1000 < duration) {
      switch (this.labelSelected) {
        case 'none':
          this.wavesurfer.addRegion({
            id,
            start: this.timeStamp[id].startMs / 1000,
            end: this.timeStamp[id].endMs / 1000,
            drag: false,
            resize,
            color,
            attributes: {
              id: id + 1
            }
          });
          break;
        case 'original text':
          this.wavesurfer.addRegion({
            id,
            start: this.timeStamp[id].startMs / 1000,
            end: this.timeStamp[id].endMs / 1000,
            drag: false,
            resize,
            color,
            attributes: {
              id: (id + 1),
              top: this.script[id].replace(/\{(.*?)\}|\|/gi, ''),
            }
          });
          break;
        case 'translation':
          this.wavesurfer.addRegion({
            id,
            start: this.timeStamp[id].startMs / 1000,
            end: this.timeStamp[id].endMs / 1000,
            drag: false,
            resize,
            color,
            attributes: {
              id: (id + 1),
              top: this.scriptTranslation[id].replace(/\{(.*?)\}|\|/gi, '')
            }
          });
          break;
        case 'both':
          this.wavesurfer.addRegion({
            id,
            start: this.timeStamp[id].startMs / 1000,
            end: this.timeStamp[id].endMs / 1000,
            drag: false,
            resize,
            color,
            attributes: {
              id: (id + 1),
              top: this.script[id].replace(/\{(.*?)\}|\|/gi, ''),
              bottom: this.scriptTranslation[id].replace(/\{(.*?)\}|\|/gi, '')
            }
          });
          break;
      }
      if (typeof this.timeStamp[id - 1] !== 'undefined') {
        if (this.timeStamp[id - 1].startMs === this.timeStamp[id].startMs) {
          this.wavesurfer.regions.list[id].element.className += ' overlapped';
        } else {
          if (this.wavesurfer.regions.list[id].element.classList.contains('overlapped')) {
            this.wavesurfer.regions.list[id].element.classList.remove('overlapped');
          }
        }
      }
    }
  }

  addRegionActive(id: number) {
    this.addRegion(id, true, 'hsla(360, 100%, 50%, 0.3)');
    this.wavesurfer.regions.list[id].element.style.zIndex = 3;

    const that = this;
    this.wavesurfer.regions.list[id].onResize = function (delta, direction) {
      // re-implement existing functionality so interface updates work
      if (direction === 'start') {
        this.update({
          start: Math.min(this.start + delta, this.end),
          end: Math.max(this.start + delta, this.end)
        });
      } else {
        this.update({
          start: Math.min(this.end + delta, this.start),
          end: Math.max(this.end + delta, this.start)
        });
      }
      // resize the region adjacent to this one
      that.resizeAdjacent(this, direction);
    };
    this.regions = [];
    if (id !== 0) {
      this.regions.push(this.wavesurfer.regions.list[id - 1]);
    }
    this.regions.push(this.wavesurfer.regions.list[id]);
    if (id !== this.timeStamp.length - 1) {
      this.regions.push(this.wavesurfer.regions.list[id + 1]);
    }
  }

  private resizeAdjacent(obj, direction) {
    const index = this.regions.indexOf(obj);
    if (direction === 'start' && index > 0) {
      if (this.adjacentTimeTmp.end > obj.start * 1000) {
        this.regions[index - 1].update({
          end: obj.start
        });
      }
    } else if (direction === 'end') {
      if (this.adjacentTimeTmp.start < obj.end * 1000) {
        this.regions[index + 1].update({
          start: obj.end
        });
      }
    }
  }

  onContextMenu(event: MouseEvent, index: number) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { index };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  deleteRow(index: number) {
    this.do();
    if (this.indexActive === this.timeStamp.length - 1) {
      this.setIndexActive(this.indexActive === 0 ? 0 : this.indexActive - 1);
    }
    this.timeStamp.splice(index, 1);
    this.script.splice(index, 1);
    this.scriptTranslation.splice(index, 1);
    this.preview.splice(index, 1);

    this.timeStamp = this.timeStamp.slice();
    // const indexActiveTmp = this.indexActive;
    // this.indexActive = 0;
    // setTimeout(() => this.indexActive = indexActiveTmp, 0);
  }

  insertNext(index: number) {
    this.do();
    const start = this.timeStamp[index].endMs;
    let end = index === this.timeStamp.length - 1 ?
      this.timeStamp[index].endMs : this.timeStamp[index + 1].startMs;

    end = Math.max(+start, +end);

    this.timeStamp.splice(index + 1, 0, { startMs: start, endMs: end });
    this.script.splice(index + 1, 0, '');
    this.scriptTranslation.splice(index + 1, 0, '');
    this.preview.splice(index + 1, 0, { en: '', ko: '', rpa: '' });

    this.timeStamp = this.timeStamp.slice();
  }


  duplicate(index: number) {
    this.do();
    let start = this.timeStamp[index].startMs + (this.timeStamp[index].endMs - this.timeStamp[index].startMs) / 2;
    start = +start.toFixed(2);
    const end = this.timeStamp[index].endMs;

    this.timeStamp.splice(index + 1, 0, { startMs: start, endMs: end });
    this.script.splice(index + 1, 0, this.script[index]);
    this.scriptTranslation.splice(index + 1, 0, this.scriptTranslation[index]);
    this.preview.splice(index + 1, 0, this.preview[index]);

    this.timeStamp = this.timeStamp.slice();
  }

  merge(index: number) {
    this.do();
    if (this.indexActive === this.timeStamp.length - 1) {
      this.setIndexActive(this.indexActive === 0 ? 0 : this.indexActive - 1);
    }
    this.timeStamp[index] = { startMs: this.timeStamp[index].startMs, endMs: this.timeStamp[index + 1].endMs };
    this.timeStamp.splice(index + 1, 1);
    this.script[index] =
      (this.script[index].trim() + ' ' + this.script[index + 1]).trim();
    this.script.splice(index + 1, 1);
    this.scriptTranslation[index] =
      (this.scriptTranslation[index].trim() + ' ' + this.scriptTranslation[index + 1]).trim();
    this.scriptTranslation.splice(index + 1, 1);
    this.preview[index] = {
      en: this.preview[index].en.trim() + ' ' + this.preview[index + 1].en,
      ko: this.preview[index].ko.trim() + ' ' + this.preview[index + 1].ko,
      rpa: this.preview[index].rpa.trim() + ' ' + this.preview[index + 1].rpa
    };
    this.preview.splice(index + 1, 1);

    this.timeStamp = this.timeStamp.slice();
  }

  deleteLeft(index: number) {
    this.do();
    this.script[this.script.length] = '';
    this.script.splice(index, 1);
    this.preview[this.script.length] = { en: '', ko: '', rpa: '' };
    this.preview.splice(index, 1);
  }

  deleteRight(index: number) {
    this.do();
    this.scriptTranslation.splice(index, 1);
    this.scriptTranslation[this.script.length] = '';
  }

  chunkModeChanged(chunkMode: boolean) {
    this.chunkMode = chunkMode;
    if (!chunkMode) {
      const dataJSON = this.timeStamp.map((line, index: number) => {
        return {
          id: index,
          start: line.startMs,
          end: line.endMs,
          text: this.script[index].replace(/\{(.*?)\}/gi, '').trim()
        };
      });
      const dataFile = this.subtitleParserService.build(dataJSON, 'srt');
      this.mglishService.getMglishSubtitles(dataFile).subscribe(
        (result: any) => { this.preview = result; });
    }
  }

  onSave() {
    try {
      this.projectKey = this.dataStorageService.storeData(
        this.projectKey, this.projectName, this.timeStamp, this.script, this.scriptTranslation, this.videoId);
      this.lastSaveDate = new Date();
      this.changeURL();
      this.toolsService.openSnackBar('Project Saved', 2000);

    } catch (error) {
      console.error(error);
      this.toolsService.openSnackBar('Save Failed', 2000);
    }
  }

  changeURL() {
    let urlTree;
    if (this.projectKey !== '' && this.projectKey !== this.route.snapshot.queryParams.id) {
      urlTree = this.router.createUrlTree([], {
        relativeTo: this.route,
        queryParams: {
          id: this.projectKey
        },
        replaceUrl: true,
      }).toString();
      this.location.go(urlTree);
    } else {
      if (this.projectKey === '') {
        urlTree = this.router.createUrlTree([], {
          relativeTo: this.route,
          replaceUrl: true,
        }).toString();
        this.location.go(urlTree);
      }
    }
  }

  onLoad(id: string) {
    this.dataStorageService.getData(id).pipe(take(1)).subscribe((data: any) => {
      if (data === null) {
        this.toolsService.openSnackBar('Wrong Project Key', 2000);
      } else {
        this.indexActive = 0;
        this.projectKey = id;
        this.projectName = data.projectName;
        this.timeStamp = data.timeStamp;
        this.script = data.script;
        this.scriptTranslation = data.scriptTranslation;
        this.yTLinkPlayed(data.videoId);
        const dataJSON = this.timeStamp.map((line, index: number) => {
          return {
            id: index,
            start: line.startMs,
            end: line.endMs,
            text: this.script[index].replace(/\{(.*?)\}/gi, '').trim()
          };
        });
        const dataFile = this.subtitleParserService.build(dataJSON, 'srt');
        this.mglishService.getMglishSubtitles(dataFile).subscribe(
          (result: any) => { this.preview = result; });
      }
    });
  }

  onProjectNameChanged(name: string) {
    this.projectName = name;
  }

  onAutoChunk() {
    this.mglishNLService.chunkTextArray(this.script).subscribe(
      (result: string[]) => {
        this.do();
        const oldLength = this.script.length;
        this.script = result;
        for (let i = this.script.length; i < oldLength; i++) {
          this.script[i] = '';
        }
      },
      error => {
        console.error(error);
      });
  }

  do(): void {
    this.dataRedoArray = [];
    this.showRedo = false;

    if (this.dataUndoArray.length === this.undoLimit) {
      this.dataUndoArray.reverse().pop();
      this.dataUndoArray.reverse();
    }
    this.dataUndoArray.push(
      {
        timeStamp: this.timeStamp.slice(), script: this.script.slice(),
        scriptTranslation: this.scriptTranslation.slice(), preview: this.preview.slice()
      });
    this.showUndo = true;
  }

  undo() {
    this.showRedo = true;
    if (this.dataUndoArray.length !== 0) {
      this.dataRedoArray.push(
        {
          timeStamp: this.timeStamp.slice(), script: this.script.slice(),
          scriptTranslation: this.scriptTranslation.slice(), preview: this.preview.slice()
        });
      const currentData = this.dataUndoArray.pop();
      this.timeStamp = currentData.timeStamp;
      this.script = currentData.script;
      this.scriptTranslation = currentData.scriptTranslation;
      this.preview = currentData.preview;

      if (this.dataUndoArray.length === 0) {
        this.showUndo = false;
      }
      if (this.indexActive > this.timeStamp.length - 1) {
        this.indexActive = this.timeStamp.length - 1;
      }
    }
  }

  redo() {
    if (this.dataRedoArray.length !== 0) {
      this.dataUndoArray.push(
        {
          timeStamp: this.timeStamp.slice(), script: this.script.slice(),
          scriptTranslation: this.scriptTranslation.slice(), preview: this.preview.slice()
        });
      const currentData = this.dataRedoArray.pop();
      this.timeStamp = currentData.timeStamp.slice();
      this.script = currentData.script;
      this.scriptTranslation = currentData.scriptTranslation;
      this.preview = currentData.preview;

      if (this.dataRedoArray.length === 0) {
        this.showRedo = false;
      }
      if (this.indexActive > this.timeStamp.length - 1) {
        this.indexActive = this.timeStamp.length - 1;
      }
    }

    if (this.dataUndoArray.length > 0) {
      this.showUndo = true;
    } else {
      this.showUndo = false;
    }
  }

}
