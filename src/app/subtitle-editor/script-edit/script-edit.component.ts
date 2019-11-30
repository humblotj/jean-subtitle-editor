import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { SubtitleParserService } from '../services/subtitle-parser.service';

@Component({
  selector: 'app-script-edit',
  templateUrl: './script-edit.component.html',
  styleUrls: ['./script-edit.component.css']
})
export class ScriptEditComponent implements OnInit, OnChanges {
  @Input() time: {startMs: number, endMs: number};
  @Input() startMs: number;
  @Input() endMs: number;
  @Input() sentence: { text: string };
  @Input() translation: { text: string };
  @Input() index: number;
  @Input() indexActive: number;
  @ViewChild('startInput', { static: false }) startInput: ElementRef;
  @ViewChild('endInput', { static: false }) endInput: ElementRef;

  startTime = '';
  endTime = '';
  oldStart: string;
  oldEnd: string;

  constructor(private subtitleParserService: SubtitleParserService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.startMs) {
      this.startTime = this.subtitleParserService.msToTime(this.startMs);
    }
    if (changes.endMs) {
      this.endTime = this.subtitleParserService.msToTime(this.endMs);
    }
  }

  updateStart(event) {
    const msTime = this.subtitleParserService.timeToMs(event.target.value);
    if (event.target.validationMessage !== '' || msTime > this.endMs) {
      this.startInput.nativeElement.value = this.oldStart;
    } else {
      if (this.oldStart !== event.target.value) {
        this.time.startMs = msTime;
      }
    }
  }

  updateEnd(event) {
    const msTime = this.subtitleParserService.timeToMs(event.target.value);
    if (event.target.validationMessage !== '' || msTime < this.startMs) {
      this.endInput.nativeElement.value = this.oldEnd;
    } else {
      if (this.oldEnd !== event.target.value) {
        this.time.endMs = msTime;
      }
    }
  }
}
