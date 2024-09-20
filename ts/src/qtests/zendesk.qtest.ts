import { qtester } from './QTester';

describe('Runs tests with Qore API', () => {
  describe('Tests Zendesk Actions', () => {
    it('should be able to create a connection', () => {
      const connection = qtester.api.createConnection('zendesk', {
        subdomain: 'test',
      });

      console.log(connection);

      expect(connection).toBe('THIS TEST SHOULD FAIL');
    });
  });
});
