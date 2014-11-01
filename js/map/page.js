/*
    Page for compound_image.html 
    Beta map 
    Oct 2014
*/

function page(parent) {
    this.parent = parent;
    this.container = false;
    
    this.imgevt = new ow.eventsClass();        
    this.imgevt.add(this,this.imgfunc);
    
    
    this.startevt = new ow.eventsClass();        
    this.startevt.add(this,this.startfunc);
    
    this.moveevt = new ow.eventsClass();        
    this.moveevt.add(this,this.movefunc);
    
    this.endevt = new ow.eventsClass();        
    this.endevt.add(this,this.endfunc);
    
    this.scr = new scrsensor();
}

page.prototype.render = function(container) {
    if (container) {
        this.container = container;
        
        this.scr.init($('map'));
        this.scr.onstart = this.startevt;
        this.scr.onmove = this.moveevt;
        this.scr.onend = this.endevt;

        this.loadall();
        addEvent($('zoom+'),'click',this,this.zoomin);
        addEvent($('zoom-'),'click',this,this.zoomout);
        addEvent($('long+'),'click',this,this.longplus);
        addEvent($('long-'),'click',this,this.longminus);
        addEvent($('lat+'),'click',this,this.latplus);
        addEvent($('lat-'),'click',this,this.latminus);
        addEvent($('typemap'),'change',this,this.reload);
    }
};

page.prototype.reload = function(e) {
    e = e || window.event;
    console.log(e);
    
    this.loadall();
};

page.prototype.zoomin = function(e) {
    e = e || window.event;
    console.log(e);
    
    if ($('zoom').value >= 19) {
        $('zoom').value = 0;
    } else {
        $('zoom').value = parseInt($('zoom').value) + 1;
        $('long').value = parseInt($('long').value) * 2;
        $('lat').value = parseInt($('lat').value) * 2;
    }
    this.loadall();
};

page.prototype.zoomout = function(e) {
    e = e || window.event;

    if ($('zoom').value <= 0) {
        $('zoom').value = 19;
    }else{
        $('zoom').value = parseInt($('zoom').value) - 1;
        $('long').value = parseInt(parseInt($('long').value) / 2);
        $('lat').value = parseInt(parseInt($('lat').value) / 2);
    };
    this.loadall();
};

page.prototype.longplus = function(e) {
    e = e || window.event;

    var max = amount_image_side($('zoom').value) - 1;
            if ($('long').value >= max) {
                $('long').value = 0;
            }else{
                $('long').value = parseInt($('long').value) + 1;
            }
            
    this.loadall();
};

page.prototype.longminus = function(e) {
    e = e || window.event;
    var max = amount_image_side($('zoom').value) - 1;
            if ($('long').value <= 0) {
                $('long').value = max;
            }else{
                $('long').value = parseInt($('long').value) - 1;
            }
    
    this.loadall();
};

page.prototype.latplus = function(e) {
    e = e || window.event;
    var max = amount_image_side($('zoom').value) - 1;
            if ($('lat').value >= max) {
                $('lat').value = 0;
            }else{
                $('lat').value = parseInt($('lat').value) + 1;
            }
    
    this.loadall();
};

page.prototype.latminus = function(e) {
    e = e || window.event;
    var max = amount_image_side($('zoom').value) - 1;
            if ($('lat').value <= 0) {
                $('lat').value = max;
            }else{
                $('lat').value = parseInt($('lat').value) - 1;
            }
    
    this.loadall();
};

page.prototype.mod = function(a, b) {
    a = parseInt(a);
    b = parseInt(b);
    return (a % b);
};

page.prototype.amount_image_side = function(index_zoom) {
    return (Math.pow(2,parseInt(index_zoom))); 
};

page.prototype.loadall = function() {
    var zoom = $('zoom').value;
    var long = parseInt($('long').value);
    var lat = parseInt($('lat').value);
    var max = this.amount_image_side(zoom);

    for (var y = 0; y < 2; y++) {
        for (var x = 0; x < 4; x++) {
            var longitude = this.mod(long + x, max);
            var latitude = this.mod(lat + y, max);
                    
            this.loadImageMap( $(x +'-' + y), zoom , longitude, latitude, $('typemap').value);         
        }
    }
    $('max_side').innerHTML = this.amount_image_side(zoom);
};

page.prototype.loadImageMap = function(item, zoom, longitude, latitude, typemap) {
    var gridurl = zoom + "/" + longitude + "/" + latitude + ".png";
    var index = typemap;
    var type = [
        "https://a.tile.openstreetmap.org/",
        "https://c.tile.thunderforest.com/cycle/",
        "https://b.tile.thunderforest.com/transport/",
        "https://otile4-s.mqcdn.com/tiles/1.0.0/osm/",
        "https://c.tile.openstreetmap.fr/hot/"
    ];
    var server = type[index];
    var src = server + gridurl;

    
    var img = new img_item();
    img.onerror = this.imgevt;
    img.onfinish = this.imgevt;
    img.init({ wd:256,hg:256},src);
    img.render(item);
};

page.prototype.imgfunc = function(evt) {
    console.log(evt);
};

page.prototype.startfunc = function(evt) {
    var rel = posabsolute($('map') ,{ x: evt.ax, y: evt.ay } );
    var x = parseInt(rel.x / 256);
    var y = parseInt(rel.y / 256);
    
    $('positioncilck').innerHTML = rel.x + ":" + rel.y;
    
    console.log('start' + rel.x + ":" + rel.y);
    console.log('image' + x + ":" + y);
};

page.prototype.movefunc = function(evt) {
    var x = parseInt(evt.ax / 256);
    var y = parseInt(evt.ay / 256);
    
    $('grid').innerHTML = x + ":" + y;
    $('positionmove').innerHTML = evt.ax + ":" + evt.ay;
    //console.log('move' + evt.ax + ":" + evt.ay);
};

page.prototype.endfunc = function(evt) {
    //console.log('end' + evt.ax + ":" + evt.ay);
};