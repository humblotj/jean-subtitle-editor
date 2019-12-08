import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatInputModule,
  MatDividerModule,
  MatToolbarModule,
  MatTabsModule,
  MatExpansionModule,
  MatSidenavModule,
  MatSelectModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatBottomSheetModule,
  MatAutocompleteModule,
  MatMenuModule,
  MatSliderModule,
  MatDialogModule,
  MatIconModule,
  MatListModule,
  MatSlideToggleModule,
  MatRadioModule,
} from '@angular/material';

import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  exports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatInputModule,
    MatDividerModule,
    MatToolbarModule,
    MatTabsModule,
    MatExpansionModule,
    MatSidenavModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatSliderModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    MatRadioModule,
    DragDropModule
  ],
  declarations: []
})
export class MaterialModule { }
