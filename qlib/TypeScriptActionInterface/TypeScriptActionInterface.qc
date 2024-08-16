# -*- mode: qore; indent-tabs-mode: nil -*-
#! Qore TypeScriptActionInterface module definition

/*  TypeScriptActionInterface.qc Copyright 2024 Qore Technologies, s.r.o.

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
#! Interface class
public class TypeScriptActionInterface {
    public {
        static hash<string, code> Api = TypeScriptActionInterface::getInterface();

        static TypeScriptActionRootDataProvider root();

        const TypeKeys = (
            "name", "display_name", "short_desc", "desc", "type", "example_value",
            "default_value", "allowed_values", "attr"
        );

        const TypeScriptAppRestConnectionOptions = RestConnection::ConnectionScheme.options;

        const TypeScriptAppRestOptionKeys = (
            "content_encoding",
            "data",
            "disable_automatic_pings",
            "encode_chars",
            "headers",
            "oauth2_auth_args",
            "oauth2_auth_url",
            "oauth2_auto_refresh",
            "oauth2_client_id",
            "oauth2_client_secret",
            "oauth2_grant_type",
            "oauth2_redirect_url",
            "oauth2_refresh_token",
            "oauth2_scopes",
            "oauth2_token_args",
            "oauth2_token_url",
            "password",
            "ping_method",
            "ping_headers",
            "ping_body",
            "proxy",
            "ssl_cert_data",
            "ssl_key_data",
            "ssl_verify_cert",
            "token",
            "token_type",
            "url",
            "username",
        );
    }

    private {
        #! Maps from app names to schemes
        static hash<string, string> asmap;

        #! Maps from scheme names to apps
        static hash<string, string> samap;

        #! Maps from app names to rest getOptions
        static hash<string, hash<auto>> armap;
    }

    static registerApp(JavaScriptObject app) {
        TypeScriptActionInterface::registerApp(app.toData());
    }

    static registerAction(JavaScriptObject action) {
        TypeScriptActionInterface::registerAction(action.toData());
    }

    static registerApp(hash<auto> app) {
        hash<auto> app0 += app;
        if (app.logo) {
            app0.logo = parse_base64_string(app.logo);
        }
        if (*hash<auto> rest = remove app0.rest) {
            string sname = "tsrest-" + app.name;
            hash<ConnectionSchemeInfo> scheme = <ConnectionSchemeInfo>{
                "display_name": app.display_name,
                "short_desc": app.short_desc,
                "desc": app.desc,
                "cls": Class::forName("TypeScriptAppRestConnection"),
                "schemes": {
                    sname: True,
                },
                "base_scheme_map": {
                    "https": sname,
                },
                "options": TypeScriptAppRestConnectionOptions,
                "auto_url": exists rest.url,
            };
            ConnectionSchemeCache::registerScheme(sname, scheme);
            asmap{app.name} = sname;
            samap{sname} = app.name;
            armap{app.name} = rest{TypeScriptAppRestOptionKeys};
            app0.scheme = sname;
        }
        DataProviderActionCatalog::registerApp(cast<hash<DataProviderAppInfo>>(app0));
    }

    static registerAction(hash<auto> action) {
        TypeScriptActionInterface::generateDataProvider(\action);
        DataProviderActionCatalog::registerAction(cast<hash<DataProviderActionInfo>>(action));
    }

    #! Returns the path to the data provider
    static generateDataProvider(reference<hash<auto>> action) {
        hash<DataProviderAppInfo> app;
        {
            on_error rethrow "TYPESCRIPT-ACTION-ERROR", sprintf("Error registering action %y: %s: %s", action.action,
                $1.err, $1.desc);
            app = DataProviderActionCatalog::getAppEx(action.app);
        }
        switch (action.action_code) {
            case DPAT_API: {
                TypeScriptActionInterface::generateApiDataProvider(app, \action);
                break;
            }

            default:
                throw "TYPESCRIPT-ACTION-ERROR", sprintf("App %y action %y action_code: %y is unsupported",
                    action.app, action.action, action.action_code);
        }
    }

    static generateApiDataProvider(hash<DataProviderAppInfo> app, reference<hash<auto>> action) {
        auto api_function = remove action.api_function;
        if (!api_function.callp()) {
            throw "TYPESCRIPT-ACTION-ERROR", sprintf("App %y action %y has an invalid \"api_function\" "
                "attribute; got type %y; expecting a callable value", action.app, action.action,
                api_function.fullType());
        }

        # maps from options to "get_allowed_values" code for each option
        hash<string, code> omap;
        *AbstractDataProviderType request_type;
        if (*hash<auto> opts = remove action.options) {
            request_type = TypeScriptActionInterface::getType(map {$1.key: $1.value{TypeKeys}},
                opts.pairIterator());
            action.options = TypeScriptActionInterface::getOptions(app, action, opts, \omap);
        }
        *AbstractDataProviderType response_type;
        if (action.response_type) {
            action.response_type = action.response_type;
            response_type = TypeScriptActionInterface::getType(remove action.response_type);
            action.output_type = response_type;
        }

        TypeScriptActionAppDataProvider prov = TypeScriptActionInterface::getAppDataProvider(action.app,
            action.action);

        prov.registerChild(action.action, new TypeScriptActionApiDataProvider(action.action, api_function,
            request_type, response_type, omap));

        action.path = action.action;
    }

    static TypeScriptActionAppDataProvider getAppDataProvider(string app, string action) {
        if (*AbstractDataProvider app_prov = root.getChildProvider(app)) {
            return cast<TypeScriptActionAppDataProvider>(app_prov);
        }
        TypeScriptActionAppDataProvider prov(app);
        root.registerChild(app, prov);
        return prov;
    }

    static TypeScriptActionAppDataProvider getDataProvider(string app, TypeScriptAppRestConnection conn) {
        TypeScriptActionAppDataProvider rv = cast<TypeScriptActionAppDataProvider>(root.getChildProviderEx(app));
        rv = rv.copy();
        rv.setConnection(conn);
        return rv;
    }

    static *hash<string, hash<ActionOptionInfo>> getOptions(hash<DataProviderAppInfo> app, hash<auto> action,
            hash<auto> opts, reference<hash<string, code>> omap) {
        hash<string, hash<ActionOptionInfo>> rv;
        foreach hash<auto> i in (opts.pairIterator()) {
            if (exists (auto get_allowed_values = remove i.value.get_allowed_values)) {
                if (!get_allowed_values.callp()) {
                    throw "TYPESCRIPT-ACTION-ERROR", sprintf("App %y action %y option %y has an invalid "
                        "\"get_allowed_values\" attribute; got type %y; expecting a callable value", action.app,
                        action.action, i.key, get_allowed_values.fullType());
                }
                if (app.scheme) {
                    if (i.value.depends_on.val()) {
                        i.value.depends_on = ("qorus_app_connection",) + i.value.depends_on;
                    } else {
                        i.value.depends_on = ("qorus_app_connection",);
                    };
                }
                omap{i.key} = get_allowed_values;
            }
            if (i.value.required && !i.value.preselected && !exists i.value.default_value) {
                i.value.preselected = True;
            }
            rv{i.key} = TypeScriptActionInterface::getOptionInfo(i.value);
        }
        return rv;
    }

    static hash<ActionOptionInfo> getOptionInfo(hash<auto> opt) {
        opt.type = TypeScriptActionInterface::getType(opt.type);
        return cast<hash<ActionOptionInfo>>(opt);
    }

    static AbstractDataProviderType getType(string name) {
        *AbstractDataProviderType type = AbstractDataProviderTypeMap{name};
        if (!type) {
            throw "TYPE-ERROR", sprintf("Cannot match type %y to a known Qore type", name);
        }
        return type;
    }

    static AbstractDataProviderType getType(hash<auto> h) {
        on_error rethrow $1.err, sprintf("%s (type: %y)", $1.desc, h);
        HashDataType type();
        type.addQoreFields(map {$1.key: TypeScriptActionInterface::getField($1.value)}, h.pairIterator());
        return type;
    }

    static AbstractDataProviderType getType(auto v) {
        throw "TYPE-ERROR", sprintf("Expecting \"string\" or \"hash\" for the option \"type\"; got %y "
            "instead", v.fullType());
    }

    static hash<auto> getField(hash<auto> h) {
        on_error rethrow $1.err, sprintf("%s (field: %y)", $1.desc, h);
        h.type = TypeScriptActionInterface::getType(h.type);
        return h;
    }

    #! Returns a hash that can be used to access these methods in JavaScript
    static hash<string, code> getInterface() {
        return {
            "registerApp": \TypeScriptActionInterface::registerApp(),
            "registerAction": \TypeScriptActionInterface::registerAction(),
        };
    }

    #! Returns REST options for the given app
    static hash<auto> getRestOptions(string app) {
        *hash<auto> rv = armap{app};
        if (!rv) {
            throw "TYPESCRIPT-APP-ERROR", sprintf("Cannot find any REST options for app %y", app);
        }
        return rv;
    }
}
}