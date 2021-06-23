'use strict';
const dart_sdk = require('dart_sdk');
const core = dart_sdk.core;
const dart = dart_sdk.dart;
const dartx = dart_sdk.dartx;
var sample = Object.create(dart.library);
dart._checkModuleNullSafetyMode(false);
const CT = Object.create({
  _: () => (C, CT)
});
var I = ["org-dartlang-app:/sample.dart"];
var d = dart.privateName(sample, "C.d");
sample.C = class C extends core.Object {
  get d() {
    return this[d];
  }
  set d(value) {
    this[d] = value;
  }
  c(s) {
    if (s == null) dart.nullFailed(I[0], 8, 17, "s");
    core.print("c " + dart.str(s));
    this.d = "d 2";
  }
};
(sample.C.new = function() {
  this[d] = "d 1";
  ;
}).prototype = sample.C.prototype;
dart.addTypeTests(sample.C);
dart.addTypeCaches(sample.C);
dart.setMethodSignature(sample.C, () => ({
  __proto__: dart.getMethods(sample.C.__proto__),
  c: dart.fnType(dart.void, [core.String])
}));
dart.setLibraryUri(sample.C, I[0]);
dart.setFieldSignature(sample.C, () => ({
  __proto__: dart.getFields(sample.C.__proto__),
  d: dart.fieldType(core.String)
}));
sample.b = function b() {
  core.print("b 1");
};
dart.defineLazy(sample, {
  /*sample.a*/get a() {
    return "a";
  }
}, false);
dart.trackLibraries("sample_common", {
  "org-dartlang-app:/sample.dart": sample
}, {
}, null);
// Exports:
exports.sample = sample;

//# sourceMappingURL=sample_common.js.map
