# POC Proposal on implmenting Hot Reload in Fltter Web

This document contains the proposql of the implementation of hot reload feature 
of flutter web, using type information in dart and some javascript techniques.

## References:

- https://flutter.dev/docs/development/tools/hot-reload
- https://github.com/dart-lang/sdk/wiki/Hot-reload

## Apppach

Instead of referencing the hot reload implmentation of other frameworks like 
Vue and React, I have found that Flutter's lack of functional component support 
could make things much simpler. Indeed, this proposal intends to implment hot 
reload in the same way the Dart VM does, such that the hot reload in web would 
be bug-by-bug compatitable with the implmntation in Dart VM.

The core idea of this implmentation is a global method lookup table that 
is similar to the Prevasive late-binding method that Dart VM uses. In the 
simplest way of implmenting that (without much optimization), consider the 
following Dart code:

```dart
final String a = "a";
void b() {
  print("b 1");
}
class C {
  String d = "d 1";
  void c(String s) {
    print("c $s");
    d = "d 2";
  }
}
```

It is obvious that we will be able to transpile it to the following es6 code 
(it can be further es6'ed, and it can be made more amd, but it is not the focus here):

```js
let a = "a";
function b(){
  console.log("b 1");
}
class C {
  constructor(){
    this.d = "d 1";
  }

  c(s){
    console.log(`c ${s}`);
    this.d = "d 2";
  }
}
```

Now, to enable hot reload, we can add a global method lookup table and hijack 
all top level functions and methods with a unique id, probably based on package 
name + file name + method name. We can generate somethings like this:

```js
var _METHODS_ = {
  "top_b": function(){
    console.log("b 1");
  },
  "C_c": function(s){
    // We cannot use arrow functions here since arrow functions binds autmatically
    this.d = "d ${s}";
  },
  "C_constructor": function(){
    this.d = "d 1";
  },
};

let a = "a";
function b(){
  return _METHODS_["top_b"].apply(this, arguments);
}
class C {
  constructor(){
    return _METHODS_["C_constructor"].apply(this, arguments);
  }
  c(){
    return _METHODS_["C_c"].apply(this, arguments);
  }
}

```


## Analysis

### Compability with current Dart VM Hot Reload

In order to discuss the compatibility of this implementation with Dart VM's 
implementation, we will have to first dicuss how Dart VM's Hot Reload works.

Some information can be seen in Dart VM's [wiki][1], but we would need to look at 
the sources. A hot reload in Dart VM is triggered by the [reloadSource][2] RPC in 
the Dart VM Service protocol, which was implemented in [service.cc][3] in 
[ReloadSources][4]. The reload request is passed to [IsolateGroup::ReloadSources in isolate.cc][5], then [IsolateGroupReloadContext::Reload in isolate_reload.cc][6]. 
It is interesting that a hot reload request is handled in 4 pharses with 
the ability to rollback. It is [ReloadPharse4CommitPrepare and ReloadPharse4CommitFinish][8] 
that does the actual reloading. By investgating these code, we can deduce that Dart VM 
does the following when doing hot reload:

1. Copy static fields from old to new class, also save fields and functions of 
   the old class. It also migrate static closures.
2. Save fields and functiosn of the removed class.
3. Also mark library as dirty is it imports / is imported by libraries that will 
   be reloaded. (not sure about this).
4. Create two lists of old and new class, field, closure, libraries and library prefixes (?)
5. Disable gc, allow heap grows without limit.
6. Morph (replace?) all old instances in the heap to new instance. 
7. Discard the old classes.
8. Give the morphed object its new size.
9. Set key and object WeakMap (?).
10. Visit objects and pointers (?).
11. Replace enums.
12. Process constants (Note that js constants are basically dart final, I doubt js has real constants).

I don't pretend to understand the whole hot reload process here. But as 
far as I am concerned, the actual patching logic is in object_reload.cc, 
which the follow is performed:

- Copy the value of static fields of the old class to the new class.
- Patch all non-eval non-closure functions and fields.
- Migrate static closures (methods?)

It seems that Dart VM's type system use hash tables for fields and 
functions so that they don't has to be explictly updated in hot reload. 
Instead they are creatd when referenced (?).

It is also useful to know that there are onlythree kinds of variables in JS, 
namely global/module scope variables, local variables, and class fields (object members). 
Class methods are treated as class field that is a function. Class is just 
another function as well. Non-static class members can be accessed by Class.prototype.
Also, we are not interested with local scope variables (like closures). We will 
dealing with module scope variables (including static method and members) and 
class fields/methods only. At this POC stage, we are only intersted in 
AMD modules without rollback support (I am not even sure if rollback can be 
implemented). If hot reload is broken, the develoepr is expected to simply do 
hot restart. 

Here is how each of the operation that Dart VM does in hot reload 
can be mapped into JS operations.

#### Adding/deleting/changing static fields

As long as we don't replace the "Class" object, static fields will be 
retained. Adding a static field can be done by `Class.staticField = value`,
while removing a static field can be done by `delete Class.staticField`.

#### Adding static methods

```js
Class.staticMethod = function (){
  return _METHODS_["uuid"].apply(this,arguments);
}
_METHODS_["uuid"] = function (){
  something();
}
```

#### Deleting static mwthods

```js
delete Class.staticMethod;
delete _METHODS_["uuid"];
```

#### Changing static methods

```js

_METHODS_["uuid"] = function (){
  something();
}
```


[1]: https://github.com/dart-lang/sdk/wiki/Hot-reload
[2]: https://github.com/dart-lang/sdk/blob/master/runtime/vm/service/service.md#reloadsources
[3]: https://github.com/dart-lang/sdk/blob/master/runtime/vm/service.cc
[4]: https://github.com/dart-lang/sdk/blob/master/runtime/vm/service.cc#L3397
[5]: https://github.com/dart-lang/sdk/blob/master/runtime/vm/isolate.cc#L2061
[6]: https://github.com/dart-lang/sdk/blob/master/runtime/vm/isolate_reload.cc#L551
[7]: https://github.com/dart-lang/sdk/blob/master/runtime/vm/isolate_reload.cc#L2407
[8]: https://github.com/dart-lang/sdk/blob/master/runtime/vm/isolate_reload.cc#L1088


TODO: In depth analysis on issues mentioned in the references
