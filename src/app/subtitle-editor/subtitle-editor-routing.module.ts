import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubtitleEditorComponent } from './subtitle-editor.component';


const routes: Routes = [
    { path: 'subtitle-editor', component: SubtitleEditorComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class SubtitleEditorRoutingModule { }
