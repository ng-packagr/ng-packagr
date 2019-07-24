import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomModule } from 'sample-custom';
import { UiLibModule } from '@sample/material';

import { AppComponent } from './app.component';
import { CdkModule } from './cdk/cdk.module';
import { SecondaryModule } from './secondary/secondary.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,

    // samples
    CustomModule,
    UiLibModule,

    // app
    CdkModule,
    SecondaryModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
