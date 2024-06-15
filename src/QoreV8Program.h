/* -*- mode: c++; indent-tabs-mode: nil -*- */
/*
    QoreV8Program.h

    Qore Programming Language

    Copyright (C) 2024 Qore Technologies, s.r.o.

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

    Note that the Qore library is released under a choice of three open-source
    licenses: MIT (as above), LGPL 2+, or GPL 2+; see README-LICENSE for more
    information.
*/

#ifndef _QORE_QOREV8PROGRAM

#define _QORE_QOREV8PROGRAM

#include "v8-module.h"

#include <set>
#include <map>
#include <memory>

class QoreV8Program : public AbstractQoreProgramExternalData {
public:
    DLLLOCAL QoreV8Program(const QoreString& source_code, const QoreString& source_label, ExceptionSink* xsink);

    DLLLOCAL QoreV8Program(const QoreV8Program& old, QoreProgram* qpgm);

    DLLLOCAL virtual void doDeref() {
        printd(5, "QoreV8Program::doDeref() this: %p\n", this);
        ExceptionSink xsink;
        deleteIntern(&xsink);
        if (xsink) {
            throw QoreXSinkException(xsink);
        }
        delete this;
    }

    DLLLOCAL void destructor(ExceptionSink* xsink) {
        deleteIntern(xsink);
    }

    DLLLOCAL virtual AbstractQoreProgramExternalData* copy(QoreProgram* pgm) const {
        return new QoreV8Program(*this, pgm);
    }

    DLLLOCAL QoreValue run(ExceptionSink* xsink);

    //! Call the function and return the result
    DLLLOCAL QoreValue callFunction(ExceptionSink* xsink, const QoreString& func_name, const QoreListNode* args,
        size_t arg_offset = 0);

    //! Returns a Qore value for the given V8 value
    DLLLOCAL QoreValue getQoreValue(ExceptionSink* xsink, v8::Local<v8::Value> val);

    //! Returns a V8 value for the given Qore value
    DLLLOCAL v8::Local<v8::Value> getV8Value(const QoreValue val, ExceptionSink* xsink);

    //! Checks if a JavaScript exception has been thrown and throws the corresponding Qore exception
    DLLLOCAL int checkException(ExceptionSink* xsink, const v8::TryCatch& tryCatch) const;

protected:
    v8::Isolate* isolate = nullptr;
    v8::Isolate::CreateParams create_params;
    v8::Global<v8::Context> context;
    v8::Global<v8::Script> script;
    v8::Global<v8::String> label;

    //! protected constructor
    DLLLOCAL QoreV8Program();

    DLLLOCAL void deleteIntern(ExceptionSink* xsink);

    class QoreV8CallStack : public QoreCallStack {
    public:
        DLLLOCAL QoreV8CallStack(const QoreV8Program& v8pgm, const v8::TryCatch& tryCatch,
                v8::Local<v8::Context> context, v8::Local<v8::Message> msg, QoreExternalProgramLocationWrapper& loc);
    };
};

class QoreV8ProgramData : public AbstractPrivateData, public QoreV8Program {
public:
   DLLLOCAL QoreV8ProgramData(const QoreString& source_code, const QoreString& source_label, ExceptionSink* xsink)
        : QoreV8Program(source_code, source_label, xsink) {
        //printd(5, "QoreV8ProgramData::QoreV8ProgramData() this: %p\n", this);
    }

    using AbstractPrivateData::deref;
    DLLLOCAL virtual void deref(ExceptionSink* xsink) {
        if (ROdereference()) {
            deleteIntern(xsink);
        }
    }

private:
    DLLLOCAL ~QoreV8ProgramData() {
    }
};

#endif