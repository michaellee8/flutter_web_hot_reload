var sample = Object.create(dart.library);
export { sample };
import { core, dart, dartx } from 'dart_sdk.js';
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
dart.trackLibraries("sample_es6", {
  "org-dartlang-app:/sample.dart": sample
}, {
}, null);

//# sourceMappingURL=sample_es6.js.map
