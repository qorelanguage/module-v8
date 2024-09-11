# -*- mode: qore; indent-tabs-mode: nil -*-
#! Qore TypeScriptActionInterface module definition

/*  TypeScriptActionApiWithSchemaDataProvider.qc Copyright 2024 Qore Technologies, s.r.o.

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.
*/

#! Main namespace for the TypeScriptActionInterface module
public namespace TypeScriptActionInterface {
#! Generic API data provider for TypeScript actions based on a Swagger schema
class TypeScriptActionApiWithSchemaDataProvider inherits TypeScriptActionApiDataProvider {
    public {
        #! Provider info
        const ProviderInfo = <DataProviderInfo>{
            "type": "TypeScriptActionApiWithSchemaDataProvider",
            "supports_request": True,
        };

        #! Provider summary info
        const ProviderSummaryInfo = cast<hash<DataProviderSummaryInfo>>(ProviderInfo{
            AbstractDataProvider::DataProviderSummaryInfoKeys
        });
    }

    private {
        #! Swagger schema
        SwaggerSchema schema;

        #! Swagger path
        string swagger_path;

        #! API data provider
        SwaggerDataProviderCommon prov;
    }

    constructor(string name, SwaggerSchema schema, string swagger_path, *code api_function)
            : TypeScriptActionApiDataProvider(name, api_function) {
        # set request and response types
        {
            swagger_path =~ s/^\///;
            on_error rethrow $1.err, sprintf("%s (Swagger path: %y)", $1.desc, swagger_path);
            prov = new SwaggerDataProvider(schema).getChildProviderPath(swagger_path);
        }
        request_type = prov.getRequestType();
        response_type = prov.getResponseType();
    }

    #! Makes a request and returns the response
    /** @param req the request to serialize and make according to the request type
        @param request_options the request options; will be processed by validateRequestOptions()

        @return the response to the request
    */
    private auto doRequestImpl(auto req, *hash<auto> request_options) {
        if (!api_function) {
            if (!prov.tryGetRestClient()) {
                prov.setRestClient(conn.get());
            }
            return prov.doRequest(req, request_options);
        }
        return api_function(req, request_options, getCallContextInfo());
    }

    #! Returns data provider static info
    private hash<DataProviderInfo> getStaticInfoImpl() {
        return ProviderInfo;
    }
}
}