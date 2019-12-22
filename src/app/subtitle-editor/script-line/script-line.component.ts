import { Component, OnInit, Input, SimpleChanges, OnChanges, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

import { SubtitleParserService } from '../services/subtitle-parser.service';

@Component({
  selector: 'app-script-line',
  templateUrl: './script-line.component.html',
  styleUrls: ['./script-line.component.css']
})
export class ScriptLineComponent implements OnInit, OnChanges {
  @Input() time: { startMs: number, endMs: number };
  @Input() startMs: number;
  @Input() endMs: number;
  @Input() script: string[];
  @Input() scriptTranslation: string[];
  @Input() sentence: string;
  @Input() translation: string;
  @Input() index: number;
  @Input() indexActive: number;
  @ViewChild('startInput', { static: false }) startInput: ElementRef;
  @ViewChild('endInput', { static: false }) endInput: ElementRef;
  @Output() lineClick: EventEmitter<number> = new EventEmitter();

  startTime = '';
  endTime = '';
  oldStart: string;
  oldEnd: string;

  chunkTexts = [];
  chunks = [];

  constructor(private subtitleParserService: SubtitleParserService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.startMs || changes.index) {
      this.startTime = this.subtitleParserService.msToTime(this.startMs);
    }
    if (changes.endMs || changes.index) {
      this.endTime = this.subtitleParserService.msToTime(this.endMs);
    }
    if (changes.sentence) {
      this.chunkTexts = [];
      this.chunks = [];
      const regex = RegExp(/[\s|]+/g);
      let match = regex.exec(this.sentence);
      while (match != null) {
        this.chunks.push(match[0].match(/\|/g) !== null);
        match = regex.exec(this.sentence);
      }
      this.chunkTexts = this.sentence.split(/[\s|]+/g);
    }
  }

  toggleChunk(index: number) {
    this.chunks[index] = !this.chunks[index];
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

  onLineClick() {
    if (this.indexActive !== this.index) {
      this.lineClick.next(this.index);
    }
  }
}
