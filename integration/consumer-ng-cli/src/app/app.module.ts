import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { FooComponent, BarComponent } from '@foo/bar';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    FooComponent,
    BarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
