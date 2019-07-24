import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

// XX. what happens if I import one from '@angular/cdk/foo' and then again from '@angular/cdk'???
@NgModule({
  imports: [OverlayModule, PortalModule],
})
export class SomeModule {}
