import { Component, OnInit, Input, SimpleChanges, OnChanges, ElementRef, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';

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
  @ViewChild('scriptInput', { static: false }) scriptInput: ElementRef;
  @ViewChild('scriptTranslationInput', { static: false }) scriptTranslationInput: ElementRef;

  @Output() lineClick: EventEmitter<number> = new EventEmitter();

  startTime = '';
  endTime = '';
  oldStart: string;
  oldEnd: string;

  chunkTexts = [];
  chunks = [];

  scriptInputFocused: boolean;

  @HostListener('keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.scriptInputFocused === false) {
        this.scriptInput.nativeElement.focus();
        this.scriptInputFocused = true;
      } else {
        if (this.indexActive !== 0) {
          this.lineClick.next(this.indexActive - 1);
        }
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.scriptInputFocused) {
        this.scriptTranslationInput.nativeElement.focus();
        this.scriptInputFocused = false;
      } else {
        if (this.indexActive !== this.script.length - 1) {
          this.lineClick.next(this.indexActive + 1);
        }
      }
    }
  }

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
    if (changes.indexActive && !changes.indexActive.firstChange) {
      if (this.index === this.indexActive && this.index !== null) {
        setTimeout(() => this.scriptInput.nativeElement.focus(), 0);
        this.scriptInputFocused = true;
      }
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
