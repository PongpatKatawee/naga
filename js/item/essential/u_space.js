/*
    universal space 
    Startup: v1
*/

function u_space() {
    this.item = false;
}

u_space.prototype.init = function(frame,config) {
    this.item = document.createElement('div');
    
    this.setposition(frame);
    this.setsize(frame);
    //--- Opacity ---
    if (typeof config.bg !== "undefined") { 
        this.setbgcolor(config.bg);
    }
};

u_space.prototype.add = function(uobj) {
    uobj.render(this.item);
};

u_space.prototype.render = function(container) {
    if (container) {  
        container.appendChild(this.item);
    }
};

//--- Setting Tool ---
u_space.prototype.setposition = function(frame) {
    if (typeof frame.top    !== "undefined") { this.item.style.top    = frame.top + "px"; }
    if (typeof frame.left   !== "undefined") { this.item.style.left   = frame.left + "px"; }
    if (typeof frame.right  !== "undefined") { this.item.style.right  = frame.right + "px"; }
    if (typeof frame.bottom !== "undefined") { this.item.style.bottom = frame.bottom + "px"; }
};

u_space.prototype.setsize = function(frame) {
    if (typeof frame.wd    !== "undefined") { this.item.style.width    = frame.wd  + "px"; }
    if (typeof frame.hg    !== "undefined") { this.item.style.height    = frame.hg + "px"; }
};

u_space.prototype.setbgcolor = function(color) {
    if (color.length > 0) {
        this.item.style.backgroundColor = color;
    } else {
        this.item.style.backgroundColor = "transparent";
    }
};

//   textstyle = { halign,valign, lineh }  
u_space.prototype.setTextStyle = function(textstyle) {
    if (typeof textstyle.halign   !== "undefined") { this.item.style.textAlign = textstyle.halign; }
    if (typeof textstyle.valign   !== "undefined") { this.item.style.verticalAlign = textstyle.valign; }
    if (typeof textstyle.lineh    !== "undefined") { this.item.style.lineHeight = textstyle.lineh + "px"; } 
        
    if (typeof textstyle.weight   !== "undefined") { this.item.style.fontWeight = textstyle.weight;}
    if (typeof textstyle.size     !== "undefined") { this.item.style.fontSize = textstyle.size + "px"; }
    if (typeof textstyle.color    !== "undefined") { this.item.style.color = textstyle.color;   }
};