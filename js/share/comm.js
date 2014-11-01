function comm(parent) {
    this.parent = parent;
    
    this.socket = null;
    this.protocal = "http://";
     
    this.server = "122.155.3.233";
    this.port = "8000";
    
    this.onconfig = false;
    this.onquery = false;
    this.onsignal = false;
    this.onerror = false;
    
    //--- and socket.io script ---
    // add socket.io module
    var head= document.getElementsByTagName('head')[0];
    var script= document.createElement('script');
    script.type= 'text/javascript';
    script.src= 'ext/socket.io.min.js';
    head.appendChild(script);  
}

comm.prototype.init = function(protocal,server,port) {
    this.protocal = protocal;
    this.server = server;
    this.port = port;
    
    var url = this.protocal + this.server;
    if (this.port.length > 0) { url = url +":" + this.port; }
     
    if (this.protocal === "http://") {
        this.socket = io.connect(url);
    } else {
        this.socket = io.connect(url , {secure: true});
    }
    
    this.socket.on('connect',cb(this,this.initsocket));
    this.socket.on('error',cb(this,this.errorsocket));
};

comm.prototype.initsocket = function() { 
    this.socket.on('rconfig', cb(this,this.rconfig));
    this.socket.on('rquery', cb(this,this.rquery));
    this.socket.on('rsignal', cb(this,this.rsignal));
    
    //socket.status
};

comm.prototype.errorsocket = function(error) {
    if (this.onerror) { this.onerror.fire([error]); }
};

comm.prototype.query = function(message) {
    if (this.socket) { this.socket.emit('query', message ); }
};

comm.prototype.config = function(message) {
    if (this.socket) { this.socket.emit('config', message ); }
};

comm.prototype.signal = function(message) {
    if (this.socket) { this.socket.emit('signal', message ); }
};

//--- listening port ---
comm.prototype.rquery = function(msg) {
    if (this.onquery) { this.onquery.fire([msg]); }
};

comm.prototype.rconfig = function(msg) {
    if (this.onconfig) { this.onconfig.fire([msg]); }
};

comm.prototype.rsignal = function(msg) {
    if (this.onsignal) { this.onsignal.fire([msg]); }
};

//--- socket ok ----
comm.prototype.isSocketOK = function() {
    var result = false;
    
    if (io) {
        if (this.socket) {
            if (this.socket.socket.connected) { result = true; }
        }
    }
    
    return result;
};