function tank() {
    this.keys = [];
    this.values = [];
}

tank.prototype = {
    create: function(core) {
            this.core = core;
            for (var i=0;i < this.core.creates.length; i++) {
                var obj = this.core.creates[i];
                this.add(obj.obj,obj.cls,this);
            }
    },
    add:function(objname,cls,parent) {
        var obj = new window[cls](parent);
        
        if (this.exist(objname)) {
            var inx = this.keys.indexOf(objname);
            this.values[inx] = obj;
        } else {    
            this.keys.push(objname);
            this.values.push(obj);
        }
    },
    remove:function(objname) {
        var inx = this.keys.indexOf(objname);
        this.keys.splice(inx, 1);
        this.values.splice(inx,1);
    },
    get:function(objname) {
        var inx = this.keys.indexOf(objname);
        return this.values[inx];
    },
    count:function() {
        return this.keys.length;
    },
    exist:function(objname) {
        var inx = this.keys.indexOf(objname);
        
        if (inx >=0) {
            return true;
        } else {
            return false;
        }
    },
    msg:function(objname,fn,args) {
        var inx = this.keys.indexOf(objname);
        var obj = this.values[inx];
        obj[fn].apply(obj,args);
    }
};