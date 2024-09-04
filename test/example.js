
const obj = {
    actionsCatalogue: {
        registerAppActions: function(api) {
            /* registerApp() takes the same arguments as DataProviderActionCatalog::registerApp() plus:
                - rest?: object -> documented below
                - swagger? string -> a location to a Swagger 2.0 schema = OpenAPI 2.0
            */
            api.registerApp({
                "name": "js-test",
                "display_name": "JavaScript Test",
                "short_desc": "Test",
                "desc": "Test",
                // "logo" is a base64-encoded string
                "logo": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDUyIDYzIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zOnNlcmlmPSJodHRwOi8vd3d3LnNlcmlmLmNvbS8iIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MjsiPgogICAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMSwtMTYuNjUsLTIzLjAxNzIpIj4KICAgICAgICA8cGF0aCBkPSJNNjguMzYzLDYzLjk3M0w2OC4zNjMsNDAuMTA5QzY4LjM2Myw0MC4xMDkgNjguMzYzLDM3LjExMyA2NS43NjgsMzUuNjE1TDQ1LjEwMiwyMy42ODNDNDUuMTAyLDIzLjY4MyA0Mi41MDcsMjIuMTg1IDM5LjkxMiwyMy42ODNMMTkuMjQ1LDM1LjYxNUMxOS4yNDUsMzUuNjE1IDE2LjY1LDM3LjExMyAxNi42NSw0MC4xMDlMMTYuNjUsNjMuOTczQzE2LjY1LDYzLjk3MyAxNi42NSw2Ni45NjkgMTkuMjQ1LDY4LjQ2N0w0Ny44MzksODQuODIyQzQ3LjgzOSw4NC44MjIgNTAuNDM0LDg2LjM2OCA1My4wMjksODQuODdMNjQuNjUyLDc4LjExMkw0Mi41Miw2NS41MDNMNDIuNTA3LDY1LjUxMUwzMC44NDMsNTguNzc2TDMwLjg0Myw0NS4zMDdMNDIuNTA3LDM4LjU3M0w1NC4xNzEsNDUuMzA3TDU0LjE3MSw1OC43NzZMNDUuMjEzLDYzLjk0OEw1OS41NjUsNzIuMDVMNjUuNzY4LDY4LjQ2OUM2NS43NjksNjguNDY4IDY4LjM2Myw2Ni45NyA2OC4zNjMsNjMuOTczIiBzdHlsZT0iZmlsbDpyZ2IoNjQsNjQsNjQpO2ZpbGwtcnVsZTpub256ZXJvOyIvPgogICAgPC9nPgo8L3N2Zz4K",
                "logo_file_name": "test.svg",
                "logo_mime_type": "image/svg+xml",
                /* "rest" is an optional object giving information about REST communication with the server; set this if
                    the action uses OAuth2, and you need Qorus to create a REST connection that can be used to maintain
                    the authentication token and other information for communicating with the server; valid keys are:
                    - content_encoding?: string -> use to encode message bodies when sending: "gzip", "bzip2", "deflate",
                    "identity"
                    - data?: string -> set to specify message body serialization: "auto" (the default - meaning JSON),
                    "json", "yaml", "rawxml", "xml", "url", "text", "bin"
                    - disable_automatic_pings?: bool -> set to disable automatic pings; for rate-limited, metered, or
                    other connections that should not be pinged regularly (default: false)
                    - encode_chars?: bool -> "A set of additional characters to subject to percent encoding in URLs
                    - headers?: object -> an optional data object of headers to send with every request
                    - oauth2_auth_args?: object -> an optional data object with argument to be serialized as query
                    arguments in the request to the \c oauth2_auth_url for the \c authentication_code grant type
                    - oauth2_auth_url?: string -> the OAuth2 authorization URL for the \c authorization_code grant type;
                    ignored if the \c token option is set
                    - oauth2_auto_refresh?: bool -> If OAuth2 tokens should be automatically refreshed (default: true)
                    - oauth2_client_id?: string -> The OAuth2 client ID; ignored if the \c token option is set; this
                    should be for an OAuth2 client associated with Qorus
                    - oauth2_client_secret?: string -> the OAuth2 client secret; ignored if the \c token option is set
                    - oauth2_grant_type?: string- > the OAuth2 grant type; ignored if the \c token option is set; possible
                    values:
                    - "authorization_code": requires \c oauth2_client_id, \c oauth2_client_secret,
                        \c oauth2_auth_url, as well as \c oauth2_token_url; note that this grant type cannot be handled
                        automatically but rather must be handled by external code that redirects the user to the
                        authentication server and then updates the connection with token information retrieved
                    - "client_credentials": requires \c oauth2_client_id, \c oauth2_client_secret, as well as
                        \c oauth2_token_url
                    - "password": requires a username, password, \c oauth2_client_id, \c oauth2_client_secret, as well
                        as \c oauth2_token_url
                    - oauth2_redirect_url?: string -> The OAuth2 redirect URL for the \c authorization_code grant type;
                    ignored if the \c token option is set
                    - oauth2_refresh_token?: string -> An OAuth2 refresh token (complements option \c token)
                    - oauth2_scopes?: string[] -> A list of OAuth2 scopes to request; ignored if the \c token option is
                    set
                    - oauth2_token_args?: object -> Extra arguments for OAuth2 token requests to \c oauth2_token_url; if
                    this option is set as well as \c oauth2_alt_token_url, then the \c oauth2_token_url value will be
                    added to this as well when the request is made to the \c oauth2_alt_token_url
                    - oauth2_token_url?: string -> The token URL OAuth2 flows; ignored if the \c token option is set
                    - password?: string -> The password for authentication; do not use with an OAuth2 config
                    - ping_method?: string -> The HTTP method to use for pings
                    - ping_headers?: object -> Any HTTP headers to send with pings
                    - ping_body?: any -> The message body to send with pings
                    - proxy?: string -> The proxy URL for connecting through a proxy
                    - ssl_cert_data?: string -> a PEM-encoded string for an X.509 client certificate
                    - ssl_key_data?: string -> a PEM-encoded string for an X.509 client key
                    - ssl_verify_cert?: bool -> if true then server certificates will only be accepted if they pass
                    verification
                    - token?: string -> Any bearer token to use for the connection; will be passed as
                    <tt>Authorization: Bearer ...</tt> in request headers; conflicts with username and password options
                    or authentication credentials in the URL; if this option is set then any OAuth2 options are ignored
                    - token_type?: string -> The type of token to use for the \c Authentication header; ignored if no
                    \c token option is set
                    - url: string -> A string giving the URL to connect to
                    - username?: string -> The username for authentication; only used if no username or password is set in
                    the URL and if the \c password option is also used
                */
                "rest": {
                    "data": "json",
                    "encode_chars": "+",
                    "oauth2_auth_args": {
                        "access_type": "offline",
                        "prompt": "consent",
                    },
                    "oauth2_auth_url":  "https://example.com/oauth2/auth",
                    "oauth2_grant_type": "authorization_code",
                    "oauth2_token_url": "https://example.com/token",
                    "url": "tsrest-js-test://www.example.com/api",
                },
            });

            api.registerAction({
                "app": "js-test",
                "action": "test-api",
                "display_name": "Test API",
                "short_desc": "Test API",
                "desc": "Test API",
                "action_code": 2,  // DPAT_API == 2

                /* "api_function" is required when "action_code" == DPAT_API
                    @param obj: any - is the main argument used to call the API and must correspond to the request
                    type, which can be any serializable data type (including no value). It is normally a data object
                    @param opts?: object - currently unused
                    @param ctx?: object with the following properties:
                    - conn_name?: string -> the connection name, if any is defined
                    - conn_opts?: object -> connection options; for REST connections, see the 'rest' object definition
                    - opts?: object -> a data object with option values set for the current action

                    @return the return value for the API; can be of any serializable data type that the API returns
                    (including no value)

                    @note the function here will be called with no "this" context; "this" cannot be used in this function
                */
                "api_function": function(obj, opts, ctx) {
                    if (!obj.count) {
                        obj.count = 0;
                    }
                    obj.count += 1;
                    //console.log('obj: %d + 1 = %d (OK)', obj.count - 1, obj.count);
                    return {
                        "result": obj.count,
                        "status": "OK",
                    };
                },
                /* "options" defines the API request type when "action_code" == DPAT_API

                    This is equivalent to "ActionOptionInfo" in Qore: https://qoretechnologies.com/manual/qorus/gitlab-docs/develop/qore/modules/DataProvider/html/struct_data_provider_1_1_action_option_info.html
                    except that "type" is created from either a:
                    - string: giving the name of a simple type - one of:
                        ["int", "integer", "string", "boolean", "bool", "double", "float", "number", "binary", "list",
                        "hash", "object", "date", "NULL", "nothing", "base64binary", "base64urlbinary", "hexbinary",
                        "data", "softint", "softstring", "softbool", "softfloat", "softnumber", "softdate", "*softint",
                        "*softstring", "*softbool", "*softfloat", "*softnumber", "*softdate", "all", "any", "auto",
                        "*int", "*integer", "*string", "*boolean", "*bool", "*double", "*float", "*number", "*binary",
                        "*list", "*hash", "*object", "*date", "*data", "*base64binary", "*base64urlbinary", "*hexbinary",
                        "byte", "*byte", "softbyte", "*softbyte", "ubyte", "*ubyte", "softubyte", "*softubyte"]
                    or
                    - hash: which describes a data object; each key describes a data property; field objects can have the
                      following keys (note that they key itself is the technical name for the field):
                      - display_name?: string - the user-friendly display name for the field
                      - short_desc?: string - a short plain-text description of the field
                      - desc?: string - a longer description for the field that supports markdown formatting
                      - type - same as this - either a string or a data object again
                      - example_value?: any - (values must use the field's type) any example value to use when generating
                          example data etc
                      - default_value?: any - (values must use the field's type) the default value if none is provided by
                          the user
                      - allowed_values?: AllowedValues[] - an array of objects providing the only values allowed for the
                          field - with the following properties
                          - display_name?: string - the user-friendly display name for the field
                          - short_desc?: string - a short plain-text description of the field
                          - value: any - (must be present and must use the field's type); one of the allowed values
                          - desc: string - a description of the value (if unknown just use the value again)
                      - depends_on?: string[] - an optional list of other options that must be set before this option can
                        be set
                      - get_allowed_values?: function (ctx?: object): AllowedValues[] | undefined - a function that will
                        return the allowed values when called; the 'ctx' parameter has the same format as the third
                        argument to 'api_function' above:
                        - conn_name?: string -> the connection name, if any is defined
                        - conn_opts?: object -> connection options; for REST connections, see the 'rest' object definition
                        - opts?: object -> a data object with option values set for the current action
                      - attr?: Attributes - an optional data object with any properties
                      - required?: bool -> if the hash itself is required or optional

                    Note that this data will also be used to create the API request type
                */
                "options": {
                    "count": {
                        "type": "int",
                        "display_name": "Count",
                        "short_desc": "A count of something",
                        "desc": "A count of something",
                        "required": true,
                        "preselected": true,
                        "get_allowed_values": function() {
                            return [
                                {
                                    "display_name": "1",
                                    "short_desc": "1",
                                    "desc": "1",
                                    "value": 1,
                                },
                                {
                                    "display_name": "2",
                                    "short_desc": "2",
                                    "desc": "2",
                                    "value": 2,
                                },
                            ];
                        },
                        "example_value": 1,
                    },
                    "other": {
                        "type": "string",
                        "display_name": "Other",
                        "short_desc": "another value",
                        "desc": "another value",
                        "required": true,
                        "preselected": true,
                        "depends_on": ["count"],
                        "get_allowed_values": function() {
                            return [
                                {
                                    "display_name": "this",
                                    "short_desc": "this",
                                    "desc": "this",
                                    "value": "this",
                                },
                                {
                                    "display_name": "that",
                                    "short_desc": "that",
                                    "desc": "that",
                                    "value": "that",
                                },
                            ];
                        },
                    },
                    "unimportant": {
                        "type": "bool",
                        "display_name": "Unimportant?",
                        "short_desc": "another option",
                        "desc": "another option",
                        "depends_on": ["count", "other"],
                    },
                },
                /* "response_type" defines the response type when "action_code" == DPAT_API

                    The response type data format is the same as the data format for types above, so either a string or a hash
                */
                "response_type": {
                    "result": {
                        "type": "int",
                        "display_name": "Count",
                        "short_desc": "A count of something",
                        "desc": "A count of something",
                        "example_value": 1,
                        "required": true,
                    },
                    "status": {
                        "type": "string",
                        "display_name": "Status",
                        "short_desc": "The status of the operation",
                        "desc": "The status of the operation",
                        "allowed_values": [
                            {
                                "display_name": "OK",
                                "short_desc": "Successful result",
                                "desc": "Successful result",
                                "value": "OK",
                            },
                            {
                                "display_name": "Error",
                                "short_desc": "Error result",
                                "desc": "Error result",
                                "value": "Error",
                            },
                        ],
                        "required": true,
                    },
                },
            });

            api.registerApp({
                "name": "js-swagger-test",
                "display_name": "JavaScript Swagger Test",
                "short_desc": "Test",
                "desc": "Test",
                // "logo" is a base64-encoded string
                "logo": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDUyIDYzIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zOnNlcmlmPSJodHRwOi8vd3d3LnNlcmlmLmNvbS8iIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MjsiPgogICAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMSwtMTYuNjUsLTIzLjAxNzIpIj4KICAgICAgICA8cGF0aCBkPSJNNjguMzYzLDYzLjk3M0w2OC4zNjMsNDAuMTA5QzY4LjM2Myw0MC4xMDkgNjguMzYzLDM3LjExMyA2NS43NjgsMzUuNjE1TDQ1LjEwMiwyMy42ODNDNDUuMTAyLDIzLjY4MyA0Mi41MDcsMjIuMTg1IDM5LjkxMiwyMy42ODNMMTkuMjQ1LDM1LjYxNUMxOS4yNDUsMzUuNjE1IDE2LjY1LDM3LjExMyAxNi42NSw0MC4xMDlMMTYuNjUsNjMuOTczQzE2LjY1LDYzLjk3MyAxNi42NSw2Ni45NjkgMTkuMjQ1LDY4LjQ2N0w0Ny44MzksODQuODIyQzQ3LjgzOSw4NC44MjIgNTAuNDM0LDg2LjM2OCA1My4wMjksODQuODdMNjQuNjUyLDc4LjExMkw0Mi41Miw2NS41MDNMNDIuNTA3LDY1LjUxMUwzMC44NDMsNTguNzc2TDMwLjg0Myw0NS4zMDdMNDIuNTA3LDM4LjU3M0w1NC4xNzEsNDUuMzA3TDU0LjE3MSw1OC43NzZMNDUuMjEzLDYzLjk0OEw1OS41NjUsNzIuMDVMNjUuNzY4LDY4LjQ2OUM2NS43NjksNjguNDY4IDY4LjM2Myw2Ni45NyA2OC4zNjMsNjMuOTczIiBzdHlsZT0iZmlsbDpyZ2IoMCwyMzEsMjU1KTtmaWxsLXJ1bGU6bm9uemVybzsiLz4KICAgIDwvZz4KPC9zdmc+Cg==",
                "logo_file_name": "test-swagger.svg",
                "logo_mime_type": "image/svg+xml",
                "swagger": "PetStore.swagger.yaml",
                "rest": {
                    "data": "json",
                    "oauth2_auth_url":  "https://{{subdomain}}.example.com/oauth2/auth",
                    "oauth2_grant_type": "authorization_code",
                    "oauth2_token_url": "https://{{subdomain}}.example.com/token",
                    "url": "tsrest-js-swagger-test://{{subdomain}}.example.com/api",
                },
                "rest_modifiers": {
                    "options": {
                        "subdomain": {
                            "display_name": "Subdomain",
                            "short_desc": "The subdomain for the URL",
                            "desc": "The subdomain for the URL",
                            "type": "string",
                        },
                    },
                    "required_options": "subdomain",
                    "url_template_options": [
                        "subdomain",
                    ],
                },
            });

            api.registerAction({
                "app": "js-swagger-test",
                "action": "create-pet",
                "display_name": "Create Pet",
                "short_desc": "Create pet",
                "desc": "Create pet",
                "action_code": 2,  // DPAT_API == 2
                "api_function": function(obj, opts, ctx) {
                },
                "swagger_path": "pet/POST"
            });
        }
    }
};
obj