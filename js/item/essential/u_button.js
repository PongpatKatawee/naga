/*
    universal button 
    Startup: v1
*/

function u_button() {
    this.isOver = false;
    this.isSelect = false;
    this.isVisible = false;
    this.onclick = false;
    this.id = "";
    
    //--- container ---
    this.space = false;
    this.img_normal = false;
    this.img_hilight = false;
    this.img_selected = false;
}

// id = id of button, frame = { button:{ x,y,wd,hg }  , img:{x,y,wd,hg} ,txt:{ x,y,wd,hg } } 
// config = { normal: { img ,bg , css , opacity , txt: { text }  } , 
//           hilight: { img ,bg , css , opacity  } , 
//          selected: { img ,bg , css , opacity  } }

u_button.prototype.init = function(id,frame,config) {
    this.id = id;
    this.config = config;
   
    this.space = new u_space();
    this.space.init( frame.button ,{  } );
    
    this.space.item.style.position = "absolute";
    this.space.item.style.cursor = "pointer";
    this.space.item.style.overflow = "hidden";  
    
    //--- background color apply ---
    if (typeof this.config.normal.bg !== "undefined") { 
        this.space.setbgcolor(this.config.normal.bg);
    }
    
    //--- Opacity ---
    if (typeof this.config.normal.opacity !== "undefined") { 
        this.space.item.style.opacity = this.config.normal.opacity;
    }
    //--- css apply ---
    if (typeof this.config.normal.css !== "undefined") { 
        this.space.item.className = this.config.normal.css;
    }
     
    //--- image apply
    if (typeof this.config.normal.img !== "undefined" || this.config.normal.length > 0) { 
        this.img_normal = new img_item();
        this.img_normal.init( frame.img ,this.config.normal.img);
        this.img_normal.isVisible = true;
        
        this.space.add(this.img_normal);
    } else {
        this.img_normal = false;
    }
    
    if (typeof this.config.hilight.img  !== "undefined" || this.config.normal.length > 0) { 
        this.img_hilight = new img_item();
        this.img_hilight.init( frame.img ,this.config.hilight.img);
        this.img_hilight.isVisible = false;
        this.space.add(this.img_hilight);

        this.img_hilight.item.style.display = "none";
    } else {
        this.img_hilight = false;
    }
    
    if (typeof this.config.selected.img  !== "undefined" || this.config.normal.length > 0) { 
        this.img_selected = new img_item();
        this.img_selected.init( frame.img ,this.config.selected.img);
        this.img_selected.isVisible = false;
        
        this.space.add(this.img_selected);

        this.img_selected.item.style.display = "none";
    } else {
        this.img_selected = false;
    }
    
    //--- text Apply ---
    if (typeof this.config.normal.txt !== "undefined") { 
        this.text = new u_space();
        
        this.text.init( frame.txt ,{ bg:"" } );
        this.text.setTextStyle( {   halign:"center",
                                    valign:"middle", 
                                    lineh:frame.txt.hg });
        
        this.text.item.innerHTML = this.config.normal.txt;        
        this.space.add(this.text);
    } else {
        this.text = false;
    }

    if (sys.isTouch)  {
        addEvent(this.space.item  ,"click",this,this.itemclick);
        addEvent(this.space.item  ,"touchstart",this,this.onover);
        addEvent(this.space.item  ,"touchend",this,this.onout);
    } else {
        addEvent(this.space.item  ,"click",this,this.itemclick);
        addEvent(this.space.item  ,"mouseover",this,this.onover);
        addEvent(this.space.item  ,"mouseout",this,this.onout);
    }  
};

u_button.prototype.render = function(container) {
    if (container) {  
        container.appendChild(this.space.item);
    }
};

u_button.prototype.setText = function(text) {
    this.text.item.innerHTML = text;
};



u_button.prototype.reconfig = function(config) {
    this.config = config;
    //--- background color apply ---
    if (typeof this.config.normal.bg !== "undefined") { 
        this.space.setbgcolor(this.config.normal.bg);
    }
    
    //--- Opacity ---
    if (typeof this.config.normal.opacity !== "undefined") { 
        this.space.item.style.opacity = this.config.normal.opacity;
    }
    //--- css apply ---
    if (typeof this.config.normal.css !== "undefined") { 
        this.space.item.className = this.config.normal.css;
    }
     
    //--- image apply
    if (typeof this.config.normal.img !== "undefined" || this.config.normal.length > 0) {
        this.img_normal.display(this.config.normal.img);
    } else {
        this.img_normal = false;
    }
    
    if (typeof this.config.hilight.img  !== "undefined" || this.config.normal.length > 0) { 
        this.img_hilight.display(this.config.hilight.img);
        this.img_hilight.item.style.display = "none";
    } else {
        this.img_hilight = false;
    }
    
    if (typeof this.config.selected.img  !== "undefined" || this.config.normal.length > 0) { 
        this.img_selected.display(this.config.selected.img);
        this.img_selected.item.style.display = "none";
    } else {
        this.img_selected = false;
    }
    
    //--- text Apply ---
    if (typeof this.config.normal.txt !== "undefined") { 
        this.text.item.innerHTML = this.config.normal.txt;        
    } else {
        this.text = false;
    }
};

u_button.prototype.setSelect = function(select) {
    if (select) {
        this.isSelect = true;
        
        //--- image apply ---
        if (this.img_normal)  { this.img_normal.item.style.display = "none"; }
        if (this.img_hilight)  { this.img_hilight.item.style.display = "none"; }
        if (this.img_selected) { this.img_selected.item.style.display = ""; }
        
        //--- background color apply ---
        if (typeof this.config.selected.bg !== "undefined") { 
            setbgcolor(this.space.item,this.config.selected.bg);
        }
        
        //--- css apply ---
        if (typeof this.config.selected.css !== "undefined") { 
            this.space.item.className = this.config.selected.css;
        }
        
        //--- Opacity ---
        if (typeof this.config.selected.opacity !== "undefined") { 
            this.space.item.style.opacity = this.config.selected.opacity;
        }
    } else {
        this.isSelect = false;
        
        //--- image apply ---
        if (this.img_normal)  { this.img_normal.item.style.display = ""; }
        if (this.img_hilight)  { this.img_hilight.item.style.display = "none"; }
        if (this.img_selected) { this.img_selected.item.style.display = "none"; }
        
        //--- background color apply ---
        if (typeof this.config.normal.bg !== "undefined") { 
            setbgcolor(this.space.item,this.config.normal.bg);
        }
        
        //--- css apply ---
        if (typeof this.config.normal.css !== "undefined") { 
            this.space.item.className = this.config.normal.css;
        }
        
        //--- Opacity ---
        if (typeof this.config.normal.opacity !== "undefined") { 
            this.space.item.style.opacity = this.config.normal.opacity;
        }
    }    
};

u_button.prototype.setVisible = function(visible) {
    if (visible) {
        this.isVisible = true;
        this.space.item.style.display = "";
    } else {
        this.isVisible = false;
        this.space.item.style.display = "none";
    }
};

u_button.prototype.setover = function() {
    this.isOver = true;
            
    //--- if have hilight image then chage , if not use img_normal ---
    if (this.img_hilight) { 
        if (this.img_normal)  { this.img_normal.item.style.display = "none"; }
        this.img_hilight.item.style.display = ""; 
    }
            
    //--- background color apply ---
    if (typeof this.config.hilight.bg !== "undefined") { 
        setbgcolor(this.space.item,this.config.hilight.bg);
    }
        
    //--- css apply ---
    if (typeof this.config.hilight.css !== "undefined") { 
        this.space.item.className = this.config.hilight.css;
    }
            
    //--- Opacity ---
    if (typeof this.config.hilight.opacity !== "undefined") { 
        this.space.item.style.opacity = this.config.hilight.opacity;
    }
};


u_button.prototype.onover = function(e) {
    if (!this.isSelect) {
        if (!this.isOver) {
            this.isOver = true;
            
            //--- if have hilight image then chage , if not use img_normal ---
            if (this.img_hilight) { 
                if (this.img_normal)  { this.img_normal.item.style.display = "none"; }
                this.img_hilight.item.style.display = ""; 
            }
            
            //--- background color apply ---
            if (typeof this.config.hilight.bg !== "undefined") { 
                setbgcolor(this.space.item,this.config.hilight.bg);
            }
        
            //--- css apply ---
            if (typeof this.config.hilight.css !== "undefined") { 
                this.space.item.className = this.config.hilight.css;
            }
            
            //--- Opacity ---
            if (typeof this.config.hilight.opacity !== "undefined") { 
                this.space.item.style.opacity = this.config.hilight.opacity;
            }
        }
    }
};

u_button.prototype.onout = function(e) {
    if (!this.isSelect) {
        if (this.isOver) {
            this.isOver = false;
            
            if (this.img_hilight) { 
                if (this.img_normal)  { this.img_normal.item.style.display = ""; }
                this.img_hilight.item.style.display = "none"; 
            }
            //--- background color apply ---
            if (typeof this.config.normal.bg !== "undefined") { 
                setbgcolor(this.space.item,this.config.normal.bg);
            }
        
            //--- css apply ---
            if (typeof this.config.normal.css !== "undefined") { 
                this.space.item.className = this.config.normal.css;
            }
            
            //--- Opacity ---
            if (typeof this.config.normal.opacity !== "undefined") { 
                this.space.item.style.opacity = this.config.normal.opacity;
            }
        }
    }
};

u_button.prototype.itemclick = function(e) {
    e = e || window.event;

    if (this.onclick) {     
         this.onclick.fire([ { id:this.id } ] );
    }
};

