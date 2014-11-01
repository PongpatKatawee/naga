function list() {
    this.keys = [];
}

list.prototype = {
    add_at:function(key,pos) {
        if (!this.exist(key)) {
            this.keys.splice(pos, 0, key);
        }
    },
    add:function(key) {
        if (!this.exist(key)) {
            this.keys.push(key);
        }
    },
    remove:function(key) {
        var inx = this.keys.indexOf(key);
        this.keys.splice(inx, 1);
    },
    remove_at:function(pos) {
        this.keys.splice(pos, 1);
    },
    get:function(key) {
        var inx = this.keys.indexOf(key);
        return this.keys[inx];
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
