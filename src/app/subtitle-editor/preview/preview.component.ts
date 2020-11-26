import { Component, OnInit, HostListener, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit {
  index = 0;
  texts = ['1. Player providing learning subtitles to Youtube videos.',
    '2. Special learning subtitle with chunk, pronunciation and stress.',
    '3. Change the setting according to your level.',
    '4. Test your pronunciation.',
    '5. Press to see your errors.',
    '6. Test your pronunciation and get a perfect score.'];
  srcs = ['assets/img/p1.png', 'assets/img/p2.png', 'assets/img/p3.png',
    'assets/img/p5.png', 'assets/img/p6.png', 'assets/img/p4.png'];

  @HostListener('keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previous();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    }
  }

  constructor() { }

  ngOnInit() {
  }

  next() {
    if (this.index < this.srcs.length - 1) {
      this.index++;
    }
  }

  previous() {
    if (this.index > 0) {
      this.index--;
    }
  }

}
