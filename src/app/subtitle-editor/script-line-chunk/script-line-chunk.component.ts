import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-script-line-chunk',
  templateUrl: './script-line-chunk.component.html',
  styleUrls: ['./script-line-chunk.component.css']
})
export class ScriptLineChunkComponent implements OnInit, OnChanges {
  @Input() script: string[];
  @Input() sentence: string;
  @Input() index: number;

  chunkTexts = [];
  chunks = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.sentence) {
      this.chunkTexts = [];
      this.chunks = [];
      const regex = RegExp(/[\s|]+/g);
      let match = regex.exec(this.sentence);
      while (match != null) {
        // separators.push({ separator: match[0], begin: match.index, end: regex.lastIndex });
        this.chunks.push(match[0].match(/\|/g) !== null);
        match = regex.exec(this.sentence);
      }
      this.chunkTexts = this.sentence.split(/[\s|]+/g);
    }
  }

  toggleChunk(index: number) {
    this.chunks[index] = !this.chunks[index];
  }

}
