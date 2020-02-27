import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubtitleParserService } from '../services/subtitle-parser.service';

@Component({
  selector: 'app-shift-times',
  templateUrl: './shift-times.component.html',
  styleUrls: ['./shift-times.component.css']
})
export class ShiftTimesComponent implements OnInit {
  @ViewChild('timeInput') timeInput: ElementRef;
  timeMs = 0;
  time = '00:00.00';
  oldTimeMs: number;

  forward = '1';
  begin = 1;
  oldBegin = 1;
  end: number;
  oldEnd: number;
  target: 'both' | 'start' | 'end' = 'both';

  constructor(private dialogRef: MatDialogRef<ShiftTimesComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { length: number },
    private subtitleParserService: SubtitleParserService) { }

  ngOnInit() {
    this.oldEnd = this.data.length;
    this.end = this.data.length;
  }

  updateOldBegin(event) {
    if (event.target.value >= 1 && event.target.value < this.end) {
      this.oldBegin = event.target.value;
    }
  }

  updateBegin(event) {
    if (!(event.target.value >= 1 && event.target.value < this.end)) {
      this.begin = this.oldBegin;
    }
  }

  updateOldEnd(event) {
    if (event.target.value > this.begin && event.target.value <= this.data.length) {
      this.oldEnd = event.target.value;
    }
  }

  updateEnd(event) {
    if (!(event.target.value > this.begin && event.target.value <= this.data.length)) {
      this.end = this.oldEnd;
    }
  }

  updateTime(event) {
    const msTime = this.subtitleParserService.timeToMs(event.target.value);
    if (event.target.validationMessage !== '') {
      this.timeInput.nativeElement.value = this.oldTimeMs;
    } else {
      if (this.oldTimeMs !== event.target.value) {
        this.timeMs = msTime;
        this.time = this.subtitleParserService.msToTime(this.timeMs);
      }
    }
  }


  shiftTimes() {
    if (this.begin !== null && this.end !== null) {
      this.dialogRef.close({
        begin: this.begin, end: this.end,
        time: this.time, timeMs: this.timeMs, target: this.target, forward: this.forward
      });
    }
  }

}
