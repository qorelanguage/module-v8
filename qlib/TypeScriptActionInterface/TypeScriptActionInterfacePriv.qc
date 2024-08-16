# -*- mode: qore; indent-tabs-mode: nil -*-
#! Qore TypeScriptActionInterface module definition

/*  TypeScriptActionInterfacePriv.qc Copyright 2024 Qore Technologies, s.r.o.

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

#! Private namespace for the TypeScriptActionInterface module
namespace TypeScriptActionInterfacePriv {
#! Internal interface class
class TypeScriptActionInterfacePriv {
    private {
        #! Static storage for JavaScriptProgram objects for app / actions, to ensure they do not go out of scope
        static hash<string, JavaScriptProgram> pstore;
    }

    static init() {
        *string scripts = ENV.QORE_TYPESCRIPT_ACTION_SCRIPTS;
        if (scripts.val()) {
            foreach string path in (scripts.split(":")) {
                try {
                    JavaScriptProgram js(File::readTextFile(path), path);
                    JavaScriptObject obj = js.run();
                    obj.appActionInit(TypeScriptActionInterface::Api);
                    pstore{js.uniqueHash()} = js;
                } catch (hash<ExceptionInfo> ex) {
                    stderr.printf("Error loading TypeScript action script %y: %s", path, get_exception_string(ex));
                }
            }
        }
    }
}
}