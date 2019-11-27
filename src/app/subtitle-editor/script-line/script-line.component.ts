import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-script-line',
  templateUrl: './script-line.component.html',
  styleUrls: ['./script-line.component.css']
})
export class ScriptLineComponent implements OnInit, OnChanges {
  @Input() startMs: number;
  @Input() endMs: number;
  @Input() sentence: string;
  @Input() translation: string;
  @Input() index: number;
  @Input() indexActive: number;

  startTime = '';
  endTime = '';

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.startMs) {
      this.startTime = this.msToTime(this.startMs);
    }
    if (changes.endMs) {
      this.endTime = this.msToTime(this.endMs);
    }
  }

  msToTime(duration: number) {
    let milliseconds = Math.floor((duration % 1000) / 10) + '';
    let seconds = Math.floor((duration / 1000) % 60) + '';
    let minutes = Math.floor((duration / (1000 * 60)) % 60) + '';

    minutes = (+minutes < 10) ? '0' + minutes : minutes;
    seconds = (+seconds < 10) ? '0' + seconds : seconds;
    milliseconds = (+milliseconds < 10) ? '0' + milliseconds : milliseconds;

    return minutes + ':' + seconds + '.' + milliseconds;
  }


}
