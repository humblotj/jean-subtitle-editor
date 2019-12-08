import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

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

@NgModule({
  declarations: [SubtitleEditorComponent,
    SidenavEmbedVideoComponent,
    ToolbarComponent,
    AudiovizualizerComponent,
    ScriptLineComponent,
    ScriptEditComponent,
    DetailSentenceRendererComponent,
    MssRendererComponent
  ],
  imports: [
    SharedModule,
    HttpClientModule,
    SubtitleEditorRoutingModule,
    ScrollingModule,
  ]
})
export class SubtitleEditorModule { }
