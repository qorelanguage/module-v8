cmake_minimum_required(VERSION 2.8.13)
project(qore-v8-module)

set (VERSION_MAJOR 1)
set (VERSION_MINOR 0)
set (VERSION_PATCH 0)

set(PROJECT_VERSION "${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}")

if (${CMAKE_VERSION} VERSION_GREATER_EQUAL "3.12.0")
    cmake_policy(SET CMP0074 NEW)

    if (${CMAKE_VERSION} VERSION_GREATER_EQUAL "3.18.0")
        cmake_policy(SET CMP0053 NEW)
    endif()
endif()

cmake_policy(SET CMP0042 NEW)

if (UNIX AND NOT APPLE)
    set(LINUX TRUE)
endif()

find_package(Qore 2.0 REQUIRED)

if (APPLE)
    find_library(V8_BASE_WITHOUT_COMPILER NAMES libv8_base_without_compiler.a HINTS ENV V8_LIB_DIR REQUIRED)
    find_library(V8_COMPILER_LIB NAMES libv8_compiler.a HINTS ENV V8_LIB_DIR REQUIRED)
    find_library(V8_INITIALIZERS_LIB NAMES libv8_initializers.a HINTS ENV V8_LIB_DIR REQUIRED)
    find_library(V8_INSPECTOR_LIB NAMES libv8_inspector.a HINTS ENV V8_LIB_DIR REQUIRED)
    find_library(V8_LIBBASE_LIB NAMES libv8_libbase.a HINTS ENV V8_LIB_DIR REQUIRED)
    find_library(V8_LIBPLATFORM_LIB NAMES libv8_libplatform.a HINTS ENV V8_LIB_DIR REQUIRED)
    find_library(V8_LIBSAMPLER_LIB NAMES libv8_libsampler.a HINTS ENV V8_LIB_DIR REQUIRED)
    find_library(V8_SNAPSHOT_LIB NAMES libv8_snapshot.a HINTS ENV V8_LIB_DIR REQUIRED)
    find_library(V8_TORQUE_GENERATED_LIB NAMES libv8_torque_generated.a HINTS ENV V8_LIB_DIR REQUIRED)
else()
    if (DEFINED ENV{V8_USE_LIBNODE})
        find_library(LIBNODE NAMES node HINTS ENV V8_LIB_DIR REQUIRED)
    else()
        find_library(V8 NAMES v8 HINTS ENV V8_LIB_DIR REQUIRED)
        find_library(V8_LIBBASE NAMES v8_libbase HINTS ENV V8_LIB_DIR REQUIRED)
        find_library(V8_LIBPLATFORM NAMES v8_libplatform HINTS ENV V8_LIB_DIR REQUIRED)
    endif()
endif()

if (DEFINED ENV{V8_INCLUDE_DIR})
    include_directories(BEFORE "$ENV{V8_INCLUDE_DIR}")
endif()

#set(V8_COMPILE_FLAGS "-DV8_COMPRESS_POINTERS -DV8_31BIT_SMIS_ON_64BIT_ARCH")
SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${V8_COMPILE_FLAGS}")

# Check for C++11.
include(CheckCXXCompilerFlag)
CHECK_CXX_COMPILER_FLAG("-std=c++17" COMPILER_SUPPORTS_CXX11)
if(COMPILER_SUPPORTS_CXX11)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++17")
else()
    message(FATAL_ERROR "The compiler ${CMAKE_CXX_COMPILER} has no C++17 support. Please use a different C++ compiler.")
endif()

set(QPP_SRC
    src/QC_JavaScriptProgram.qpp
    src/QC_JavaScriptObject.qpp
)

set(CPP_SRC
    src/v8-module.cpp
    src/QoreV8Program.cpp
    src/QoreV8Object.cpp
    src/QoreV8CallStack.cpp
    src/QoreV8StackLocationHelper.cpp
)

qore_wrap_qpp_value(QPP_SOURCES ${QPP_SRC})

foreach (it ${QPP_SOURCES})
    GET_FILENAME_COMPONENT(_outfile ${it} NAME_WE)
    set(QPP_DOX ${QPP_DOX} ${CMAKE_CURRENT_BINARY_DIR}/${_outfile}.dox.h)
endforeach()

set(module_name "v8")

set(QORE_DOX_TMPL_SRC
    docs/mainpage.dox.tmpl
)

add_library(${module_name} MODULE ${CPP_SRC} ${QPP_SOURCES})

include_directories(${CMAKE_SOURCE_DIR}/src)
#include_directories(${Python3_INCLUDE_DIRS})
target_include_directories(${module_name} PRIVATE $<BUILD_INTERFACE:${CMAKE_CURRENT_BINARY_DIR}/include>)

add_custom_target(QORE_INC_FILES DEPENDS ${QORE_INC_SRC})
add_dependencies(${module_name} QORE_INC_FILES)

target_link_libraries(${module_name} ${QORE_LIBRARY})

set(MODULE_DOX_INPUT ${CMAKE_CURRENT_BINARY_DIR}/mainpage.dox ${JAVA_JAR_SRC_STR} ${QPP_DOX})
string(REPLACE ";" " " MODULE_DOX_INPUT "${MODULE_DOX_INPUT}")
#message(STATUS mdi: ${MODULE_DOX_INPUT})

if (DEFINED ENV{DOXYGEN_EXECUTABLE})
    set(DOXYGEN_EXECUTABLE $ENV{DOXYGEN_EXECUTABLE})
endif()

set(MODULE_DOX_INPUT ${CMAKE_BINARY_DIR})
if (APPLE)
    qore_external_binary_module(${module_name} ${PROJECT_VERSION}
        ${V8_BASE_WITHOUT_COMPILER}
        ${V8_COMPILER_LIB}
        ${V8_INITIALIZERS_LIB}
        ${V8_INSPECTOR_LIB}
        ${V8_LIBBASE_LIB}
        ${V8_LIBPLATFORM_LIB}
        ${V8_LIBSAMPLER_LIB}
        ${V8_SNAPSHOT_LIB}
        ${V8_TORQUE_GENERATED_LIB}
    )
else()
    if (DEFINED ENV{V8_USE_LIBNODE})
        qore_external_binary_module(${module_name} ${PROJECT_VERSION}
            ${LIBNODE}
        )
        find_library(LIBNODE NAMES node HINTS ENV V8_LIB_DIR REQUIRED)
    else()
        qore_external_binary_module(${module_name} ${PROJECT_VERSION}
            ${V8}
            ${V8_LIBBASE}
            ${V8_LIBPLATFORM}
        )
    endif()
endif()

qore_dist(${PROJECT_VERSION})

qore_config_info()

if (DOXYGEN_FOUND)
    qore_wrap_dox(QORE_DOX_SRC ${QORE_DOX_TMPL_SRC})
    add_custom_target(QORE_MOD_DOX_FILES DEPENDS ${QORE_DOX_SRC})
    add_dependencies(docs-module QORE_MOD_DOX_FILES)
endif()
