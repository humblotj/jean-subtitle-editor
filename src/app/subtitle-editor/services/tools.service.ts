import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor(private snackBar: MatSnackBar) { }

  copyInput(el: any) {
    const isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);
    if (isiOSDevice) {
      const oldContentEditable = el.contentEditable;
      const oldReadOnly = el.readOnly;
      const range = document.createRange();

      el.contentEditable = true;
      el.readOnly = false;
      range.selectNodeContents(el);

      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(range);

      el.setSelectionRange(0, 999999);

      el.contentEditable = oldContentEditable;
      el.readOnly = oldReadOnly;
    } else {
      el.select();
    }
    document.execCommand('copy');
    el.setSelectionRange(0, 0);
    this.openSnackBar('Copied to clipboard', 2000);
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, '', {duration});
  }
}
