import { FactoryProvider, InjectionToken } from 'injection-js';
import { StylesheetProcessor } from './stylesheet-processor';

export const STYLESHEET_PROCESSOR_TOKEN = new InjectionToken<StylesheetProcessor>(`ng.v5.stylesheetProcessor`);

export const STYLESHEET_PROCESSOR: FactoryProvider = {
  provide: STYLESHEET_PROCESSOR_TOKEN,
  useFactory: () => StylesheetProcessor,
  deps: [],
};
