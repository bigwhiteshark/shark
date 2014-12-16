define(function (){
	return function(child,parent) {
		var proto;
		var self = child.prototype;
		function C() {}
		C.prototype = parent.prototype;
		proto = child.prototype = new C;
		for (var k in self) {
			proto[k] = self[k];
		}
		child.prototype.constructor = child;
	};
});
