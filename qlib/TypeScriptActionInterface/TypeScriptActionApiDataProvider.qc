# -*- mode: qore; indent-tabs-mode: nil -*-
#! Qore TypeScriptActionInterface module definition

/*  TypeScriptActionApiDataProvider.qc Copyright 2024 Qore Technologies, s.r.o.

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
#! Data provider reference data context info
public hashdecl RefDataContextInfo {
    #! Connection name
    *string conn_name;

    #! Connection option info
    *hash<auto> conn_opts;

    #! Action options with known values
    *hash<auto> opts;

    #! User-defined information
    *hash<auto> info;
}

#! Generic API data provider for TypeScript actions
class TypeScriptActionApiDataProvider inherits AbstractDataProvider {
    public {
        #! Provider info
        const ProviderInfo = <DataProviderInfo>{
            "type": "TypeScriptActionApiDataProvider",
            "supports_request": True,
        };

        #! Provider summary info
        const ProviderSummaryInfo = cast<hash<DataProviderSummaryInfo>>(ProviderInfo{
            AbstractDataProvider::DataProviderSummaryInfoKeys
        });
    }

    private {
        string name;
        hash<AsyncCallInfo> api;
        *AbstractDataProviderType request_type;
        *AbstractDataProviderType response_type;
        *hash<string, hash<AsyncCallInfo>> omap;

        #! connection for the action
        AbstractConnection conn;
    }

    constructor(string name, hash<AsyncCallInfo> api, *AbstractDataProviderType request_type,
            *AbstractDataProviderType response_type, *hash<string, hash<AsyncCallInfo>> omap) {
        self.name = name;
        self.api = api;
        self.request_type = request_type;
        self.response_type = response_type;
        self.omap = omap;
    }

    private constructor(string name, *hash<AsyncCallInfo> api) {
        self.name = name;
        if (api) {
            self.api = api;
        }
    }

    #! Sets the connection
    setConnection(AbstractConnection conn) {
        self.conn = conn;
    }

    #! Returns the logger interface for logging
    *LoggerInterface getLogger() {
        return logger;
    }

    #! Returns the data provider name
    string getName() {
        return name;
    }

    #! Returns information on supported reference data
    /** @return a hash of supported reference data; keys in the hash returned are supported in calls to
        @ref getReferenceData()
    */
    *hash<string, bool> getSupportedReferenceData() {
        return map {$1: True}, keys omap;
    }

    #! Makes a request and returns the response
    /** @param req the request to serialize and make according to the request type
        @param request_options the request options; will be processed by validateRequestOptions()

        @return the response to the request
    */
    private auto doRequestImpl(auto req, *hash<auto> request_options) {
        return getAsyncValue(api, req, request_options, getCallContextInfo());
    }

    #! Returns reference data of the given kind if available
    /** @param type the unique type name of the reference data
        @param action_opts an optional hash of action options when called when working with an app action

        @return a list of allowed values for this data

        @since DataProvider 3.0
    */
    private *list<hash<AllowedValueInfo>> getReferenceDataImpl(string type, *hash<auto> action_opts) {
        if (*hash<AsyncCallInfo> ref_api = omap{type}) {
            info("Retrieving reference data for data provider %y type %y", getName(), type);
            *softlist<auto> l = getAsyncValue(ref_api, getCallContextInfo(action_opts));
            if (!l) {
                return;
            }
            if (l[0].typeCode() != NT_HASH) {
                return map <AllowedValueInfo>{
                    "display_name": $1.toString(),
                    "short_desc": $1.toString(),
                    "desc": $1.toString(),
                    "value": $1,
                }, l;
            }
            return map cast<hash<AllowedValueInfo>>($1 instanceof JavaScriptObject ? $1.toData() : $1), l;
        }
    }

    #! Returns the description of a successful request message, if any
    /** @return the request type for this provider
    */
    private *DataProvider::AbstractDataProviderType getRequestTypeImpl() {
        return request_type;
    }

    #! Returns the description of a response message, if this object represents a response message
    /** @return the response type for this response message
    */
    private *DataProvider::AbstractDataProviderType getResponseTypeImpl() {
        return response_type;
    }

    #! Returns data provider static info
    private hash<DataProviderInfo> getStaticInfoImpl() {
        return ProviderInfo;
    }

    #! Returns call context info
    private *hash<RefDataContextInfo> getCallContextInfo(*hash<auto> action_opts) {
        if (conn) {
            return <RefDataContextInfo>{
                "conn_name": conn.name,
                "conn_opts": conn.getRealOptions(),
                "opts": action_opts,
            };
        }
    }

    auto getAsyncValue(hash<AsyncCallInfo> api, ...) {
        on_error rethrow $1.err, sprintf("%s (context: %s)", $1.desc, api.label);

        JavaScriptProgram pgm = api.pool.get();
        on_exit {
            api.pool.release(pgm);
            info("TypeScriptActionApiDataProvider::getAsyncValue() released pgm %y", pgm.uniqueHash());
        }
        info("TypeScriptActionApiDataProvider::getAsyncValue() acquired pgm %y", pgm.uniqueHash());

        auto v = call_function_args(api.async_call, argv);
        auto rv;
        auto err;
        if (v instanceof JavaScriptPromise) {
            v.then(sub (auto val) {
                rv = val;
            }, sub (auto e) {
                err = e;
            });
            pgm.spinOnce();
            v.wait();
        } else {
            rv = v;
        }

        if (rv instanceof JavaScriptObject) {
            rv = rv.toData();
        } else if (rv.typeCode() == NT_LIST && (rv[0] instanceof JavaScriptObject)) {
            rv = map $1.toData(), rv;
        } else if (err instanceof JavaScriptObject) {
            err = err.toData();
        } else if (err.typeCode() == NT_LIST && (err[0] instanceof JavaScriptObject)) {
            err = map $1.toData(), err;
        }

        if (exists err) {
            # strip non-serializable data from err
            err = stripNonSerializableData(err);

            if (err._err{"message", "name", "code"}.size() == 3) {
                throw "JAVASCRIPT-ASYNC-ERROR", sprintf("Error in async request: %s: %s: %s", err._err.name,
                    err._err."code", err._err.message), err;
            }
            throw "JAVASCRIPT-ASYNC-ERROR", "Error in async request", err;
        }

        return rv;
    }

    static auto stripNonSerializableData(auto v) {
        switch (v.typeCode()) {
            case NT_HASH:
                v = map {$1.key: TypeScriptActionApiDataProvider::stripNonSerializableData($1.value)},
                    v.pairIterator();
                break;

            case NT_LIST:
                v = map TypeScriptActionApiDataProvider::stripNonSerializableData($1), v;
                break;

            case NT_STRING:
            case NT_INT:
            case NT_BOOLEAN:
            case NT_FLOAT:
            case NT_NUMBER:
            case NT_DATE:
            case NT_BINARY:
            case NT_NOTHING:
            case NT_NULL:
                break;

            case NT_OBJECT:
                if (v instanceof JavaScriptObject) {
                    return v.toData();
                }
                # fall down to next case

            default:
                remove v;
                break;
        }
        return v;
    }
}
}