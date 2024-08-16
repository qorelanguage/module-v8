/* HERE WE WILL IMPORT THE ACTIONS CATALOGUE FROM @qoretechnologies/qorus-actions-catalogue
 * FOR NOW WE NEED TO FAKE IT
 * import { ActionsCatalogue } from '@qoretechnologies/qorus-actions-catalogue';
 */

// This will be replaced by the real implementation
import { Log } from '../decorators/Logger';
import { DebugLevels } from '../utils/Debugger';
import { MockApps } from './mock';

// Types are now ANY because they will come from '@qoretechnologies/qorus-actions-catalogue' when it's ready
export type TApp = Record<string, any>;
export type TAction = Record<string, any>;

export interface IQoreApi {
  registerApp: (app: TApp) => void;
  registerAction: (action: TAction) => void;
}

class ActionsCatalogue {
  @Log('Initializing the Actions Catalogue', DebugLevels.Info)
  registerAppActions(qoreApi: IQoreApi) {
    Object.keys(MockApps).forEach((appName) => {
      const { actions, ...app } = MockApps[appName];

      // Register the app
      qoreApi.registerApp(app);

      actions.forEach((action) => {
        qoreApi.registerAction(action);
      });
    });
  }
}

export const actionsCatalogue = new ActionsCatalogue();
