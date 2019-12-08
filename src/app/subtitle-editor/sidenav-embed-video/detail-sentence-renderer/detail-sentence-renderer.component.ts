import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import Colors from '../../Colors';

@Component({
  selector: 'app-detail-sentence-renderer',
  templateUrl: './detail-sentence-renderer.component.html',
  styleUrls: ['./detail-sentence-renderer.component.css']
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
    if (changes.topText) {
      this.tops = this.topText.replace(/( +)/gi, '$1').split(/[ \n\r↵]/gi);
    }
    if (changes.bottomText) {
      this.bottoms = this.bottomText.replace(/( +)/gi, '$1').split(/[ \n\r↵]/gi);
    }

  }

  get secondaryText() {
    return Colors.secondaryText;
  }

}
