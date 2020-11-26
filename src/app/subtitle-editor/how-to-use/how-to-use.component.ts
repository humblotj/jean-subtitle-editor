import { Component, OnInit, HostListener, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-how-to-use',
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HowToUseComponent implements OnInit {
  index = 0;
  texts = ['1. Enter a Youtube URL and click "Play Video" or open a video from your files.',
    '2. Select a subtitle, if you entered a Youtube URL you can select an available Youtube subtitle.',
    '3. Select a translation or translate with Google Translate.',
    '4. You can right click a dialog to edit it.',
    '5. You can auto chunk then go to the chunk mode to edit chunk marks',
    '6. You can save, load back your project thanks to the key, rename your project or download your project as srt files through the home menu.'];
  srcs = ['assets/img/1.png', 'assets/img/2.png', 'assets/img/3.png', 'assets/img/4.png', 'assets/img/5.png', 'assets/img/6.png'];

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
