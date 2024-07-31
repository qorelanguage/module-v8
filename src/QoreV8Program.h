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
    friend class QoreV8ProgramHelper;
    friend class QoreV8ProgramOperationHelper;
    friend class QoreV8Object;
public:
    DLLLOCAL QoreV8Program(const QoreString& source_code, const QoreString& source_label, ExceptionSink* xsink);

    DLLLOCAL QoreV8Program(const QoreV8Program& old, QoreProgram* qpgm);

    DLLLOCAL ~QoreV8Program() {
        //printd(5, "QoreV8Program::~QoreV8Program() this: %p\n", this);
        script.Reset();
        label.Reset();
        context.Reset();
        if (isolate) {
            // Dispose the isolate
            isolate->Dispose();
        }
        delete create_params.array_buffer_allocator;
    }

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

    //! Returns a Qore value for the given V8 value
    DLLLOCAL QoreValue getQoreValue(ExceptionSink* xsink, v8::Local<v8::Value> val);

    //! Returns a V8 value for the given Qore value
    DLLLOCAL v8::Local<v8::Value> getV8Value(const QoreValue val, ExceptionSink* xsink);

    //! Checks if a JavaScript exception has been thrown and throws the corresponding Qore exception
    DLLLOCAL int checkException(ExceptionSink* xsink, const v8::TryCatch& tryCatch) const;

    //! Returns the global proxy object
    DLLLOCAL QoreObject* getGlobal(ExceptionSink* xsink);

    //! Returns the pointer to the isolate
    v8::Isolate* getIsolate() const {
        return isolate;
    }

    DLLLOCAL void weakRef() const {
        weakRefs.ROreference();
    }

    DLLLOCAL void weakDeref() {
        if (weakRefs.ROdereference()) {
            delete this;
        }
    }

    //! Sets the "save object callback" for %Qore values managed by JavaScript objects
    DLLLOCAL void setSaveReferenceCallback(const ResolvedCallReferenceNode* save_ref_callback) {
        //printd(5, "QorePythonProgram::setSaveObjectCallback() this: %p old: %p new: %p\n", this,
        //  *this->save_object_callback, save_object_callback);
        this->save_ref_callback = save_ref_callback ? save_ref_callback->refRefSelf() : nullptr;
    }

    //! Returns the "save object callback" for %Qore values managed by JavaScript objects
    DLLLOCAL ResolvedCallReferenceNode* getSaveReferenceCallback() const {
        return *save_ref_callback;
    }

    //! Raises an exception in the given isolate from the Qore exception
    DLLLOCAL static void raiseV8Exception(ExceptionSink& xsink, v8::Isolate* isolate);

protected:
    v8::Isolate* isolate = nullptr;
    v8::Isolate::CreateParams create_params;
    v8::Global<v8::Context> context;
    v8::Global<v8::Script> script;
    v8::Global<v8::String> label;

    QoreProgram* qpgm = getProgram();
    QoreReferenceCounter weakRefs;
    QoreThreadLock m;

    // call reference for saving Qore references
    mutable ReferenceHolder<ResolvedCallReferenceNode> save_ref_callback;

    unsigned opcount = 0;
    bool to_destroy = false;
    bool valid = false;

    //! protected constructor
    DLLLOCAL QoreV8Program();

    DLLLOCAL void deleteIntern(ExceptionSink* xsink);

    DLLLOCAL int saveQoreReference(const QoreValue& rv, ExceptionSink& xsink);

    DLLLOCAL int saveQoreReferenceDefault(const QoreValue& rv, ExceptionSink& xsink);
};

class QoreV8CallStack : public QoreCallStack {
public:
    DLLLOCAL QoreV8CallStack(v8::Isolate* isolate, const v8::TryCatch& tryCatch,
            v8::Local<v8::Context> context, v8::Local<v8::Message> msg,
            QoreExternalProgramLocationWrapper& loc);
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
            weakDeref();
        }
    }

private:
    DLLLOCAL virtual ~QoreV8ProgramData() {
    }
};

class QoreV8ProgramHelper {
public:
    DLLLOCAL QoreV8ProgramHelper(ExceptionSink* xsink, QoreV8Program* pgm, bool silent = false) :
            locker(pgm->isolate),
            isolate_scope(pgm->isolate),
            handle_scope(pgm->isolate),
            tryCatch(pgm->isolate),
            origin(pgm->isolate, pgm->label.Get(pgm->isolate)),
            context(pgm->context.Get(pgm->isolate)),
            context_scope(context) {
        AutoLocker al(pgm->m);
        if (!pgm->valid) {
            if (!silent) {
                xsink->raiseException("JAVASCRIPT-PROGRAM-ERROR", "The given JavaScriptProgram has been destroyed "
                    "and can no longer be accessed");
            }
            return;
        }
        if (pgm->to_destroy) {
            if (!silent) {
                xsink->raiseException("JAVASCRIPT-PROGRAM-ERROR", "The given JavaScriptProgram has been marked for "
                    "destruction and can no longer be accessed");
            }
            return;
        }
        ++pgm->opcount;
        this->xsink = xsink;
        this->pgm = pgm;
    }

    DLLLOCAL ~QoreV8ProgramHelper() {
        if (pgm) {
            AutoLocker al(pgm->m);
            if (!--pgm->opcount && pgm->to_destroy) {
                pgm->destructor(xsink);
            }
        }
    }

    //! Checks if a JavaScript exception has been thrown and throws the corresponding Qore exception
    DLLLOCAL int checkException() const {
        return pgm->checkException(xsink, tryCatch);
    }

    DLLLOCAL operator bool() const {
        return (bool) pgm;
    }

    DLLLOCAL QoreV8Program* getProgram() {
        return pgm;
    }

    DLLLOCAL v8::Local<v8::Context> getContext() {
        return context;
    }

    DLLLOCAL v8::Isolate* getIsolate() {
        return pgm->isolate;
    }

    DLLLOCAL ExceptionSink* getExceptionSink() {
        return xsink;
    }

private:
    QoreV8Program* pgm = nullptr;
    ExceptionSink* xsink = nullptr;

    v8::Locker locker;
    v8::Isolate::Scope isolate_scope;
    v8::HandleScope handle_scope;
    v8::TryCatch tryCatch;
    v8::ScriptOrigin origin;
    v8::Local<v8::Context> context;
    v8::Context::Scope context_scope;
};

#endif