import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import Colors from '../../Colors';

@Component({
  selector: 'app-detail-sentence-renderer',
  templateUrl: './detail-sentence-renderer.component.html',
  styleUrls: ['./detail-sentence-renderer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailSentenceRendererComponent implements OnInit, OnChanges {
  @Input() topText: string;
  @Input() bottomText: string;
  tops: string[];
  bottoms: string[];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.topText && this.topText) {
      this.tops = this.topText.replace(/( +)/gi, '$1').split(/[ \n\r↵]/gi);
    }
    if (changes.bottomText && this.bottomText) {
      this.bottoms = this.bottomText.replace(/( +)/gi, '$1').split(/[ \n\r↵]/gi);
    }

  }

  get secondaryText() {
    return Colors.secondaryText;
  }

}
