function dict() {
    this.keys = [];
    this.values = []; 
}

dict.prototype = {
    clear:function() {
        this.keys = [];
        this.values = []; 
    },
    add:function(key,obj) {
        if (this.exist(key)) {
            var inx = this.keys.indexOf(key);
            this.values[inx] = obj;
        } else {
            this.keys.push(key);
            this.values.push(obj);
        }
    },
    remove:function(key) {
        var inx = this.keys.indexOf(key);
        this.keys.splice(inx, 1);
        this.values.splice(inx,1);
    },
    get:function(key) {
        var inx = this.keys.indexOf(key);
        return this.values[inx];
    },
    count:function() {
        return this.keys.length;
    },
    exist:function(key) {
        var inx = this.keys.indexOf(key);
        
        if (inx >=0) {
            return true;
        } else {
            return false;
        }
    }
};

