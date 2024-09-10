import {
  IQoreApp,
  IQoreAppActionWithFunction,
  IQoreAppWithActions,
  QorusAppsCatalogue,
} from '@qoretechnologies/qorus-actions-catalogue';

// This will be replaced by the real implementation
import { Log } from '../decorators/Logger';
import { DebugLevels } from '../utils/Debugger';

export interface IQoreApi {
  registerApp: (app: IQoreApp) => void;
  registerAction: (action: IQoreAppActionWithFunction) => void;
}

class ActionsCatalogue {
  @Log('Initializing the Actions Catalogue', DebugLevels.Info)
  registerAppActions(api: IQoreApi) {
    // Initialize the Qorus Apps Catalogue, this will load all the apps
    QorusAppsCatalogue.registerApps();

    // Go through all the apps and register them
    Object.keys(QorusAppsCatalogue.apps).forEach((appName) => {
      const { actions, ...app }: IQoreAppWithActions = QorusAppsCatalogue.apps[appName];

      // Register the app
      api.registerApp(app);

      // Register the actions
      actions.forEach((action) => {
        if (action.action === 'create-ticket') {
          const { api_function, ...rest } = action;

          api.registerAction({
            ...rest,
            swagger_path: 'api/v2/tickets/POST',
          });
        } else {
          api.registerAction(action);
        }
      });
    });
  }
}

export const actionsCatalogue = new ActionsCatalogue();
