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

#include "QC_JavaScriptObject.h"
#include "QoreV8Program.h"

#include <vector>
#include <string>
#include <memory>
#include <climits>

QoreV8Program::QoreV8Program() : save_ref_callback(nullptr) {
    printd(5, "QoreV8Program::QoreV8Program() this: %p\n", this);
    // Create a new Isolate
    create_params.array_buffer_allocator = v8::ArrayBuffer::Allocator::NewDefaultAllocator();
    isolate = v8::Isolate::New(create_params);

    // Create a new context
    v8::Isolate::Scope isolate_scope(isolate);
    v8::HandleScope handle_scope(isolate);
    v8::Local<v8::Context> local_context = v8::Context::New(isolate);
    context.Reset(isolate, local_context);
    valid = true;
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
    //printd(5, "QoreV8Program::QoreV8Program() using label '%s'\n", source_label.c_str());
    v8::MaybeLocal<v8::String> m_src = v8::String::NewFromUtf8(isolate, source_code.c_str(),
        v8::NewStringType::kNormal);
    if (m_src.IsEmpty()) {
        checkException(xsink, tryCatch);
        return;
    }

    v8::Local<v8::String> src = m_src.ToLocalChecked();
    v8::Local<v8::Context> context = this->context.Get(isolate);
    v8::Context::Scope context_scope(context);
    v8::MaybeLocal<v8::Script> m_script = v8::Script::Compile(context, src, &origin);
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
    AutoLocker al(m);
    if (opcount) {
        if (!to_destroy) {
            to_destroy = true;
        }
        return;
    }
    if (valid) {
        valid = false;
        if (to_destroy) {
            to_destroy = false;
        }
    }
    if (save_ref_callback) {
        save_ref_callback.release()->deref(xsink);
    }
}

int QoreV8Program::saveQoreReference(const QoreValue& rv, ExceptionSink& xsink) {
    {
        qore_type_t t = rv.getType();
        if (t != NT_OBJECT && t != NT_RUNTIME_CLOSURE && t != NT_FUNCREF) {
            return 0;
        }
    }

    //printd(5, "QorePythonProgram::saveQoreReference() this: %p val: %s soc: %p\n", this,
    //    rv.getFullTypeName(), *save_ref_callback);

    if (save_ref_callback) {
        ReferenceHolder<QoreListNode> args(new QoreListNode(autoTypeInfo), &xsink);
        args->push(rv.refSelf(), &xsink);
        save_ref_callback->execValue(*args, &xsink);
        if (xsink) {
            raiseV8Exception(xsink, isolate);
            return -1;
        }
        return 0;
    }

    return saveQoreReferenceDefault(rv, xsink);
}

int QoreV8Program::saveQoreReferenceDefault(const QoreValue& rv, ExceptionSink& xsink) {
    QoreHashNode* data = qpgm->getThreadData();
    assert(data);
    const char* domain_name;
    // get key name where to save the data if possible
    QoreValue v = data->getKeyValue("_v8_save");
    if (v.getType() != NT_STRING) {
        domain_name = "_v8_save";
    } else {
        domain_name = v.get<const QoreStringNode>()->c_str();
    }

    QoreValue kv = data->getKeyValue(domain_name);
    // ignore operation if domain exists but is not a list
    if (!kv || kv.getType() == NT_LIST) {
        QoreListNode* list;
        ReferenceHolder<QoreListNode> list_holder(&xsink);
        if (!kv) {
            // we need to assign list in data *after* we prepend the object to the list
            // in order to manage object counts
            list = new QoreListNode(autoTypeInfo);
            list_holder = list;
        } else {
            list = kv.get<QoreListNode>();
        }

        // prepend to list to ensure FILO destruction order
        list->splice(0, 0, rv, &xsink);
        if (!xsink && list_holder) {
            data->setKeyValue(domain_name, list_holder.release(), &xsink);
        }
        if (xsink) {
            raiseV8Exception(xsink, isolate);
            return -1;
        }
        //printd(5, "saveQoreReferenceDefault() domain: '%s' obj: %p %s\n", domain_name, rv.get<QoreObject>(),
        //    rv.get<QoreObject>()->getClassName());
    } else {
        //printd(5, "saveQoreReferenceDefault() NOT SAVING domain: '%s' HAS KEY v: %s (kv: %s)\n", domain_name,
        //    rv.getFullTypeName(), kv.getFullTypeName());
    }
    return 0;
}

QoreValue QoreV8Program::run(ExceptionSink* xsink) {
    QoreV8ProgramHelper v8h(xsink, this);
    if (*xsink) {
        return QoreValue();
    }

    v8::Local<v8::Script> script = this->script.Get(isolate);
    v8::MaybeLocal<v8::Value> m_rv = script->Run(v8h.getContext());
    if (m_rv.IsEmpty()) {
        v8h.checkException();
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

        v8::Local<v8::Context> context(isolate->GetCurrentContext());

        /*
        if (!desc->empty()) {
            desc->concat('\n');
        }
        // Print wavy underline (GetUnderline is deprecated)
        int start = msg->GetStartColumn(context).FromJust();
        for (int i = 0; i < start; ++i) {
            desc->concat(' ');
        }
        int end = msg->GetEndColumn(context).FromJust();
        for (int i = start; i < end; i++) {
            desc->concat('^');
        }
        */

        // add Java call stack to Qore call stack
        QoreExternalProgramLocationWrapper loc;
        QoreV8CallStack stack(isolate, tryCatch, context, msg, loc);

        xsink->raiseExceptionArg(loc.get(), "JAVASCRIPT-EXCEPTION", QoreValue(), desc.release(), stack);
        return -1;
    }
    return 0;
}

QoreValue QoreV8Program::getQoreValue(ExceptionSink* xsink, v8::Local<v8::Value> val) {
    v8::Local<v8::Context> context = this->context.Get(isolate);
    const v8::TryCatch tryCatch(isolate);
    if (val->IsInt32() || val->IsUint32()) {
        v8::MaybeLocal<v8::Integer> i = val->ToInteger(context);
        if (i.IsEmpty()) {
            checkException(xsink, tryCatch);
            return QoreValue();
        }
        int64 v = i.ToLocalChecked()->Value();
        //printd(5, "int: %d", (int)v);
        return v;
    }

    if (val->IsBigInt()) {
        v8::MaybeLocal<v8::BigInt> i = val->ToBigInt(context);
        if (i.IsEmpty()) {
            checkException(xsink, tryCatch);
            return QoreValue();
        }
        v8::Local<v8::BigInt> bi = i.ToLocalChecked();
        bool lossless = false;
        int64_t v = bi->Int64Value(&lossless);
        if (lossless) {
            return v;
        }
        // Convert the result to a UTF8 string
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
        double v = n.ToLocalChecked()->Value();
        //printd(5, "QoreV8Program::getQoreValue() Number: %g\n", v);
        return QoreValue(v);
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

    if (val->IsObject()) {
        v8::MaybeLocal<v8::Object> o = val->ToObject(context);
        if (o.IsEmpty()) {
            checkException(xsink, tryCatch);
            return QoreValue();
        }
        return new QoreObject(QC_JAVASCRIPTOBJECT, getProgram(), new QoreV8Object(this, o.ToLocalChecked()));
    }

    if (val->IsNullOrUndefined()) {
        return QoreValue();
    }

    v8::Local<v8::String> str = val->TypeOf(isolate);
    // Convert the result to an UTF8 string
    v8::String::Utf8Value utf8(isolate, str);
    xsink->raiseException("JAVASCRIPT-TYPE-ERROR", "Cannot convert v8 '%s' value to a Qore value", *utf8);
    return QoreValue();
}

void QoreV8Program::raiseV8Exception(ExceptionSink& xsink, v8::Isolate* isolate) {
    assert(xsink);
    QoreString err;
    QoreString desc;
    const QoreString* errstr = nullptr;
    const QoreString* descstr = nullptr;
    const QoreValue errv = xsink.getExceptionErr();
    const QoreValue descv = xsink.getExceptionDesc();
    if (errv.getType() == NT_STRING) {
        errstr = errv.get<const QoreStringNode>();
    } else {
        if (errv.getAsString(err, 0, &xsink)) {
            xsink.clear();
            err.set("UNKNOWN-EXCEPTION");
        }
        errstr = &err;
    }
    if (descv.getType() == NT_STRING) {
        descstr = descv.get<const QoreStringNode>();
    } else {
        if (descv.getAsString(desc, 0, &xsink)) {
            xsink.clear();
            desc.set("Unknown reason");
        }
        descstr = &desc;
    }

    QoreStringMaker str("%s: %s", errstr->c_str(), descstr->c_str());

    v8::MaybeLocal<v8::String> exstr = v8::String::NewFromUtf8(isolate, str.c_str(), v8::NewStringType::kNormal);
    if (!exstr.IsEmpty()) {
        isolate->ThrowException(exstr.ToLocalChecked());
    }
    xsink.clear();
}

struct QoreV8CallbackInfo {
    ResolvedCallReferenceNode* ref;
    QoreV8Program* pgm;

    DLLLOCAL QoreV8CallbackInfo(const ResolvedCallReferenceNode* ref, QoreV8Program* pgm)
            : ref(const_cast<ResolvedCallReferenceNode*>(ref)), pgm(pgm) {
        this->ref->weakRef();
    }

    DLLLOCAL ~QoreV8CallbackInfo() {
        ref->weakDeref();
    }
};

static void call_callref(const v8::FunctionCallbackInfo<v8::Value>& info) {
    v8::Local<v8::Value> v = info.Data();
    assert(v->IsExternal());

    v8::Local<v8::External> ext = v8::Local<v8::External>::Cast(v);
    QoreV8CallbackInfo* cbinfo = reinterpret_cast<QoreV8CallbackInfo*>(ext->Value());

    v8::Isolate* isolate = info.GetIsolate();

    ExceptionSink xsink;
    OptionalCallReferenceAccessHelper rh(&xsink, cbinfo->ref);
    if (!rh) {
        assert(xsink);
        // raise JS exception
        QoreV8Program::raiseV8Exception(xsink, isolate);
        return;
    }

    v8::Local<v8::Context> context = isolate->GetCurrentContext();

    ReferenceHolder<QoreListNode> args(&xsink);
    int len = info.Length();
    if (len) {
        args = new QoreListNode(autoTypeInfo);
        for (int i = 0; i < len; ++i) {
            ValueHolder arg(cbinfo->pgm->getQoreValue(&xsink, info[i]), &xsink);
            if (xsink) {
                // raise JS exception
                QoreV8Program::raiseV8Exception(xsink, isolate);
                return;
            }
            args->push(arg.release(), &xsink);
            assert(!xsink);
        }
    }
    ValueHolder rv(cbinfo->ref->execValue(*args, &xsink), &xsink);
    if (xsink) {
        // raise JS exception
        QoreV8Program::raiseV8Exception(xsink, isolate);
        return;
    }
    v8::Local<v8::Value> v8rv = cbinfo->pgm->getV8Value(*rv, &xsink);
    if (xsink) {
        // raise JS exception
        QoreV8Program::raiseV8Exception(xsink, isolate);
        return;
    }
    info.GetReturnValue().Set(v8rv);
}

static void deref_callref(const v8::WeakCallbackInfo<QoreV8CallbackInfo>& data) {
    delete data.GetParameter();
}

v8::Local<v8::Value> QoreV8Program::getV8Value(const QoreValue val, ExceptionSink* xsink) {
    //printd(5, "QoreV8Program::getV8Value() type '%s'\n", val.getFullTypeName());

    v8::Isolate::Scope isolate_scope(isolate);
    v8::EscapableHandleScope handle_scope(isolate);

    const v8::TryCatch tryCatch(isolate);

    switch (val.getType()) {
        case NT_NOTHING:
        case NT_NULL:
            return v8::Null(isolate);

        case NT_INT: {
            int64 v = val.getAsBigInt();
            // see if it's an int32_t
            if (v >= INT_MIN && v < INT_MAX) {
                return handle_scope.Escape(v8::Integer::New(isolate, (int32_t)v));
            }
            if (v >=0 && v < UINT_MAX) {
                return handle_scope.Escape(v8::Integer::NewFromUnsigned(isolate, (int32_t)v));
            }
            return handle_scope.Escape(v8::BigInt::New(isolate, v));
        }

        case NT_STRING: {
            v8::MaybeLocal<v8::String> rv = v8::String::NewFromUtf8(isolate, val.get<const QoreStringNode>()->c_str(),
                v8::NewStringType::kNormal);
            if (rv.IsEmpty()) {
                checkException(xsink, tryCatch);
                return v8::Null(isolate);
            }
            return handle_scope.Escape(rv.ToLocalChecked());
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
            return handle_scope.Escape(rv.ToLocalChecked());
        }

        case NT_BOOLEAN: {
            return handle_scope.Escape(v8::Boolean::New(isolate, val.getAsBool()));
        }

        case NT_FLOAT: {
            return handle_scope.Escape(v8::Number::New(isolate, val.getAsFloat()));
        }

        case NT_NUMBER: {
            return handle_scope.Escape(v8::Number::New(isolate, val.get<const QoreNumberNode>()->getAsFloat()));
        }

        case NT_BINARY: {
            QoreString str(val.get<const BinaryNode>());
            v8::MaybeLocal<v8::String> rv = v8::String::NewFromUtf8(isolate, str.c_str(), v8::NewStringType::kNormal);
            if (rv.IsEmpty()) {
                checkException(xsink, tryCatch);
                return v8::Null(isolate);
            }
            return handle_scope.Escape(rv.ToLocalChecked());
        }

        case NT_LIST: {
            const QoreListNode* l = val.get<const QoreListNode>();
            std::vector<v8::Local<v8::Value>> vec;
            vec.reserve(l->size());
            ConstListIterator i(l);
            v8::Local<v8::Value> v;
            while (i.next()) {
                v = getV8Value(i.getValue(), xsink);
                if (*xsink) {
                    return v8::Null(isolate);
                }
                vec.push_back(v);
            }
            return handle_scope.Escape(v8::Array::New(isolate, vec.data(), l->size()));
        }

        case NT_HASH: {
            const QoreHashNode* h = val.get<const QoreHashNode>();
            v8::Local<v8::Context> context = this->context.Get(isolate);
            v8::Local<v8::Object> obj = v8::Object::New(isolate);
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
                v8::Maybe<bool> ok = obj->CreateDataProperty(context, key.ToLocalChecked(), v);
                if (ok.IsNothing()) {
                    checkException(xsink, tryCatch);
                    return v8::Null(isolate);
                }
                //printd(5, "object %p set \"%s\" -> %s\n", h, i.getKey(), i.get().getFullTypeName());
            }
            return handle_scope.Escape(obj);
        }

        case NT_OBJECT: {
            QoreObject* obj = const_cast<QoreObject*>(val.get<const QoreObject>());
            ReferenceHolder<QoreV8Object> pd(obj->tryGetReferencedPrivateData<QoreV8Object>(CID_JAVASCRIPTOBJECT,
                xsink), xsink);
            if (*xsink) {
                return v8::Null(isolate);
            }
            if (!pd) {
                xsink->raiseException("JAVASCRIPT-TYPE-ERROR", "Cannot convert Qore values of type '%s' to a V8 "
                    "value", val.getFullTypeName());
                return v8::Null(isolate);
            }
            return handle_scope.Escape(pd->get(xsink, isolate));
        }

        case NT_RUNTIME_CLOSURE:
        case NT_FUNCREF: {
            const ResolvedCallReferenceNode* ref = val.get<const ResolvedCallReferenceNode>();

            QoreV8CallbackInfo* cbinfo = new QoreV8CallbackInfo(ref, this);

            v8::Local<v8::External> ext = v8::External::New(isolate, (void*)cbinfo);

            // add callback to external object
            v8::Global<v8::External> gext;
            gext.Reset(isolate, ext);
            gext.SetWeak(cbinfo, deref_callref, v8::WeakCallbackType::kParameter);

            v8::Local<v8::Context> context = this->context.Get(isolate);
            v8::MaybeLocal<v8::Function> func = v8::Function::New(context, call_callref, ext);
            if (func.IsEmpty()) {
                //printd(5, "ref: %p -> func empty\n", ref);
                checkException(xsink, tryCatch);
                return v8::Null(isolate);
            }
            if (saveQoreReference(ref->refSelf(), *xsink)) {
                //printd(5, "ref: %p -> cannot save Qore reference\n", ref);
                assert(*xsink);
                return v8::Null(isolate);
            }
            //printd(5, "ref: %p -> returning JS function object\n", ref);
            return handle_scope.Escape(func.ToLocalChecked());
        }

        default:
            xsink->raiseException("JAVASCRIPT-TYPE-ERROR", "Cannot convert Qore values of type '%s' to a V8 value",
                val.getFullTypeName());
    }


    return v8::Null(isolate);
}

QoreObject* QoreV8Program::getGlobal(ExceptionSink* xsink) {
    QoreV8ProgramHelper v8h(xsink, this);
    if (*xsink) {
        return nullptr;
    }

    v8::Local<v8::Object> g = this->context.Get(isolate)->Global();
    return new QoreObject(QC_JAVASCRIPTOBJECT, getProgram(), new QoreV8Object(this, g));
}