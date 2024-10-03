import { Client } from '@notionhq/client';
import { notionAuth } from '../..';
import { createAction, Property } from 'core/framework';
import { notionCommon } from '../common';
import { IActionResponse } from 'global/models/actions';

const createDatabaseResponseType: IActionResponse = {
  object: {
    name: 'object',
    type: 'string',
    display_name: 'Object',
    short_desc: 'The type of object returned',
    desc: 'The type of object returned in this case it will always be page',
    example_value: 'page',
  },
  id: {
    name: 'id',
    type: 'string',
    display_name: 'ID',
    short_desc: 'The ID of the page',
    desc: 'The ID of the page',
    example_value: '12345678-1234-1234-1234-123456789012',
  },
  url: {
    name: 'url',
    type: 'string',
    display_name: 'URL',
    short_desc: 'The URL of the page',
    desc: 'The URL of the page',
    example_value: 'https://example.com/page',
  },
  properties: {
    name: 'properties',
    type: 'hash',
    display_name: 'Properties',
    short_desc: 'The properties of the page',
    desc: 'The properties of the page',
    example_value: {
      Price: { id: 'gwzR', type: 'number', number: 1 },
      'Grocery item': { id: 'title', type: 'title' },
    },
  },
  title: {
    name: 'title',
    type: 'list',
    example_value: [
      {
        type: 'text',
        text: {
          content: 'This is a test comment',
          link: 'https://example.com',
        },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'This is a test comment',
      },
    ],
    display_name: 'Title',
    short_desc: 'The title of the page',
    desc: 'The title of the page',
  },
};

export const createDatabase = createAction({
  name: 'create_database',
  displayName: 'Create Database',
  description: 'Create a new database',
  auth: notionAuth,
  responseType: createDatabaseResponseType,
  props: {
    databaseId: { ...notionCommon.database_id, required: false },
    pageId: { ...notionCommon.page, required: false },
    title: Property.ShortText({
      displayName: 'Title',
      description: 'The title of the database',
      required: true,
    }),
    properties: Property.Json({
      displayName: 'Properties',
      description: 'The properties of the database',
      required: true,
      defaultValue: {
        'Grocery item': {
          type: 'title',
          title: {},
        },
        Price: {
          type: 'number',
          number: {
            format: 'dollar',
          },
        },
        'Last ordered': {
          type: 'date',
          date: {},
        },
      },
    }),
  },
  async run(context) {
    const { title, properties } = context.propsValue;

    const notion = new Client({
      auth: context.auth.access_token,
      notionVersion: '2022-02-22',
    });

    const parent = context.propsValue.databaseId
      ? { database_id: context.propsValue.databaseId }
      : { page_id: context.propsValue.pageId };

    return await notion.databases.create({
      parent,
      title: [
        {
          type: 'text',
          text: {
            content: title,
          },
        },
      ],
      properties: properties as Record<string, any>,
    });
  },
});
