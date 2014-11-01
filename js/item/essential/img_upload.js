function img_upload() {  
    this.input = null;
    this.form = null;
    this.data = null;
    
    this.fname = "takky";
    this.onpreview = false;
    this.onfinish = false;
    
    this.id = "";
    this.uploadaction = "";
    
    this.serviceurl = '../srv/mvps/service.php';
    
    this.label = false;
}

img_upload.prototype.init = function(id,action,func) {
    this.id = id;
    this.uploadaction = action;
    
    //--- bind with the container    
    this.input = document.createElement("input");
    this.input.type = "file";
    this.input.setAttribute('name',"image_file");
    
    this.data = document.createElement("input");
    this.data.type = "text";
    this.data.setAttribute('name',"data");

    this.action = document.createElement("input");
    this.action.type = "text";
    this.action.setAttribute('name',"action");
    this.action.value = action;
    
    this.func = document.createElement("input");
    this.func.type = "text";
    this.func.setAttribute('name',"function");
    this.func.value = func;
    
    this.form = document.createElement("form");

    this.form.setAttribute('enctype',"multipart/form-data");
    this.form.setAttribute('method',"post");
    this.form.appendChild(this.input);
    this.form.appendChild(this.data);
    this.form.appendChild(this.action);
    this.form.appendChild(this.func);
    
    this.input.onchange = cb(this,this.do_preview);
    
     //<input id="myFileInput" type="file" accept="image/*;capture=camera">
};


img_upload.prototype.do_upload = function() { this.input.click(); };

// get selected file element
img_upload.prototype.do_preview = function() {
    var oFile = this.input.files[0];
    this.preview(oFile);  
    
    this.data.value = this.fname;
};

img_upload.prototype.preview = function(oFile) {
    var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
    
    if (!rFilter.test(oFile.type)) { return false; }
    
    var fr = new FileReader();    
    fr.func = { scope: this, func: this.finish_view }; 
    fr.onpreview = this.onpreview;
    fr.id = this.id;
    fr.action = this.uploadaction;
    
    fr.onload = function (e) { 
        var obj = { id:this.id, action: "preview", uploadaction:this.action, src:e.target.result };
        if (this.onpreview) { this.onpreview.fire([obj]); }
        this.func.func.apply(this.func.scope, e );
    };
    
    fr.readAsDataURL(oFile);   
    return true;
};

img_upload.prototype.finish_view = function() {    
    var vFD = new FormData(this.form); 
    
    // create XMLHttpRequest object, adding few event listeners, and POSTing our data
    var oXHR = new XMLHttpRequest();        
    
    oXHR.upload.addEventListener('progress', cb(this,this.uploadProgress), false);
    
    addEvent(oXHR, 'load', this , this.uploadFinish);
    oXHR.open('POST', this.serviceurl);
    oXHR.send(vFD);
};

img_upload.prototype.uploadProgress = function(e) { // upload process in progress
    e = e || window.event;
    
    if (e.lengthComputable) {
        var iPercentComplete = Math.round(e.loaded * 100 / e.total);
        
        //console.log(this.label);
        
        if (this.label) {
            this.label.setVisible(true);
            this.label.setText(iPercentComplete + "%");
            
            if (iPercentComplete === 100) {
                this.label.setVisible(false);
            }
        
        }
        
        
        //iBytesUploaded = e.loaded;
        //iBytesTotal = e.total;
        //var iPercentComplete = Math.round(e.loaded * 100 / e.total);
        //var iBytesTransfered = bytesToSize(iBytesUploaded);

        //document.getElementById('progress_percent').innerHTML = iPercentComplete.toString() + '%';
        //document.getElementById('progress').style.width = (iPercentComplete * 4).toString() + 'px';
        //document.getElementById('b_transfered').innerHTML = iBytesTransfered;
        
        //console.log(iPercentComplete.toString() + '%');
        
        //if (iPercentComplete == 100) {
            //var oUploadResponse = document.getElementById('upload_response');
            //oUploadResponse.innerHTML = '<h1>Please wait...processing</h1>';
            //oUploadResponse.style.display = 'block';
            //this.progress.style.display = "none";
        //} else {
            //this.progress.style.width = (100 - iPercentComplete) + "%";
        //}
    } else {
        //document.getElementById('progress').innerHTML = 'unable to compute';
    }
};


img_upload.prototype.uploadFinish = function(e) { // upload successfully finished   
    var jobj = JSON.parse(e.target.responseText);

    var obj = { id: this.id, 
                action: "finish",
                uploadaction:this.uploadaction ,
                src:jobj.thumbfile , 
                msg:jobj.cloudid 
            };
    
    if (this.label) {
        this.label.setVisible(false);
    }
    
    if (this.onfinish) { 
        this.onfinish.fire([obj]);
    }
};

