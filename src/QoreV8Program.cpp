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
#include <memory>
#include <climits>

QoreV8Program::QoreV8Program() {
    printd(5, "QoreV8Program::QoreV8Program() this: %p\n", this);
    // Create a new Isolate
    create_params.array_buffer_allocator = v8::ArrayBuffer::Allocator::NewDefaultAllocator();
    isolate = v8::Isolate::New(create_params);

    // Create a new context
    v8::Isolate::Scope isolate_scope(isolate);
    v8::HandleScope handle_scope(isolate);
    v8::Local<v8::Context> local_context = v8::Context::New(isolate);
    context.Reset(isolate, local_context);
}

QoreV8Program::QoreV8Program(const QoreString& source_code, const QoreString& source_label, ExceptionSink* xsink)
        : QoreV8Program() {
    assert(source_code.getEncoding() == QCS_UTF8);
    assert(source_label.getEncoding() == QCS_UTF8);
    const v8::TryCatch tryCatch(isolate);
    v8::Isolate::Scope isolate_scope(isolate);
    v8::HandleScope handle_scope(isolate);
    v8::MaybeLocal<v8::String> m_label = v8::String::NewFromUtf8(isolate, source_label.c_str(),
        v8::NewStringType::kNormal);
    if (m_label.IsEmpty()) {
        checkException(xsink, tryCatch);
        return;
    }
    v8::Local<v8::String> lstr = m_label.ToLocalChecked();
    v8::ScriptOrigin origin(isolate, lstr);

    v8::MaybeLocal<v8::String> m_src = v8::String::NewFromUtf8(isolate, source_code.c_str(), v8::NewStringType::kNormal);
    if (m_src.IsEmpty()) {
        checkException(xsink, tryCatch);
        return;
    }

    v8::Local<v8::String> src = m_src.ToLocalChecked();
    v8::Local<v8::Context> context = this->context.Get(isolate);
    v8::Context::Scope context_scope(context);
    v8::MaybeLocal<v8::Script> m_script = v8::Script::Compile(context, src);
    if (m_script.IsEmpty()) {
        checkException(xsink, tryCatch);
        return;
    }
    label.Reset(isolate, lstr);
    script.Reset(isolate, m_script.ToLocalChecked());
}

QoreV8Program::QoreV8Program(const QoreV8Program& old, QoreProgram* qpgm) : QoreV8Program() {
}

void QoreV8Program::deleteIntern(ExceptionSink* xsink) {
    if (isolate) {
        script.Reset();
        label.Reset();
        context.Reset();
        // Dispose the isolate
        isolate->Dispose();
        delete create_params.array_buffer_allocator;
        isolate = nullptr;
    }
}

QoreValue QoreV8Program::run(ExceptionSink* xsink) {
    // Run the script to get the result
    v8::Locker locker(isolate);
    v8::Isolate::Scope isolate_scope(isolate);
    v8::HandleScope handle_scope(isolate);
    const v8::TryCatch tryCatch(isolate);
    v8::ScriptOrigin origin(isolate, label.Get(isolate));
    v8::Local<v8::Script> script = this->script.Get(isolate);
    v8::Local<v8::Context> context = this->context.Get(isolate);
    v8::Context::Scope context_scope(context);
    v8::MaybeLocal<v8::Value> m_rv = script->Run(context);
    if (m_rv.IsEmpty()) {
        checkException(xsink, tryCatch);
        return QoreValue();
    }
    return getQoreValue(xsink, m_rv.ToLocalChecked());
}

int QoreV8Program::checkException(ExceptionSink* xsink, const v8::TryCatch& tryCatch) const {
    if (tryCatch.HasCaught()) {
        v8::Local<v8::Value> ex = tryCatch.Exception();
        if (!*ex) {
            xsink->raiseException("JAVASCRIPT-EXCEPTION", "empty exception thrown at unknown source location");
            return -1;
        }

        // convert to a string
        v8::String::Utf8Value exception(isolate, ex);

        v8::Local<v8::Message> msg = tryCatch.Message();
        if (msg.IsEmpty()) {
            xsink->raiseException("JAVASCRIPT-EXCEPTION", new QoreStringNode(*exception));
            return -1;
        }

        SimpleRefHolder<QoreStringNode> desc(new QoreStringNode(*exception));
        desc->concat('\n');

        v8::Local<v8::Context> context(isolate->GetCurrentContext());

        // Print wavy underline (GetUnderline is deprecated)
        int start = msg->GetStartColumn(context).FromJust();
        for (int i = 0; i < start; ++i) {
            desc->concat(' ');
        }
        int end = msg->GetEndColumn(context).FromJust();
        for (int i = start; i < end; i++) {
            desc->concat('^');
        }

        // add Java call stack to Qore call stack
        QoreExternalProgramLocationWrapper loc;
        QoreV8CallStack stack(*this, tryCatch, context, msg, loc);

        xsink->raiseExceptionArg(loc.get(), "JAVASCRIPT-EXCEPTION", QoreValue(), new QoreStringNode(desc), stack);
        return -1;
    }
    return 0;
}

QoreValue QoreV8Program::getQoreValue(ExceptionSink* xsink, v8::Local<v8::Value> val) {
    v8::Local<v8::Context> context = this->context.Get(isolate);

    const v8::TryCatch tryCatch(isolate);
    if (val->IsInt32() || val->IsUint32()) {
        v8::MaybeLocal<v8::Int32> i = val->ToInt32(context);
        if (i.IsEmpty()) {
            checkException(xsink, tryCatch);
            return QoreValue();
        }
        return (int64)*i.ToLocalChecked();
    }
    if (val->IsUint32()) {
        v8::MaybeLocal<v8::Uint32> i = val->ToUint32(context);
        if (i.IsEmpty()) {
            checkException(xsink, tryCatch);
            return QoreValue();
        }
        return (int64)*i.ToLocalChecked();
    }

    if (val->IsBigInt()) {
        v8::MaybeLocal<v8::BigInt> i = val->ToBigInt(context);
        if (i.IsEmpty()) {
            checkException(xsink, tryCatch);
            return QoreValue();
        }
        v8::Local<v8::BigInt> bi = i.ToLocalChecked();
        bool lossless = true;
        int64_t v = bi->Int64Value(&lossless);
        if (lossless) {
            return v;
        }
        // Convert the result to an UTF8 string
        v8::String::Utf8Value utf8(isolate, val);
        return new QoreNumberNode(*utf8);
    }

    if (val->IsBoolean()) {
        v8::Local<v8::Boolean> b = val->ToBoolean(isolate);
        return QoreValue(b->Value());
    }

    if (val->IsString()) {
        v8::String::Utf8Value str(isolate, val);
        return new QoreStringNode(*str, QCS_UTF8);
    }

    if (val->IsNumber()) {
        v8::MaybeLocal<v8::Number> n = val->ToNumber(context);
        if (n.IsEmpty()) {
            checkException(xsink, tryCatch);
            return QoreValue();
        }
        // returns a double
        return QoreValue(n.ToLocalChecked()->Value());
    }

    if (val->IsObject()) {
        v8::MaybeLocal<v8::Object> o = val->ToObject(context);
        if (o.IsEmpty()) {
            checkException(xsink, tryCatch);
            return QoreValue();
        }
        ReferenceHolder<QoreHashNode> h(new QoreHashNode(autoTypeInfo), xsink);
        v8::Local<v8::Object> obj = o.ToLocalChecked();
        v8::MaybeLocal<v8::Array> maybe_props = obj->GetPropertyNames(context);
        if (maybe_props.IsEmpty()) {
            return h.release();
        }
        v8::Local<v8::Array> props = maybe_props.ToLocalChecked();
        for (uint32_t i = 0, e = props->Length(); i < e; ++i) {
            v8::MaybeLocal<v8::Value> key = props->Get(context, i);
            if (key.IsEmpty()) {
                checkException(xsink, tryCatch);
                return h.release();
            }
            v8::Local<v8::Value> k = key.ToLocalChecked();
            v8::MaybeLocal<v8::Value> value = obj->Get(context, k);
            if (value.IsEmpty()) {
                checkException(xsink, tryCatch);
                return h.release();
            }
            v8::Local<v8::Value> v = value.ToLocalChecked();
            ValueHolder qk(getQoreValue(xsink, k), xsink);
            if (*xsink) {
                checkException(xsink, tryCatch);
                return QoreValue();
            }
            assert(qk->getType() == NT_STRING);
            ValueHolder qv(getQoreValue(xsink, v), xsink);
            h->setKeyValue(qk->get<const QoreStringNode>()->c_str(), qv.release(), xsink);
            assert(!*xsink);
        }
        return h.release();
    }

    if (val->IsArray()) {
        v8::Local<v8::Array> array = v8::Local<v8::Array>::Cast(val);
        ReferenceHolder<QoreListNode> rv(new QoreListNode(autoTypeInfo), xsink);
        for (uint32_t i = 0, e = array->Length(); i < e; ++i) {
            v8::MaybeLocal<v8::Value> val = array->Get(context, i);
            if (val.IsEmpty()) {
                rv->push(QoreValue(), xsink);
                continue;
            }
            v8::Local<v8::Value> v = val.ToLocalChecked();
            ValueHolder qv(getQoreValue(xsink, v), xsink);
            if (*xsink) {
                return QoreValue();
            }
            rv->push(qv.release(), xsink);
        }
        return rv.release();
    }

    if (val->IsNullOrUndefined()) {
        return &Null;
    }

    v8::Local<v8::String> str = val->TypeOf(isolate);
    // Convert the result to an UTF8 string
    v8::String::Utf8Value utf8(isolate, str);
    xsink->raiseException("JAVASCRIPT-TYPE-ERROR", "Cannot convert v8 '%s' value to a Qore value", *utf8);
    return QoreValue();
}

v8::Local<v8::Value> QoreV8Program::getV8Value(const QoreValue val, ExceptionSink* xsink) {
    //printd(5, "QoreV8Program::getV8Value() type '%s'\n", val.getFullTypeName());
    // We will be creating temporary handles so we use a handle scope.
    //v8::EscapableHandleScope handle_scope(isolate);

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

    v8::Isolate::Scope isolate_scope(isolate);
    v8::HandleScope handle_scope(isolate);

    const v8::TryCatch tryCatch(isolate);

    switch (val.getType()) {
        case NT_NOTHING:
        case NT_NULL:
            return v8::Null(isolate);

        case NT_INT: {
            int64 v = val.getAsBigInt();
            // see if it's an int32_t
            if (v >= INT_MIN && v < INT_MAX) {
                return v8::Integer::New(isolate, (int32_t)v);
            }
            if (v >=0 && v < UINT_MAX) {
                return v8::Integer::NewFromUnsigned(isolate, (int32_t)v);
            }
            return v8::BigInt::New(isolate, v);
        }

        case NT_STRING: {
            v8::MaybeLocal<v8::String> rv = v8::String::NewFromUtf8(isolate, val.get<const QoreStringNode>()->c_str(),
                v8::NewStringType::kNormal);
            if (rv.IsEmpty()) {
                checkException(xsink, tryCatch);
                return v8::Null(isolate);
            }
            return rv.ToLocalChecked();
        }

        case NT_DATE: {
            // format the date as an ISO-8601 string
            QoreString str;
            val.get<const DateTimeNode>()->format(str, "IF");
            v8::MaybeLocal<v8::String> rv = v8::String::NewFromUtf8(isolate, str.c_str(), v8::NewStringType::kNormal);
            if (rv.IsEmpty()) {
                checkException(xsink, tryCatch);
                return v8::Null(isolate);
            }
            return rv.ToLocalChecked();
        }

        case NT_BOOLEAN: {
            return v8::Boolean::New(isolate, val.getAsBool());
        }

        case NT_FLOAT: {
            return v8::Number::New(isolate, val.getAsFloat());
        }

        case NT_NUMBER: {
            return v8::Number::New(isolate, val.get<const QoreNumberNode>()->getAsFloat());
        }

        case NT_BINARY: {
            QoreString str(val.get<const BinaryNode>());
            v8::MaybeLocal<v8::String> rv = v8::String::NewFromUtf8(isolate, str.c_str(), v8::NewStringType::kNormal);
            if (rv.IsEmpty()) {
                checkException(xsink, tryCatch);
                return v8::Null(isolate);
            }
            return rv.ToLocalChecked();
        }

        case NT_LIST: {
            const QoreListNode* l = val.get<const QoreListNode>();
            std::unique_ptr<v8::Local<v8::Value>> elements(new v8::Local<v8::Value>[l->size()]);
            ConstListIterator i(l);
            while (i.next()) {
                elements.get()[i.index()] = getV8Value(i.getValue(), xsink);
                if (*xsink) {
                    return v8::Null(isolate);
                }
            }
            return v8::Array::New(isolate, elements.release(), l->size());
        }

        case NT_HASH: {
            const QoreHashNode* h = val.get<const QoreHashNode>();
            v8::Local<v8::Context> context = this->context.Get(isolate);
            v8::Local<v8::Map> m = v8::Map::New(isolate);
            ConstHashIterator i(h);
            while (i.next()) {
                v8::Local<v8::Value> v = getV8Value(i.get(), xsink);
                if (*xsink) {
                    return v8::Null(isolate);
                }
                v8::MaybeLocal<v8::String> key = v8::String::NewFromUtf8(isolate, i.getKey(),
                    v8::NewStringType::kNormal);
                if (key.IsEmpty()) {
                    checkException(xsink, tryCatch);
                    return v8::Null(isolate);
                }
                v8::MaybeLocal<v8::Map> maybe_map = m->Set(context, key.ToLocalChecked(), v);
                if (maybe_map.IsEmpty()) {
                    return v8::Null(isolate);
                }
            }
            return m;
        }

        default:
            xsink->raiseException("JAVASCRIPT-TYPE-ERROR", "Cannot convert Qore values of type '%s' to a V8 value",
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
