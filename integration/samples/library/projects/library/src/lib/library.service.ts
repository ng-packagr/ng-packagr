import { Injectable } from '@angular/core';
import defaultConfig from './config.json';

type ConfigJSON = typeof defaultConfig;

@Injectable({
  providedIn: 'root',
})
export class Config implements ConfigJSON {
  base: string = defaultConfig.base;
}

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private API: string;

  constructor(config: Config) {
    this.API = config.base;
  }
}
