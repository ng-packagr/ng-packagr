import { InjectionToken, ValueProvider } from 'injection-js';

export const PROJECT_TOKEN: InjectionToken<string> = new InjectionToken<string>(`ng.v5.project`);

export const provideProject = (project: string): ValueProvider => ({
  provide: PROJECT_TOKEN,
  useValue: project,
});
