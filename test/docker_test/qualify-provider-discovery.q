#!/usr/bin/env qore
# -*- mode: qore; indent-tabs-mode: nil -*-

/*  Copyright 2026 Qore Technologies, s.r.o.

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

%modern
%requires json
%requires Util
%requires DataProvider
%requires ProviderIndex

%exec-class ProviderDiscoveryQualification

class ProviderDiscoveryQualification {
    constructor() {
        if (ARGV.size() != 2) {
            stderr.printf("usage: %s INDEX-DIR REPORT.json\n", get_script_name());
            exit(2);
        }

        string index_dir = ARGV[0];
        string report_path = ARGV[1];
        hash<auto> provenance = {
            "repository": "qoretechnologies/module-v8",
            "source_revision": ENV.CI_COMMIT_SHA ?? "local",
            "ci_job": ENV.CI_JOB_NAME ?? "local",
            "ci_job_url": ENV.CI_JOB_URL,
            "base_image": ENV.CI_JOB_IMAGE,
        };
        if (is_readable("/etc/qore-test-base-build-info")) {
            provenance.base_image_build_info
                = ReadOnlyFile::readTextFile(
                    "/etc/qore-test-base-build-info");
        }

        try {
            # Qore modules receive their own startup environment snapshot, so
            # clearing these extension points after process launch cannot
            # sanitize the TypeScript module. Fail closed if a caller did not
            # launch this qualification in a clean release environment.
            if (ENV.QORE_TYPESCRIPT_ACTION_SCRIPTS
                    || ENV.QORE_TYPESCRIPT_ACTION_TEST_SCRIPTS) {
                throw "TYPESCRIPT-PROVIDER-QUALIFICATION-UNSANITIZED-ENV",
                    "release provider qualification must be launched without TypeScript action fixture paths", {
                        "variables": (
                            "QORE_TYPESCRIPT_ACTION_SCRIPTS",
                            "QORE_TYPESCRIPT_ACTION_TEST_SCRIPTS",
                        ),
                    };
            }

            # Establish ProviderIndex's eager-discovery mode before loading the
            # TypeScript module, then materialize its exact inventory before a
            # qualification generation takes its revision snapshot.
            DataProvider::setOptions(DPO_DisableOnDemandInitialization
                | DPO_EnableOnDemandActions);
            load_module("TypeScriptActionInterface");
            DataProvider::checkStaticInit();
            list<auto> inventory = call_static_method(
                "TypeScriptActionInterface", "getDiscoveryInventory");
            if (!inventory) {
                throw "TYPESCRIPT-PROVIDER-INVENTORY-EMPTY",
                    "TypeScript provider discovery produced no exact app/action identities";
            }
            hash<auto> index = ProviderIndex::createDataProviderIndex(
                NOTHING, index_dir, <ProviderIndexCreateOptions>{
                # Release qualification must describe the installed module
                # set, not an ambient developer/runner source path.
                    "load_environment": False,
                });
            # Verify the returned core qualification explicitly as a second
            # release boundary; a legacy ProviderIndex must not pass merely
            # because it wrote a generic index.
            *hash<auto> qualification = index.summary.qualification;
            if (!qualification || !qualification.complete
                    || !qualification.apps || !qualification.actions) {
                throw "TYPESCRIPT-PROVIDER-INVENTORY-EMPTY",
                    "TypeScript provider discovery produced no qualified app/action inventory", {
                        "qualification": qualification,
                    };
            }
            hash<auto> report = {
                "schema_version": 1,
                "complete": True,
                "provenance": provenance,
                "index": index,
                "qualification": qualification,
            };
            writeReport(report_path, report);
            printf("Provider discovery qualification passed: %d apps, %d actions\n",
                qualification.apps.size(), qualification.actions.size());
        } catch (hash<ExceptionInfo> ex) {
            writeReport(report_path, {
                "schema_version": 1,
                "complete": False,
                "provenance": provenance,
                "error": {
                    "code": ex.err,
                    "description": ex.desc,
                    "argument": ex.arg,
                },
            });
            rethrow;
        }
    }

    private writeReport(string path, hash<auto> report) {
        string temporary = path + ".tmp." + get_random_string(12);
        on_exit unlink(temporary);
        File file();
        file.open2(temporary, O_CREAT | O_EXCL | O_WRONLY, 0644);
        file.write(make_json(report, JGF_ADD_FORMATTING) + "\n");
        file.close();
        rename(temporary, path);
    }
}
