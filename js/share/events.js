function events() {
    this.clear();
}

events.prototype.clear = function() {
    this.setevent = [];
};

events.prototype.add = function(obj,func) {
    var evt = { scope:obj, func: func};
    this.setevent.push(evt);
};

events.prototype.fire = function(params) {
    var args = params || [];
    
    if (this.setevent.length > 0) {
        for (var i =0;i < this.setevent.length; i++) {
            var evtobj = this.setevent[i];
            evtobj.func.apply(evtobj.scope,args);
        }
    }
};

