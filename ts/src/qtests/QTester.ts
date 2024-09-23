import { runCLI } from 'jest';
import * as path from 'path';
import { IQoreConnectionOptionsValues } from '../apps/zendesk';

export interface IQoreTestApi {
  createConnection: (app: string, opts?: IQoreConnectionOptionsValues) => string;
  execAppAction: (
    app: string,
    action: string,
    connection: string,
    data?: Record<string, any>,
    opts?: Record<string, any>
  ) => any;
}

export type IQoreTestFunction = (
  it: (name: string, fn: () => void) => void,
  api: IQoreTestApi
) => void;

export class QTester {
  public async run(api: IQoreTestApi) {
    // Assign the api to the global object so it can be accessed in the Jest tests as `testApi`
    (globalThis as any).testApi = api;
    // Run the Jest tests
    await runJest();
  }
}

async function runJest() {
  const { results } = await runCLI(
    {
      testMatch: ['**/?(*.)+(qtest).[tj]s?(x)'],
      config: path.join(process.cwd(), '/jest.config.js'),
      verbose: true,
      runInBand: true,
      _: [],
      $0: '',
    },
    [process.cwd()]
  );

  if (results.success) {
    console.log('Tests passed!');
  } else {
    console.error('Tests failed!');
    process.exit(1);
  }
}

export const qtester = new QTester();
