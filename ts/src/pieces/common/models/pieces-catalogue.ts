import { IAction } from 'core/framework';

export type TMapPieceActionToAppActionOptions = {
  appName: string;
  actionName: string;
  action: IAction<any, any>;
};
