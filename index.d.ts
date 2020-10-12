declare module '@testcafe-community/axe' {
  import { ElementContext, RunOnly, AxeResults, Result, Spec } from 'axe-core';

  interface axeCheckI {
      results: AxeResults;
      error?: any;
  }

  export function runAxe(
      context?: ElementContext,
      options?: {
          runOnly?: RunOnly;
          rules?: Object;
          iframes?: Boolean;
          elementRef?: Boolean;
          selectors?: Boolean;
      }
  ): Promise<axeCheckI>;

  export function configureAxe(spec: Spec): Promise<void>;

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
  ): Promise<axeCheckI>;

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
