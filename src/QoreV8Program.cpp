/* -*- mode: c++; indent-tabs-mode: nil -*- */
/** @file QoreV8Program.cpp defines the QoreV8Program class */
/*
    QoreV8Program.qpp

    Qore Programming Language

    Copyright 2024 Qore Technologies, s.r.o.

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

#include "QoreV8Program.h"

#include <vector>
#include <string>

QoreV8Program::QoreV8Program(const QoreString& source_code, const QoreString& source_label, int start,
        ExceptionSink* xsink) {
    printd(5, "QoreV8Program::QoreV8Program() this: %p\n", this);

    // Create a new Isolate
    create_params.array_buffer_allocator = v8::ArrayBuffer::Allocator::NewDefaultAllocator();
    isolate = v8::Isolate::New(create_params);

    // Create a new context
    v8::Local<v8::Context> local_context = v8::Context::New(isolate);
    context.Reset(isolate, local_context);
}

void QoreV8Program::deleteIntern(ExceptionSink* xsink) {
    if (isolate) {
        context.Reset();
        // Dispose the isolate
        isolate->Dispose();
        delete create_params.array_buffer_allocator;
    }
}

QoreValue QoreV8Program::run(ExceptionSink* xsink) {
    assert(false);
    return QoreValue();
}

QoreValue QoreV8Program::getQoreValue(ExceptionSink* xsink, v8::Local<v8::Value> val) {
    assert(false);
    v8::Local<v8::Context> context = v8::Local<v8::Context>::New(isolate, this->context);

    if (val->IsInt32() || val->IsUint32()) {
        v8::MaybeLocal<v8::Int32> i = val->ToInt32(context);
        if (i.IsEmpty()) {
            return QoreValue();
        }
        return (int64)*i.ToLocalChecked();
    }
    if (val->IsUint32()) {
        v8::MaybeLocal<v8::Uint32> i = val->ToUint32(context);
        if (i.IsEmpty()) {
            return QoreValue();
        }
        return (int64)*i.ToLocalChecked();
    }

    if (val->IsBigInt()) {
        v8::MaybeLocal<v8::BigInt> i = val->ToBigInt(context);
        if (i.IsEmpty()) {
            return QoreValue();
        }
        v8::Local<v8::BigInt> bi = i.ToLocalChecked();
        bool lossless = true;
        int64_t v = bi->Int64Value(&lossless);
        if (!lossless) {
            v8::Local<v8::String> str = bi.As<v8::String>();
            // Convert the result to an UTF8 string
            v8::String::Utf8Value utf8(isolate, str);
            return new QoreNumberNode(*utf8);
        }
    }

    v8::Local<v8::String> str = val->TypeOf(isolate);
    // Convert the result to an UTF8 string
    v8::String::Utf8Value utf8(isolate, str);
    xsink->raiseException("V8-TYPE-ERROR", "Cannot convert v8 '%s' value to a Qore value", *utf8);
    return QoreValue();
}

v8::Local<v8::Value> QoreV8Program::getV8Value(QoreValue val, ExceptionSink* xsink) {
    //printd(5, "QoreV8Program::getV8Value() type '%s'\n", val.getFullTypeName());
    // We will be creating temporary handles so we use a handle scope.
    v8::EscapableHandleScope handle_scope(isolate);

    /*
    // Set the isolate for all operations executed within the local scope
    v8::Isolate::Scope isolate_scope(isolate);
    // Create a stack-allocated handle scope.
    v8::HandleScope handle_scope(isolate);
    // Create a new context.
    v8::Local<v8::Context> context = v8::Context::New(isolate);
    // Enter the context for compiling and running the hello world script.
    v8::Context::Scope context_scope(context);
    */

    switch (val.getType()) {
        case NT_NOTHING:
        case NT_NULL:
            return v8::Null(isolate);

        default:
            xsink->raiseException("V8-TYPE-ERROR", "Cannot convert Qore values of type '%s' to a V8 value",
                val.getFullTypeName());
    }


    return v8::Null(isolate);
}

QoreValue QoreV8Program::callFunction(ExceptionSink* xsink, const QoreString& func_name, const QoreListNode* args,
        size_t arg_offset) {
    TempEncodingHelper fname(func_name, QCS_UTF8, xsink);
    if (*xsink) {
        xsink->appendLastDescription(" (while processing the \"func_name\" argument)");
        return QoreValue();
    }

    assert(false);
    return QoreValue();
}
