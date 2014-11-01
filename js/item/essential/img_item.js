/*
image item for display image from url
uses background image
absolute component 
automatic adjust and position
Startup v1.0
*/

function img_item() {
    this.item = false;
    
    this.wd = 0;
    this.hg = 0;
    
    this.src = "";
    this.displaymode = 0; // 0 =full , 1 =original , 2 = fit , 3 = fixwidth
    this.isVisible = true;
    
    this.onfinish = false;
    this.onerror = false;
}

img_item.prototype.init = function(frame,src) {
    this.wd = frame.wd;
    this.hg = frame.hg;
    this.src = src;
    this.item = document.createElement('div');
    
    setposition(this.item,frame);
    this.item.style.width = this.wd + "px";
    this.item.style.height = this.hg + "px";
    this.item.style.position = "absolute";
};

img_item.prototype.render = function(container) {
    container.appendChild(this.item);
    
    if (this.src.length > 0) {this.display(this.src);} else { this.item.style.backgroundImage = ""; }
};    

img_item.prototype.setVisible = function(visible) {
    if (visible) {
        this.isVisible = true;
        this.item.style.display = "";
    } else {
        this.isVisible = false;
        this.item.style.display = "none";
    }
};


img_item.prototype.display = function(src) {
    var img = new Image();
    
    img.src = src;   
    img.wd = this.wd;
    img.hg = this.hg;
    img.container = this.item;
    img.displaymode = this.displaymode;
    img.isVisible = this.isVisible;
    img.onfinish = this.onfinish;
    img.onexit = this.onerror;
    this.src = src;    
    
    this.item.style.backgroundImage = 'url(' +  this.src + ')';
    
    if (this.displaymode === 1) {
        this.item.style.backgroundPosition = "left center";
    } else if (this.displaymode === 2) {    
        this.item.style.backgroundColor = "white";
        this.item.style.backgroundPosition = "center center";
    } else if (this.displaymode === 3) {  
        this.item.style.backgroundPosition = "left center";
    } else {
        this.item.style.backgroundPosition = "center";
    }
    
    this.item.style.backgroundRepeat = "no-repeat";
    this.item.style.display = "none";
    
    //this.isVisible = true;
    img.onerror = function() {
        if (this.onexit) {  
            this.onexit.fire([ { id:"error",data:this.src } ] );
        }
    };
    
    img.onload = function() {
        //-- picture dimension ---
        var wd = this.naturalWidth;
        var hg = this.naturalHeight;
        var nwd = 0;
        var nhg = 0;
        
        if (this.displaymode === 0) {
        //--- frame dimension ---
            nwd = this.wd;
            nhg = this.hg;
        
            if (wd < hg) {
                // --- adjust height
                nhg = nwd * hg / wd;
            } else {
                nwd = nhg * wd / hg;
            }
        }
        
        if (this.displaymode === 1) {
            nwd = wd; 
            nhg = hg;
        }
        
        if (this.displaymode === 2) {
            nwd = this.wd;
            nhg = this.hg;

            // landscape
            if (wd > hg) {
            // --- adjust height
                nhg = nwd * hg / wd;
            } else {
                nwd = nhg * wd / hg;
            }
        }
        
        if (this.displaymode === 3) {
            nwd = this.wd;
            nhg = nwd * hg / wd;

            this.container.style.width = nwd + "px";
            this.container.style.height = nhg + "px";    
        }
        
        if (this.onfinish) {  
            this.onfinish.fire([ { id:"finish", wd:nwd,hg:nhg ,src:this.src} ] );
        }
        
        this.container.style.backgroundSize = nwd + 'px ' + nhg + 'px';
        
        if (this.isVisible) {
            this.container.style.display = "";
        }
    };
    
};