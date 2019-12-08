import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, Renderer2, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { MglishService } from '../services/mglish.service';
import { SubtitleParserService } from '../services/subtitle-parser.service';
import { take } from 'rxjs/operators';
declare let videojs: any;

@Component({
  selector: 'app-sidenav-embed-video',
  templateUrl: './sidenav-embed-video.component.html',
  styleUrls: ['./sidenav-embed-video.component.css']
})
export class SidenavEmbedVideoComponent implements OnInit, OnChanges {
  @Input() url: string;
  @Input() videoType: string;
  @Input() script: string[];
  @Input() scriptTranslation: string[];
  @Input() indexActive: number;
  @Output() playerInitialized: EventEmitter<any> = new EventEmitter();
  @Output() seekTo: EventEmitter<number> = new EventEmitter();
  @Output() played: EventEmitter<boolean> = new EventEmitter();
  @Output() audioVolumeChanged: EventEmitter<number> = new EventEmitter();

  @ViewChild('videoPlayerContainer', { static: false }) videoPlayerContainer: ElementRef;
  playerReady = false;
  duration = '';
  private durationSeconds = 0;
  currentTime = '00:00';
  progress = 0;
  paused = true;
  audioVolume = 0.25;
  audioVolumeTmp = 0.25;

  topText = '';
  bottomText = '';

  constructor(private renderer: Renderer2, private mglishService: MglishService, private subtitleParserService: SubtitleParserService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.url && this.url !== '') {
      this.initPlayer();
    }
    if (changes.indexActive && this.indexActive !== null) {
      this.mglishHandle().subscribe((result: any) => { this.topText = result.en; this.bottomText = result.ko; });
    }
  }

  initPlayer() {
    this.playerReady = false;

    const videoPlayerRef = this.renderer.createElement('video');
    videoPlayerRef.classList.add('video-js');
    videoPlayerRef.classList.add('vjs-big-play-centered');
    videoPlayerRef.classList.add('mini-play');
    videoPlayerRef.setAttribute('data-setup', '{"fluid": true}');
    this.renderer.appendChild(
      this.videoPlayerContainer.nativeElement,
      videoPlayerRef
    );

    const options = {
      sources: [
        {
          src: this.url,
          type: this.videoType
        }
      ],
      controls: false,
      muted: true,
      preload: 'auto',
      techOrder: ['html5'],
      inactivityTimeout: 1
    };
    const that = this;
    const player = videojs(
      videoPlayerRef,
      options,
      function onPlayerReady() {
        that.playerReady = true;
        this.on('loadedmetadata', () => {
          const date = new Date(null);
          that.durationSeconds = player.duration();
          date.setSeconds(player.duration());
          that.duration = date.toISOString().substr(14, 5);
        });
        this.on('timeupdate', () => {
          const date = new Date(null);
          const currentTime = this.currentTime();
          date.setSeconds(currentTime);
          that.currentTime = date.toISOString().substr(14, 5);
          that.progress = currentTime / that.durationSeconds * 100;
        });
        this.on('pause', () => {
          that.paused = true;
        });
        this.on('play', () => {
          that.paused = false;
        });
      }
    );

    this.playerInitialized.emit(player);
  }

  progressChanged(event: any) {
    this.seekTo.emit(event.value);
  }

  pause() {
    this.played.emit(false);
  }

  play() {
    this.played.emit(true);
  }

  muteAudio() {
    this.audioVolumeTmp = this.audioVolume;
    this.audioVolume = 0;
    this.audioVolumeChanged.emit(this.audioVolume);
  }

  unmuteAudio() {
    this.audioVolume = this.audioVolumeTmp;
    this.audioVolumeChanged.emit(this.audioVolume);
  }

  onVolumeChange(event) {
    this.audioVolumeChanged.emit(event.value);
  }

  mglishHandle() {
    const subtitleBuild = this.subtitleParserService.build([{
      id: this.indexActive,
      start: 0,
      end: 0,
      text: this.script[this.indexActive],
    }], 'srt');

    const blob = new Blob([subtitleBuild], { type: '.srt' });
    return new Observable((subscriber) => {
      this.mglishService.upload(blob, false, false).pipe(take(1)).subscribe(
        (result: any) => {
          const en = this.subtitleParserService.parse(result.en, 'mss');
          const ko = this.subtitleParserService.parse(result.ko, 'mss');
          const ko_dict = this.subtitleParserService.parse(result.ko_dict, 'mss');
          const rpa = this.subtitleParserService.parse(result.roman, 'mss');
          const chunked = this.subtitleParserService.parse(result.chunked, 'mss');
          if (en.length === 1) {
            const data = { en: en[0].text, ko: ko[0].text, rpa: ko[0].text };
            subscriber.next(data);
            subscriber.complete();
          }
          subscriber.error('length different');
        });
    });
  }

}
