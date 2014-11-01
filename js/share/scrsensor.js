function scrsensor() {
    this.onstart = false;
    this.onmove = false;
    this.onend = false;
    
    this.pos = {};
}

scrsensor.prototype.init = function(ele) {

    if (sys.isTouch)  {
        addEvent(ele,"touchstart",this,this.ontouchstart);
        addEvent(ele,"touchmove",this,this.ontouchmove);
        addEvent(ele,"touchend",this,this.ontouchend);
    } else {
        addEvent(ele,"mousedown",this,this.onmousestart);
        addEvent(ele,"mousemove",this,this.onmousemove);
        addEvent(ele,"mouseup",this,this.onmouseend);
    }
};


scrsensor.prototype.onmousestart = function(e) {
    e = e || window.event;
      
    var ax = (e.x || e.clientX);
    var ay = (e.y || e.clientY);
     
    var obj = { ax: ax , ay: ay };
    
    if (this.onstart) { 
        this.onstart.fire([obj]);
    }
};

scrsensor.prototype.onmouseend = function(e){
    e = e || window.event;

    var ax = (e.x || e.clientX);
    var ay = (e.y || e.clientY);
     
    var obj = { ax: ax , ay: ay };
    
    if (this.onend) { 
        this.onend.fire([obj]);
    }
};

scrsensor.prototype.onmousemove = function(e) {
    e = e || window.event;
     
    var ax = (e.x || e.clientX);
    var ay = (e.y || e.clientY);
     
    var obj = { ax: ax , ay: ay };
     
    if (this.onmove) { 
        this.onmove.fire([obj]);
    }
};

scrsensor.prototype.ontouchstart = function(e) {
    e = e || window.event;
    
    var ax = e.touches[0].x || e.touches[0].pageX;
    var ay = e.touches[0].y || e.touches[0].pageY;
     
    var obj = { ax: ax , ay: ay };   
    
    this.pos = obj;
    
    if (this.onstart) { 
        this.onstart.fire([obj]);
    }
};

// on event touchend no position is send use last move instead
scrsensor.prototype.ontouchend = function(e) {
    e = e || window.event;

    var obj = this.pos;
    
    if (this.onend) {  
        this.onend.fire([obj]);
    }    
};

scrsensor.prototype.ontouchmove = function(e){
    e = e || window.event;

    if (e.touches.length === 1) { 
        var ax = e.touches[0].x || e.touches[0].pageX;
        var ay = e.touches[0].y || e.touches[0].pageY;

        var obj = { ax: ax , ay: ay };
        
        this.pos = obj;
        
        if (this.onmove) {
            this.onmove.fire([obj]);
        }
        // fix screen here on ios device
        event.preventDefault();  
     } 
};
