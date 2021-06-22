How does Vue do hot reload?

Steps: 

(We are only interested in class components, we don't have to deal with functional components in flutter)

1. Track all modules via a global map assign each component a guid, hijack constructor for class compinent or component itself to record all instances.

2. If only the component's render method has changed (flutter's build), replace the render function of all instances, and then call forceUpdate on each instances. Does not affect child.

3. If other methods has been changed as well, replace everything, and then update the parents to destory itself(?).

Thoughts:

1. In dart we use actual js classes, maybe rely on the prototype chain to prograte new methods and then let the children subscribe to changes? Also it looks like flutter do a full rebuild each time hot reload happens anyway, so maybe we don't need to do force update?

2. Vue.js handle lifecycle hooks changes by destory and recreate the compnent, it looks like current flutter implekentation will just ignore the lifecycle hooks.


