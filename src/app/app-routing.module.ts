import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubtitleEditorComponent } from './subtitle-editor/subtitle-editor.component';

const routes: Routes = [
  { path: '', component: SubtitleEditorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
