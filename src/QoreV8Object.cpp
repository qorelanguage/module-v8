/* -*- mode: c++; indent-tabs-mode: nil -*- */
/*
    QoreV8Object.cpp

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

#include "QoreV8Object.h"
#include "QoreV8Program.h"

#include <climits>

QoreV8Object::QoreV8Object(QoreV8Program* pgm, v8::Local<v8::Object> obj) : pgm(pgm) {
    pgm->weakRef();
    this->obj.Reset(pgm->getIsolate(), obj);
}

QoreV8Object::~QoreV8Object() {
    obj.Reset();
    pgm->weakDeref();
}

QoreHashNode* QoreV8Object::toHash(QoreV8ProgramHelper& v8h) const {
    ExceptionSink* xsink = v8h.getExceptionSink();
    ReferenceHolder<QoreHashNode> h(new QoreHashNode(autoTypeInfo), xsink);
    v8::Local<v8::Object> obj = get();
    v8::MaybeLocal<v8::Array> maybe_props = obj->GetPropertyNames(v8h.getContext());
    if (maybe_props.IsEmpty()) {
        v8h.checkException();
        return h.release();
    }
    v8::Local<v8::Array> props = maybe_props.ToLocalChecked();
    for (uint32_t i = 0, e = props->Length(); i < e; ++i) {
        v8::MaybeLocal<v8::Value> key = props->Get(v8h.getContext(), i);
        if (key.IsEmpty()) {
            if (v8h.checkException()) {
                return nullptr;
            }
            continue;
        }
        v8::Local<v8::Value> k = key.ToLocalChecked();
        ValueHolder qk(v8h.getProgram()->getQoreValue(xsink, k), xsink);
        if (*xsink) {
            if (v8h.checkException()) {
                return nullptr;
            }
            continue;
        }
        assert(qk->getType() == NT_STRING);

        v8::MaybeLocal<v8::Value> value = obj->Get(v8h.getContext(), k);
        if (value.IsEmpty()) {
            if (v8h.checkException()) {
                return nullptr;
            }
            h->setKeyValue(qk->get<const QoreStringNode>()->c_str(), QoreValue(), xsink);
            assert(!*xsink);
            continue;
        }
        v8::Local<v8::Value> v = value.ToLocalChecked();
        ValueHolder qv(v8h.getProgram()->getQoreValue(xsink, v), xsink);
        h->setKeyValue(qk->get<const QoreStringNode>()->c_str(), qv.release(), xsink);
        assert(!*xsink);
    }
    return h.release();
}

bool QoreV8Object::isCallable(QoreV8ProgramHelper& v8h) const {
    return get()->IsCallable();
}

bool QoreV8Object::isConstructor(QoreV8ProgramHelper& v8h) const {
    return get()->IsConstructor();
}

v8::Local<v8::Object> QoreV8Object::get() const {
    return obj.Get(pgm->getIsolate());
}

v8::Local<v8::Value> QoreV8Object::get(ExceptionSink* xsink, v8::Isolate* isolate) const {
    QoreV8ProgramHelper ph(xsink, pgm);
    if (!ph) {
        return v8::Null(isolate);
    }
    return obj.Get(pgm->getIsolate());
}

v8::Local<v8::Value> QoreV8Object::getV8KeyValue(QoreV8ProgramHelper& v8h, const char* key) const {
    v8::Isolate* isolate = pgm->getIsolate();

    v8::MaybeLocal<v8::String> m_key = v8::String::NewFromUtf8(isolate, key, v8::NewStringType::kNormal);
    if (m_key.IsEmpty()) {
        v8h.checkException();
        return v8::Null(isolate);
    }

    v8::EscapableHandleScope handle_scope(isolate);

    v8::MaybeLocal<v8::Value> m_val = get()->Get(v8h.getContext(), m_key.ToLocalChecked());
    if (m_val.IsEmpty()) {
        v8h.checkException();
        return v8::Null(isolate);
    }

    return handle_scope.Escape(m_val.ToLocalChecked());
}

QoreValue QoreV8Object::getKeyValue(QoreV8ProgramHelper& v8h, const char* key) {
    v8::MaybeLocal<v8::String> m_key = v8::String::NewFromUtf8(pgm->getIsolate(), key, v8::NewStringType::kNormal);
    if (m_key.IsEmpty()) {
        v8h.checkException();
        return QoreValue();
    }
    v8::MaybeLocal<v8::Value> m_val = get()->Get(v8h.getContext(), m_key.ToLocalChecked());
    if (m_val.IsEmpty()) {
        v8h.checkException();
        return QoreValue();
    }
    return pgm->getQoreValue(v8h.getExceptionSink(), m_val.ToLocalChecked());
}

QoreValue QoreV8Object::getIndexValue(QoreV8ProgramHelper& v8h, int64 i) {
    ExceptionSink* xsink = v8h.getExceptionSink();
    if (i < 0 || i >= UINT_MAX) {
        xsink->raiseException("JAVASCRIPT-ERROR", "Invalid array offset passed: " QLLD, i);
        return QoreValue();
    }
    v8::MaybeLocal<v8::Value> m_val = get()->Get(v8h.getContext(), (uint32_t)i);
    if (m_val.IsEmpty()) {
        v8h.checkException();
        return QoreValue();
    }
    return pgm->getQoreValue(xsink, m_val.ToLocalChecked());
}

QoreValue QoreV8Object::callAsFunction(QoreV8ProgramHelper& v8h, const QoreValue js_this, size_t offset,
        const QoreListNode* args) {
    ExceptionSink* xsink = v8h.getExceptionSink();
    QoreV8Program* pgm = v8h.getProgram();

    // JavaScript "this" object
    v8::Local<v8::Object> self = get();
    if (!self->IsFunction()) {
        xsink->raiseException("JAVASCRIPT-ERROR", "This object cannot be called as a function");
        return QoreValue();
    }

    v8::Local<v8::Value> recv = pgm->getV8Value(js_this, xsink);
    if (*xsink) {
        return QoreValue();
    }
    ssize_t size = (args ? args->size() : 0) - offset;
    if (size < 0) {
        size = 0;
    }
    std::unique_ptr<v8::Local<v8::Value>[]> argv(new v8::Local<v8::Value>[size]);
    v8::Local<v8::Value> v0;
    if (size) {
        ConstListIterator i(args, offset - 1);
        while (i.next()) {
            v0 = pgm->getV8Value(i.getValue(), xsink);
            if (*xsink) {
                return QoreValue();
            }
            argv[i.index() - offset] = v0;
            //printd(5, "QoreV8Object::callAsFunction() arg %d/%d: %s\n", (int)(i.index() - offset), (int)size,
            //    i.getValue().getFullTypeName());
        }
    }
    //printd(5, "QoreV8Object::callAsFunction() input args: %d offset: %d argc: %d recv: '%s'\n", (int)args->size(),
    //    (int)offset, (int)size, js_this.getFullTypeName());

    v8::Local<v8::Context> ctxt = v8h.getContext();

    v8::MaybeLocal<v8::Value> rv = self->CallAsFunction(ctxt, recv, (int)size, argv.get());
    if (rv.IsEmpty()) {
        v8h.checkException();
        return QoreValue();
    }
    return pgm->getQoreValue(xsink, rv.ToLocalChecked());
}
