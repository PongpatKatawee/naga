function system() {
    this.isTouch = false;
    this.isFullScreen = false;
    this.isiOS = false;
    this.isiphone = false;
    this.isipad = false;
    this.isAndroid = false;
    this.isLinux = false;
    
    this.onresize = false;
    this.onrescroll = false;
    
    this.position = { top:0, left:0 };
    this.page = { wd:0,hg:0};
    
    this.screen = { wd:0,hg:0 };
    this.availscreen = { wd:0,hg:0 };
    this.viewport = { wd:0 , hg:0 };
}


system.prototype.getPage = function() {
    this.page.wd = Math.max(document.documentElement["clientWidth"], 
                   document.body["scrollWidth"],
                   document.documentElement["scrollWidth"], 
                   document.body["offsetWidth"], 
                   document.documentElement["offsetWidth"]);
    
    this.page.hg = Math.max(document.documentElement["clientHeight"], 
                   document.body["scrollHeight"],
                   document.documentElement["scrollHeight"], 
                   document.body["offsetHeight"], 
                   document.documentElement["offsetHeight"]); 
};

system.prototype.getViewport = function() {
    // (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    var viewportwidth;
    var viewportheight;
  
    if (typeof window.innerWidth !== 'undefined') {
        viewportwidth = window.innerWidth;
        viewportheight = window.innerHeight;
    } else if (typeof document.documentElement !== 'undefined'
            && typeof document.documentElement.clientWidth !== 'undefined' 
            && document.documentElement.clientWidth !== 0) {
        // IE6 
        viewportwidth = document.documentElement.clientWidth;
        viewportheight = document.documentElement.clientHeight;
    } else {
        // older versions of IE
        viewportwidth = document.getElementsByTagName('body')[0].clientWidth;
        viewportheight = document.getElementsByTagName('body')[0].clientHeight;
    }
        
    this.viewport.wd = viewportwidth;
    this.viewport.hg = viewportheight;
};

system.prototype.getPosition = function() {
    this.position.top = window.pageYOffset || document.documentElement.scrollTop;
    this.position.left = window.pageXOffset || document.documentElement.scrollLeft;
};


system.prototype.detect = function() {
    var ua = navigator.userAgent;
        
        this.isiphone = ~ua.indexOf('iPhone') || ~ua.indexOf('iPod');
        this.isipad = ~ua.indexOf('iPad');
        
        this.isiOS = this.isiphone || this.isipad;
        
        if (window.navigator.standalone) {
            this.isFullScreen = window.navigator.standalone;
        }
        this.isAndroid = ~ua.indexOf('Android');
        this.isLinux = ~ua.indexOf('Linux');
        
        this.isTouch = this.isiOS || this.isAndroid || this.isLinux;
        
        //--- Screen Size ---
        this.screen.hg = screen.height;
        this.screen.wd = screen.width;

        this.availscreen.hg = screen.availHeight;
        this.availscreen.wd = screen.availWidth;
        
        //--- the Page Size ---
        this.getPage();
        this.getViewport();
        this.getPosition();
        
        addEvent(window,"resize",this,this.resize); 
        addEvent(window,"scroll",this,this.scroll); 
        
        /*
        function getOrientation(){
            return Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";
        };

        function getMobileWidth(){
            return getOrientation() == "landscape" ? screen.availHeight : screen.availWidth;
        };

        function getMobileHeight(){
            return getOrientation() == "landscape" ? screen.availWidth : screen.availHeight;
        };
        */
};

system.prototype.scroll = function(e) {
    this.getPosition();
    
    if (this.onscroll) {  this.onscroll.fire([this.position]); }
};

system.prototype.resize = function(e) {
    this.getPage();
    this.getViewport();
    
    if (this.onresize) { this.onresize.fire([this.viewport]); }
};

/*
function reloadScrollBars() {
    document.documentElement.style.overflow = 'auto';  // firefox, chrome
    document.body.scroll = "yes"; // ie only
}

function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
}
*/
