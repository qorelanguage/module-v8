export const MockApps = {
  test: {
    name: 'js-test',
    display_name: 'JavaScript Test',
    short_desc: 'Test',
    desc: 'Test',
    logo: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDUyIDYzIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zOnNlcmlmPSJodHRwOi8vd3d3LnNlcmlmLmNvbS8iIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MjsiPgogICAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMSwtMTYuNjUsLTIzLjAxNzIpIj4KICAgICAgICA8cGF0aCBkPSJNNjguMzYzLDYzLjk3M0w2OC4zNjMsNDAuMTA5QzY4LjM2Myw0MC4xMDkgNjguMzYzLDM3LjExMyA2NS43NjgsMzUuNjE1TDQ1LjEwMiwyMy42ODNDNDUuMTAyLDIzLjY4MyA0Mi41MDcsMjIuMTg1IDM5LjkxMiwyMy42ODNMMTkuMjQ1LDM1LjYxNUMxOS4yNDUsMzUuNjE1IDE2LjY1LDM3LjExMyAxNi42NSw0MC4xMDlMMTYuNjUsNjMuOTczQzE2LjY1LDYzLjk3MyAxNi42NSw2Ni45NjkgMTkuMjQ1LDY4LjQ2N0w0Ny44MzksODQuODIyQzQ3LjgzOSw4NC44MjIgNTAuNDM0LDg2LjM2OCA1My4wMjksODQuODdMNjQuNjUyLDc4LjExMkw0Mi41Miw2NS41MDNMNDIuNTA3LDY1LjUxMUwzMC44NDMsNTguNzc2TDMwLjg0Myw0NS4zMDdMNDIuNTA3LDM4LjU3M0w1NC4xNzEsNDUuMzA3TDU0LjE3MSw1OC43NzZMNDUuMjEzLDYzLjk0OEw1OS41NjUsNzIuMDVMNjUuNzY4LDY4LjQ2OUM2NS43NjksNjguNDY4IDY4LjM2Myw2Ni45NyA2OC4zNjMsNjMuOTczIiBzdHlsZT0iZmlsbDpyZ2IoNjQsNjQsNjQpO2ZpbGwtcnVsZTpub256ZXJvOyIvPgogICAgPC9nPgo8L3N2Zz4K',
    logo_file_name: 'test.svg',
    logo_mime_type: 'image/svg+xml',
    rest: {
      data: 'json',
      encode_chars: '+',
      oauth2_auth_args: {
        access_type: 'offline',
        prompt: 'consent',
      },
      oauth2_auth_url: 'https://example.com/oauth2/auth',
      oauth2_grant_type: 'authorization_code',
      oauth2_token_url: 'https://example.com/token',
      url: 'tsrest-js-test://www.example.com/api',
    },
    actions: [
      {
        app: 'js-test',
        action: 'test-api',
        display_name: 'Test API',
        short_desc: 'Test API',
        desc: 'Test API',
        action_code: 2,
        api_function: function (obj, _opts, _ctx) {
          if (!obj.count) {
            obj.count = 0;
          }
          obj.count += 1;
          console.log('obj + 1 = %d (OK)', obj);
          return {
            result: obj.count,
            status: 'OK',
          };
        },

        options: {
          count: {
            type: 'int',
            display_name: 'Count',
            short_desc: 'A count of something',
            desc: 'A count of something',
            required: true,
            preselected: true,
            get_allowed_values: function () {
              return [
                {
                  display_name: '1',
                  short_desc: '1',
                  desc: '1',
                  value: 1,
                },
                {
                  display_name: '2',
                  short_desc: '2',
                  desc: '2',
                  value: 2,
                },
              ];
            },
            example_value: 1,
          },
          other: {
            type: 'string',
            display_name: 'Other',
            short_desc: 'another value',
            desc: 'another value',
            required: true,
            preselected: true,
            depends_on: ['count'],
            get_allowed_values: function () {
              return [
                {
                  display_name: 'this',
                  short_desc: 'this',
                  desc: 'this',
                  value: 'this',
                },
                {
                  display_name: 'that',
                  short_desc: 'that',
                  desc: 'that',
                  value: 'that',
                },
              ];
            },
          },
          unimportant: {
            type: 'bool',
            display_name: 'Unimportant?',
            short_desc: 'another option',
            desc: 'another option',
            depends_on: ['count', 'other'],
          },
        },

        response_type: {
          result: {
            type: 'int',
            display_name: 'Count',
            short_desc: 'A count of something',
            desc: 'A count of something',
            example_value: 1,
            required: true,
          },
          status: {
            type: 'string',
            display_name: 'Status',
            short_desc: 'The status of the operation',
            desc: 'The status of the operation',
            allowed_values: [
              {
                display_name: 'OK',
                short_desc: 'Successful result',
                desc: 'Successful result',
                value: 'OK',
              },
              {
                display_name: 'Error',
                short_desc: 'Error result',
                desc: 'Error result',
                value: 'Error',
              },
            ],
            required: true,
          },
        },
      },
    ],
  },
};
