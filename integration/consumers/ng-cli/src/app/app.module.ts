import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CustomModule } from 'sample-custom';
import { UiLibModule } from '@sample/material';

import { AppComponent } from './app.component';
import { CdkModule } from './cdk/cdk.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    // samples
    CustomModule,
    UiLibModule,

    // app
    CdkModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
