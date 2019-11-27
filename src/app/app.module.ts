import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatIconRegistry } from '@angular/material';

import { SubtitleEditorModule } from './subtitle-editor/subtitle-editor.module';
import { WildcardRoutingModule } from './wildcard-routing.module';
import { SharedModule } from './shared/shared.module';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    SubtitleEditorModule,
    WildcardRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireFunctionsModule,
  ],
  providers: [AngularFireStorage,
    { provide: FunctionsRegionToken, useValue: 'us-central1' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer){
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
  }
 }
