import { exec } from 'child_process';
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
  public api: IQoreTestApi;

  public run(api: IQoreTestApi) {
    // Save the API object
    this.api = api;

    exec('yarn qtest', (error, stdout, stderr) => {
      console.error(error);
      console.log(stdout);
      console.error(stderr);
    });
  }
}

export const qtester = new QTester();
