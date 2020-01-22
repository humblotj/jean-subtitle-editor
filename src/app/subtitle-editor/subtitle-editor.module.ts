import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { SubtitleEditorComponent } from './subtitle-editor.component';
import { SubtitleEditorRoutingModule } from './subtitle-editor-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SidenavEmbedVideoComponent } from './sidenav-embed-video/sidenav-embed-video.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AudiovizualizerComponent } from './audiovizualizer/audiovizualizer.component';
import { ScriptLineComponent } from './script-line/script-line.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScriptEditComponent } from './script-edit/script-edit.component';
import { DetailSentenceRendererComponent } from './sidenav-embed-video/detail-sentence-renderer/detail-sentence-renderer.component';
import { MssRendererComponent } from './sidenav-embed-video/mss-renderer/mss-renderer.component';
import { ScriptLineChunkComponent } from './script-line-chunk/script-line-chunk.component';
import { ShiftTimesComponent } from './shift-times/shift-times.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { KeyboardShortcutsComponent } from './keyboard-shortcuts/keyboard-shortcuts.component';
import { RemoveLinesComponent } from './remove-lines/remove-lines.component';
import { PreviewComponent } from './preview/preview.component';

@NgModule({
  declarations: [SubtitleEditorComponent,
    SidenavEmbedVideoComponent,
    ToolbarComponent,
    AudiovizualizerComponent,
    ScriptLineComponent,
    ScriptEditComponent,
    DetailSentenceRendererComponent,
    MssRendererComponent,
    ScriptLineChunkComponent,
    ShiftTimesComponent,
    HowToUseComponent,
    KeyboardShortcutsComponent,
    RemoveLinesComponent,
    PreviewComponent
  ],
  imports: [
    SharedModule,
    HttpClientModule,
    SubtitleEditorRoutingModule,
    ScrollingModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
  ],
  entryComponents: [
    RemoveLinesComponent,
    ShiftTimesComponent,
    HowToUseComponent,
    KeyboardShortcutsComponent,
    PreviewComponent
  ],
})
export class SubtitleEditorModule { }
