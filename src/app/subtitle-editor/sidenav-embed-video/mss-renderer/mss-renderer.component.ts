import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import Colors from '../../Colors';

@Component({
  selector: 'app-mss-renderer',
  templateUrl: './mss-renderer.component.html',
  styleUrls: ['./mss-renderer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MssRendererComponent implements OnInit, OnChanges {
  @Input() defaultColor: string;
  @Input() defaultSize: string;
  @Input() onlyBold: boolean;
  @Input() text: string;

  mStyles;
  views;

  constructor() { }

  ngOnInit() {
    this.mStyles = {
      default: {
        color: this.defaultColor || 'black',
        size: this.defaultSize || 24,
        bold: false,
        italic: false,
      },
      t0: {
        color: this.defaultColor || 'black',
        size: this.defaultSize || 24,
        bold: false,
        italic: false,
      },
      t1: {
        color: Colors.accent,
        size: this.defaultSize || 24,
        bold: true,
        italic: false,
      },
      t2: {
        color: this.defaultColor || 'black',
        size: this.defaultSize || 24,
        bold: true,
        italic: false,
      },
      t3: {
        color: this.defaultColor || 'black',
        size: this.defaultSize || 24,
        bold: false,
        italic: true,
      },
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.defaultColor || changes.defaultSize) {
      this.mStyles = {
        default: {
          color: this.defaultColor || 'black',
          size: this.defaultSize || 24,
          bold: false,
          italic: false,
        },
        t0: {
          color: this.defaultColor || 'black',
          size: this.defaultSize || 24,
          bold: false,
          italic: false,
        },
        t1: {
          color: Colors.accent,
          size: this.defaultSize || 24,
          bold: true,
          italic: false,
        },
        t2: {
          color: this.defaultColor || 'black',
          size: this.defaultSize || 24,
          bold: true,
          italic: false,
        },
        t3: {
          color: this.defaultColor || 'black',
          size: this.defaultSize || 24,
          bold: false,
          italic: true,
        },
      };
    }
    if (changes.text) {
      this.views = this.parse(this.text);
    }
  }

  private parse = text => {
    if (text == null) {
      return [
        {
          text: ' ',
          style: this.mStyles.default,
        },
      ];
    }
    text = text.replace(/ʘ/gi, '');
    const regex = /\{(.*?)\}/gi;
    let m = regex.exec(text);
    let idx = 0;
    let curStyle = this.mStyles.default;
    const result = [];
    while (m != null) {
      if (m.index !== idx) {
        const piece = text.substr(idx, m.index - idx);
        result.push({
          text: piece,
          style: curStyle,
        });
      }
      if (m[0].indexOf('t0') !== -1) {
        curStyle = this.mStyles.t0;
      } else if (m[0].indexOf('t1') !== -1) {
        curStyle = this.mStyles.t1;
      } else if (m[0].indexOf('t2') !== -1) {
        curStyle = this.mStyles.t2;
      } else if (m[0].indexOf('t3') !== -1) {
        curStyle = this.mStyles.t3;
      } else if (m[0].indexOf('\\r') !== -1) {
        curStyle = this.mStyles.default;
      }
      idx = m.index + m[0].length;
      m = regex.exec(text);
    }
    if (text.length !== idx) {
      const piece = text.substr(idx, text.length - idx);
      result.push({
        text: piece,
        style: curStyle,
      });
    }
    return result;
  }

}
