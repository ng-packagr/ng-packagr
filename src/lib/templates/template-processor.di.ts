import { FactoryProvider, InjectionToken } from 'injection-js';
import { TemplateProcessor } from './template-processor';

export const TEMPLATE_PROCESSOR_TOKEN = new InjectionToken<TemplateProcessor>(`ng.v5.templateProcessor`);

export const TEMPLATE_PROCESSOR: FactoryProvider = {
  provide: TEMPLATE_PROCESSOR_TOKEN,
  useFactory: () => TemplateProcessor,
  deps: [],
};
