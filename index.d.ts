declare module '@testcafe-community/axe' {
  import { ElementContext, RunOnly, AxeResults, Result } from 'axe-core';

  export function axeCheck(
    t: TestController,
    context?: ElementContext,
    options?: {
      runOnly?: RunOnly;
      rules?: Object;
      iframes?: Boolean;
      elementRef?: Boolean;
      selectors?: Boolean;
    }
  ): Promise<AxeResults>;

  export function createReport(violations: Result[]): string;

  export function checkForViolations(
    t: TestController,
    context?: ElementContext,
    options?: {
      runOnly?: RunOnly;
      rules?: Object;
      iframes?: Boolean;
      elementRef?: Boolean;
      selectors?: Boolean;
    }
  ): never;
}
