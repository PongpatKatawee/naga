/*
 * Operative Web
 * V 1.0 rev 02
 */

function ow() {
    this.creates = false;
    this.tool = {};
    
    console.log('Create Operative Web 1.1');
    
    this.createTool();
    this.createTank();
    this.createSystem();
    this.createAysn();
    this.createDataStructure();
    this.createUpload();
    
    console.log('Finish Create Operative Web 1.1');
    
    this.gets = new this.dictClass();
    this.getQueryVariable();
    
    this.process = new this.listClass();
}

ow.prototype.createProcess = function() {
    var process = new this.asynClass();
    
    this.process.add(process);
    
    return process;
};

// move in to sub tools namespace 
ow.prototype.cb = function(context,func) {
    return function(e) { return func.apply(context,[e]); };
};


ow.prototype.createTool = function() {
    
    function eventsClass() {
        this.clear();
    }

    eventsClass.prototype.clear = function() {
        this.setevent = [];
    };

    eventsClass.prototype.add = function(obj,func) {
        var evt = { scope:obj, func: func};
        this.setevent.push(evt);
    };

    eventsClass.prototype.fire = function(params) {
        var args = params || [];
    
        if (this.setevent.length > 0) {
            for (var i =0;i < this.setevent.length; i++) {
                var evtobj = this.setevent[i];
                evtobj.func.apply(evtobj.scope,args);
            }
        }
    };
    
    this.eventsClass = eventsClass;
};


ow.prototype.createUpload = function() {

    function uploadClass() {
        this.onpreview = false;
        this.onfinish = false;
        this.onprogress = false;
        
        this.fileInput = document.createElement("input");
        this.fileInput.type = "file";
        this.fileInput.setAttribute('name',"image_file");
    
        this.dataInput = document.createElement("input");
        this.dataInput.type = "text";
        this.dataInput.setAttribute('name',"data");

        this.actionInput = document.createElement("input");
        this.actionInput.type = "text";
        this.actionInput.setAttribute('name',"action");

        this.funcInput = document.createElement("input");
        this.funcInput.type = "text";
        this.funcInput.setAttribute('name',"function");

        this.form = document.createElement("form");

        this.form.setAttribute('enctype',"multipart/form-data");
        this.form.setAttribute('method',"post");
        this.form.appendChild(this.fileInput);
        this.form.appendChild(this.dataInput);
        this.form.appendChild(this.actionInput);
        this.form.appendChild(this.funcInput);
        
        this.addEvent(this.fileInput,"change",this,this.preview);
        console.log('create upload Class');
    }
    
    uploadClass.prototype.cb = function(context,func) {
        return function(e) { return func.apply(context,[e]); };
    };
    
    uploadClass.prototype.addEvent = function(obj, event, cobj , func) {
        if (obj) {
            if (obj.addEventListener) {
                obj.addEventListener(event, function (e) {
                    func.apply(cobj,[e]);
                }, false);
            } else if (obj.attachEvent) {
                obj.attachEvent('on'+event, function (e) {
                    func.apply(cobj,[e]);
            });
            }
        }
    };
    
    uploadClass.prototype.set = function(xurl,func,errorfunc) {
        /*
        this.xurl = xurl;
        this.ok = func;
        this.error = errorfunc || func;
        */
       
        //this.id = id;
        //this.uploadaction = action;
    };
    
    uploadClass.prototype.upload = function(xurl,action,func,tag) {
        this.xurl = xurl;
        this.actionInput.value = action;
        this.funcInput.value = func;
        this.dataInput.value = tag;
        
        //console.log(xurl + ":" + action + ":" + func + ":" + tag);
        
        this.fileInput.click(); 
    };
    
    uploadClass.prototype.preview = function() {
        var oFile = this.fileInput.files[0];
        //this.preview(oFile);  
        var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
    
        if (!rFilter.test(oFile.type)) { return false; }
    
        var fr = new FileReader();    
        fr.func = { scope: this, func: this.uptoserver }; 
        fr.onpreview = this.onpreview;
        
        fr.id = this.dataInput.value; 
        fr.action = this.actionInput.value;
    
        fr.onload = function (e) { 
            var obj = { id:this.id, action: "preview", uploadaction:this.action, src:e.target.result };
            if (this.onpreview) { this.onpreview.fire([obj]); }
            //--- Call finish view to upload data ---
            this.func.func.apply(this.func.scope, e );
        };
        
        //--- Start read file on client ---
        fr.readAsDataURL(oFile);   
    };
    
    uploadClass.prototype.uptoserver = function() {  
        console.log('ow up to server');
        var vFD = new FormData(this.form); 
        var oXHR = new XMLHttpRequest();        
    
        this.addEvent(oXHR.upload, 'progress', this , this.uploadProgress); 
        this.addEvent(oXHR, 'load', this , this.uploadFinish);
        oXHR.open('POST', this.xurl);
        oXHR.send(vFD);
    };
    
    uploadClass.prototype.uploadProgress = function(e) { // upload process in progress
        e = e || window.event;

        if (e.lengthComputable) {
            if (this.onprogress) { 
                var obj = { id: this.dataInput.value,
                            action: "progress",
                            uploadaction:this.actionInput.value ,
                            loaded:e.loaded , total:e.total };
                this.onprogress.fire([obj]); 
            }
        } 
    };
    
    uploadClass.prototype.uploadFinish = function(e) { // upload successfully finished   
        console.log('ow upload finish');
        
        var jobj = JSON.parse(e.target.responseText);

        var obj = { id: this.dataInput.value, 
                    action: "finish",
                    uploadaction:this.actionInput.value ,
                    src:jobj.thumbfile , 
                    msg:jobj.cloudid 
                };
        
        console.log(obj);
       
        if (this.onfinish) { this.onfinish.fire([obj]); }
    };

    this.uploadClass = uploadClass;
};

ow.prototype.createAysn = function() {
    
    function asynClass() {
        this.request = null;
        if (!window.XMLHttpRequest)
        { if (window.ActiveXObject) {
            this.request = new ActiveXObject("Microsoft.XMLHTTP");
            } else { alert("No Ajax"); }
        } else { this.request = new XMLHttpRequest();}

        this.xurl = "";
        this.data = "";

        this.ok = false; // { scope:null,func:null }
        this.error = false; // { scope:null,func:null }
    }
    
    asynClass.prototype.cb = function(context,func) {
        return function(e) { return func.apply(context,[e]); };
    };
    
    asynClass.prototype.set = function(xurl,func,errorfunc) {
        this.xurl = xurl;
        this.ok = func;
        this.error = errorfunc || func;
    };

    asynClass.prototype.addjsonbykey = function(key,obj) {
        this.data = this.add_param(this.data,this.pf2(key,  JSON.stringify(obj) ));
    };

    asynClass.prototype.adddatabykey = function(key,data) {
        this.data = this.add_param(this.data,this.pf2(key,data));
    };
    
    asynClass.prototype.postcall = function () {
        var curdate = new Date();
        var alltime = curdate.getTime();

        this.request.open("POST",this.xurl + "?&t=" + alltime);
        this.request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        this.request.onreadystatechange = this.cb(this,this.result);
    
        this.request.send(this.data);        
    };

    asynClass.prototype.getcall = function () {
        var curdate = new Date();
        var alltime = curdate.getTime();

        this.request.open("GET",this.xurl + "?&t=" + alltime);
        this.request.onreadystatechange = this.cb(this,this.result);
        this.request.send(null);
    };

    asynClass.prototype.result = function() {
        if (this.request.readyState === 4 && this.request.status === 200) {
            var content = this.request.responseText;
            this.render(content);
        } else {
		if (this.request.readyState === 4 && this.request.status !== 200) {
		    this.norender('');
		}
	}
    };

    asynClass.prototype.render = function(content) {
        if (this.ok) {
            var args = [content]; // empty array
            this.ok.func.apply(this.ok.scope,args);
        }
    };

    asynClass.prototype.norender = function(content) {
        if (this.nofunc) {
            var args = [content]; // empty array
            this.error.func.apply(this.error.scope,args);
        }
    };
   
    asynClass.prototype.pf2 = function(fl,vl) {
        return fl + "=" + encodeURIComponent(vl);
    };

    asynClass.prototype.add_param = function(data,vl) {
        if (data.length > 0) { data = data + "&";}
        return data + vl;
    };
    
    this.asynClass = asynClass;
    console.log('Asyn Created');
};


ow.prototype.createDataStructure = function() {
    function dictClass() {
        this.keys = [];
        this.values = []; 
    }

    dictClass.prototype = {
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
    
    function listClass() {  this.keys = []; }

    listClass.prototype = {
        add_at:function(key,pos) {
            if (!this.exist(key)) { this.keys.splice(pos, 0, key);  }
        },
        add:function(key) {
            if (!this.exist(key)) { this.keys.push(key); }
        },
        remove:function(key) { 
            this.keys.splice(this.keys.indexOf(key), 1);
        },
        remove_at:function(pos) {
            this.keys.splice(pos, 1);
        },
        get:function(key) {
            return this.keys[this.keys.indexOf(key)];
        },
        count:function() { return this.keys.length; },
        exist:function(key) {
            var inx = this.keys.indexOf(key);
        
            if (inx >=0) {
                return true;
            } else {
                return false;
            }
        }
    };
 
    this.dictClass = dictClass;
    this.listClass = listClass;
   
    console.log('Data structure Created');
};

ow.prototype.getQueryVariable = function() {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        
        this.gets.add(decodeURIComponent(pair[0]),decodeURIComponent(pair[1]));
    }
};

ow.prototype.createTank = function() {
    // define tank
    function tankClass() {
        this.keys = [];
        this.values = [];
    }

    tankClass.prototype = {
        create: function(core) {
            this.core = core;
            
            for (var i=0;i < this.core.length; i++) {
                var obj = this.core[i];
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

    this.tank = new tankClass();
    console.log("Tank Created");
};

ow.prototype.createSystem = function() {
    
    function systemClass() {
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

    systemClass.prototype.getPage = function() {
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

    systemClass.prototype.getViewport = function() {
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

    systemClass.prototype.getPosition = function() {
        this.position.top = window.pageYOffset || document.documentElement.scrollTop;
        this.position.left = window.pageXOffset || document.documentElement.scrollLeft;
    };

    systemClass.prototype.addEvent = function(obj, event, cobj , func) {
        if (obj) {
            if (obj.addEventListener) {
                obj.addEventListener(event, function (e) {
                    func.apply(cobj,[e]);
                }, false);
            } else if (obj.attachEvent) {
                obj.attachEvent('on'+event, function (e) {
                    func.apply(cobj,[e]);
            });
            }
        }
    };

    systemClass.prototype.detect = function() {
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
        
        this.addEvent(window,"resize",this,this.resize); 
        this.addEvent(window,"scroll",this,this.scroll); 
    };

    systemClass.prototype.scroll = function(e) {
        this.getPosition();
    
        if (this.onscroll) {  this.onscroll.fire([this.position]); }
    };

    systemClass.prototype.resize = function(e) {
        this.getPage();
        this.getViewport();
    
        if (this.onresize) { this.onresize.fire([this.viewport]); }
    };
    
    this.sys = new systemClass();
    console.log("System Created");
};

ow.prototype.start = function() {

    if (this.creates) {  this.tank.create(this.creates);  }
    this.sys.detect();
    if (this.renders) {
        for (var i=0;i < this.renders.length; i++) {
            var render = this.renders[i];
            this.tank.get(render.obj).render(render.el); 
        }
    }
    
    console.log('Start Operative Web 1.0');
};