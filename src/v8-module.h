/* -*- mode: c++; indent-tabs-mode: nil -*- */
/*
    v8-module.h

    Qore Programming Language

    Copyright 2020 - 2021 Qore Technologies, s.r.o.

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

#ifndef _QORE_V8_MODULE_H
#define _QORE_V8_MODULE_H

#include <v8.h>
#include <libplatform/libplatform.h>
#include <node.h>

/*
#include <v8-context.h>
#include <v8-initialization.h>
#include <v8-isolate.h>
#include <v8-local-handle.h>
#include <v8-primitive.h>
#include <v8-script.h>
*/

#include <qore/Qore.h>

//! the name of the module
#define QORE_V8_MODULE_NAME "v8"
//! the name of the main V8 namespace in Qore
#define QORE_V8_NS_NAME "V8"
//! the name of the language in stack traces
#define QORE_V8_LANG_NAME "V8"

// module registration function
DLLEXPORT extern "C" void v8_qore_module_desc(QoreModuleInfo& mod_info);

// export function for other language modules
//DLLEXPORT extern "C" int v8_module_import(ExceptionSink* xsink, QoreProgram* pgm, const char* module,
//    const char* symbol);

DLLLOCAL extern QoreNamespace* V8NS;

DLLLOCAL extern std::unique_ptr<node::MultiIsolatePlatform> platform;
DLLLOCAL extern std::shared_ptr<node::InitializationResult> init_result;

#endif
