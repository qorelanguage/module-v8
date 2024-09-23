describe('Runs tests with Qore API', () => {
  describe('Tests Zendesk Actions', () => {
    it('should be able to create a connection', () => {
      const connection = testApi.createConnection('zendesk', {
        subdomain: 'test',
      });

      expect(connection).toBe('THIS TEST SHOULD FAIL');
    });
  });
});
