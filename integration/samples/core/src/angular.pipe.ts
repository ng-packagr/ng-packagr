import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ngPipe'
})
export class AngularPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }
}
