import { runCLI } from 'jest';
import { IQoreConnectionOptionsValues } from '../apps/zendesk';
import * as path from 'path';

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
    (globalThis as any).api = api;
    console.log(process.cwd(), path.join(process.cwd(), '/jest.config.js'));
    await runJest();
    console.log('After run Jest');
  }
}

async function runJest() {
  console.log('Run cli');
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
  console.log('Run cli results', results);
  if (results.success) {
    console.log('Tests passed!');
  } else {
    console.error('Tests failed!');
    process.exit(1);
  }
}

export const qtester = new QTester();
