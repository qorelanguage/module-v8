import { forEach } from 'lodash';
import { PiecesAppCatalogue } from '../pieces/piecesCatalogue';

describe('PiecesAppCatalogue', () => {
  beforeAll(() => {
    PiecesAppCatalogue.registerApps();
  });

  it('should register apps', () => {
    forEach(PiecesAppCatalogue.apps, (app) => {
      expect(app).toBeDefined();
      expect(app.actions.length).toBeGreaterThan(0);
    });
  });
});
