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
      if (typeof changes.sentence.previousValue !== 'undefined' && typeof changes.sentence.currentValue !== 'undefined') {
        if (changes.sentence.previousValue.replace(/[\s|]+/g, ' ') === changes.sentence.currentValue.replace(/[\s|]+/g, ' ')) {
          return;
        }
      }
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
    const regex = this.getRegex(index);
    const match = this.script[this.index].match(regex);
    if (this.chunks[index]) {
      this.script[this.index] = this.script[this.index].substring(0, match[0].length - match[1].length)
        + ' | ' + this.script[this.index].substring(match[0].length);
      console.log(this.script[this.index]);
    } else {
      this.script[this.index] = this.script[this.index].substring(0, match[0].length - match[1].length)
        + ' ' + this.script[this.index].substring(match[0].length);
      console.log(this.script[this.index]);
    }
  }

  getRegex(index: number) {
    switch (index) {
      case 0:
        return RegExp(/(?:[^ \|]*([\s|]+)){1}/);
      case 1:
        return RegExp(/(?:[^ \|]*([\s|]+)){2}/);
      case 2:
        return RegExp(/(?:[^ \|]*([\s|]+)){3}/);
      case 3:
        return RegExp(/(?:[^ \|]*([\s|]+)){4}/);
      case 4:
        return RegExp(/(?:[^ \|]*([\s|]+)){5}/);
      case 5:
        return RegExp(/(?:[^ \|]*([\s|]+)){6}/);
      case 6:
        return RegExp(/(?:[^ \|]*([\s|]+)){7}/);
      case 7:
        return RegExp(/(?:[^ \|]*([\s|]+)){8}/);
      case 8:
        return RegExp(/(?:[^ \|]*([\s|]+)){9}/);
      case 9:
        return RegExp(/(?:[^ \|]*([\s|]+)){10}/);
      case 10:
        return RegExp(/(?:[^ \|]*([\s|]+)){11}/);
      case 11:
        return RegExp(/(?:[^ \|]*([\s|]+)){12}/);
      case 12:
        return RegExp(/(?:[^ \|]*([\s|]+)){13}/);
      case 13:
        return RegExp(/(?:[^ \|]*([\s|]+)){14}/);
      case 14:
        return RegExp(/(?:[^ \|]*([\s|]+)){15}/);
      case 15:
        return RegExp(/(?:[^ \|]*([\s|]+)){16}/);
      case 16:
        return RegExp(/(?:[^ \|]*([\s|]+)){17}/);
      case 17:
        return RegExp(/(?:[^ \|]*([\s|]+)){18}/);
      case 18:
        return RegExp(/(?:[^ \|]*([\s|]+)){19}/);
      case 19:
        return RegExp(/(?:[^ \|]*([\s|]+)){20}/);
      case 20:
        return RegExp(/(?:[^ \|]*([\s|]+)){21}/);
      default:
        return;
    }
  }

}
