import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-lines',
  templateUrl: './remove-lines.component.html',
  styleUrls: ['./remove-lines.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoveLinesComponent implements OnInit {
  begin = 1;
  oldBegin = 1;
  end: number;
  oldEnd: number;

  constructor(private dialogRef: MatDialogRef<RemoveLinesComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { length: number }) { }

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

  removeLines() {
    if (this.begin !== null && this.end !== null) {
      this.dialogRef.close({
        begin: this.begin, end: this.end
      });
    }
  }

}
