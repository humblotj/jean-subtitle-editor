import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

import { SubtitleParserService } from '../services/subtitle-parser.service';

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

}
