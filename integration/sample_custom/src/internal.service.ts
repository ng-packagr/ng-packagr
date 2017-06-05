import { Injectable } from '@angular/core';

/** An internal service that is excluded in an NgModule but not exposed in public_api.ts */
@Injectable()
export class InternalService {}
