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

TODO: In depth analysis on issues mentioned in the references
