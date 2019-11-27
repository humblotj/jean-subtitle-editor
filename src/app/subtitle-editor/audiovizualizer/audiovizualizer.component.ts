import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import * as WaveSurfer from 'wavesurfer.js';
import * as RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import * as TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js';

@Component({
  selector: 'app-audiovizualizer',
  templateUrl: './audiovizualizer.component.html',
  styleUrls: ['./audiovizualizer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AudiovizualizerComponent implements OnInit, OnChanges {
  @Input() url: string;
  @Output() wavesurferInitialized: EventEmitter<any> = new EventEmitter();
  @Output() seekTo: EventEmitter<number> = new EventEmitter();

  progressRate = 100;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.url && this.url !== '') {
      this.loadWafeSurfer();
    }
  }

  loadWafeSurfer() {
    const wavesurfer = WaveSurfer.create({
      container: '#waveform',
      height: 158,
      barHeight: 0.6,
      scrollParent: true,
      partialRender: false,
      pixelRatio: 1,
      autoCenter: true,
      interact: true,
      minPxPerSec: 1,
      plugins: [
        RegionsPlugin.create({
        }),
        TimelinePlugin.create({
          container: '#waveform-timeline'
        })
      ]
    });

    wavesurfer.container.children[0].childNodes[0].style.zIndex = 4;
    wavesurfer.container.children[0].childNodes[0].style.borderRight = '1px solid #cc181e';
    wavesurfer.load(this.url);
    wavesurfer.zoom(150);
    wavesurfer.setVolume(0.25);

    wavesurfer.on('loading', e => {
      this.progressRate = e;
      // if (e === 100) {
      //   this.timeoutIsReady();
      // }
    });

    wavesurfer.on('interaction', e => {
      this.seekTo.emit(e * 100);
    });

    this.wavesurferInitialized.emit(wavesurfer);
  }
}
