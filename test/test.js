// Copyright 2026 Qore Technologies, s.r.o.
// SPDX-License-Identifier: MIT

exports.qtester = {
    /** testapi has two properties:
        - createConnection: function (app: string, opts?: object) : string
            parameters:
            - app: the app name
            - opts: optional connection options - normally this should have a 'token' property at least so calls can
            be made
            return value: the technical name of the connection that must be used in the execAppAction() call
        - execAppAction: function (app: string, action: string, connection: string, req?: object, request_opts?: object) : any
            parameters:
            - app: the app name
            - action: the action name
            - connection: the connection name created by the createConnection() call
            - req: the API args
            - request_opts: the request options
            return value: the return value of the API call
    */
    run: function(testapi, request = {
        body: {
            id: 123,
            name: 'Rex',
            photoUrls: [],
        },
        // The action fixture adds this required dynamic option alongside the Pet body.
        new0: { new1: { a: 'Fixture' } },
    }) {
        const c = testapi.createConnection('js-openapi-test', {
            'opts': {
                'subdomain': 'www',
            },
        });
        // Validation succeeds before the unauthenticated fixture reports authorization_code.
        return testapi.execAppAction('js-openapi-test', 'create-pet', c, request, null, true);
    }
};
