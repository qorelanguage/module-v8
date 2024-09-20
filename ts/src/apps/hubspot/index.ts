import { DEFAULT_LOGO } from 'global/constants';
import { mapActionsToApp } from '../../global/helpers';
import { IQoreAppWithActions } from '../../global/models/qore';
import { L } from '../../i18n/i18n-node';
import { Locales } from '../../i18n/i18n-types';
import * as hubspotActions from './actions';

/*
 * Returns the app object with all the actions ready to use, using translations
 * @param locale - the locale
 * @returns IQoreAppWithActions
 */
export default (locale: Locales) =>
  ({
    display_name: L[locale].apps.hubspot.displayName(),
    short_desc: L[locale].apps.hubspot.shortDesc(),
    name: 'Hubspot',
    // @ts-expect-error typescript will complain about " hubspotAction" because most of the actions are still missing `options` and `action` fields
    actions: mapActionsToApp(' hubspot', hubspotActions, locale),
    desc: L[locale].apps.hubspot.longDesc(),
    logo: DEFAULT_LOGO,
    logo_file_name: 'hubspot.svg',
    logo_mime_type: 'image/svg+xml',
  }) as IQoreAppWithActions;
