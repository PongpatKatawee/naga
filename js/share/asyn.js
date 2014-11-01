  function asyn() {
    this.request = null;
    if (!window.XMLHttpRequest)
    {   if (window.ActiveXObject) {
            this.request = new ActiveXObject("Microsoft.XMLHTTP");
        } else { alert("No Ajax"); }
    } else { this.request = new XMLHttpRequest();}

    this.xurl = "";
    this.data = "";
    this.parent = null;
    
    this.ok = false; // { scope:null,func:null }
    this.error = false; // { scope:null,func:null }
}

asyn.prototype.set = function(parent,xurl,func,errorfunc) {
   this.parent = parent;
   this.xurl = xurl;
   this.ok = func;
   this.error = errorfunc || func;
};


asyn.prototype.addjsonbykey = function(key,obj) {
    this.data = this.add_param(this.data,this.pf2(key,  JSON.stringify(obj) ));
};

asyn.prototype.adddatabykey = function(key,data) {
    this.data = this.add_param(this.data,this.pf2(key,data));
};

asyn.prototype.adddatabyinput = function(id) {
    this.data = this.add_param(this.data,this.pf(id));
};

asyn.prototype.postcall = function () {
    var curdate = new Date();
    var alltime = curdate.getTime();

    this.request.open("POST",this.xurl + "?&t=" + alltime);
    this.request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    this.request.onreadystatechange = cb(this,this.result);
    
    this.request.send(this.data);        
};

asyn.prototype.getcall = function () {
    var curdate = new Date();
    var alltime = curdate.getTime();

    this.request.open("GET",this.xurl + "?&t=" + alltime);
    this.request.onreadystatechange = cb(this,this.result);
    this.request.send(null);
};

asyn.prototype.result = function() {
        if (this.request.readyState === 4 && this.request.status === 200) {
            var content = this.request.responseText;
            this.render(content);
        } else {
		if (this.request.readyState === 4 && this.request.status !== 200) {
		    this.norender('');
		}
	 }
};

asyn.prototype.render = function(content) {
     if (this.ok) {
         var args = [content]; // empty array
         this.ok.func.apply(this.ok.scope,args);
     }
};

asyn.prototype.norender = function(content) {
     if (this.nofunc) {
         var args = [content]; // empty array
         this.error.func.apply(this.error.scope,args);
     }
};

asyn.prototype.pf = function(id) {
    return id + "=" + encodeURIComponent($(id).value);
};

asyn.prototype.pf2 = function(fl,vl) {
    return fl + "=" + encodeURIComponent(vl);
};

asyn.prototype.add_param = function(data,vl) {
    if (data.length > 0) { data = data + "&";}
    return data + vl;
};
