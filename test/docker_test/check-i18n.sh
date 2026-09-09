#!/bin/bash
#
# Verifies the source-owned data-provider i18n catalogs for the TypeScript app catalogue.
#
# Copyright 2026 Qore Technologies, s.r.o.

set -e

src_dir=$(cd "$(dirname "$0")/../.." && pwd)
i18n_dir="${1:-${src_dir}/qlib/TypeScriptActionInterface/i18n}"

if [ ! -d "${i18n_dir}" ]; then
    echo "ERROR: i18n catalog directory ${i18n_dir} does not exist" >&2
    exit 1
fi

# Load this checkout explicitly so an installed module cannot hide source drift. The owner-aware
# source-tree check validates current roots and translations and rejects missing, duplicate, or
# orphaned domains without relying on an English app list or a directory-count heuristic.
export QORE_MODULE_DIR="${src_dir}/qlib${QORE_MODULE_DIR:+:${QORE_MODULE_DIR}}"

# Source-catalog qualification must describe this repository's master catalogue only. Developer and runner
# environments can point these variables at unrelated Qorus fixtures; loading them here would make test-only apps
# appear source-owned and could allow an orphan catalog to pass locally.
unset QORE_TYPESCRIPT_ACTION_SCRIPTS QORE_TYPESCRIPT_ACTION_TEST_SCRIPTS

qore-data-provider-i18n --no-color --check-source-tree --require-standard-locales \
    --require-complete-locales --output "${i18n_dir}"
