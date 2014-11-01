//--- String Tools ---
function trim(stringToTrim) {
    if (stringToTrim) {
        return stringToTrim.replace(/^\s+|\s+$/g,"");
    } else { return ""; } 
}

function ltrim(stringToTrim) {
	return stringToTrim.replace(/^\s+/,"");
}

function rtrim(stringToTrim) {
	return stringToTrim.replace(/\s+$/,"");
}

function chr(charcode) {
    return String.fromCharCode(charcode);
}

//--- DOM Tools ---
function $(id) {  return document.getElementById(id); }

function gettarget(e) {
    var targ = {};
   
    if (e) {
        if (e.target) targ = e.target;
        else if (e.srcElement) targ = e.srcElement;
        if (targ.nodeType === 3) // defeat Safari bug
            targ = targ.parentNode;
    }
    return targ;   
}

function cb(context,func) {
    return function(e) { return func.apply(context,[e]); };
}

function addEvent(obj, event, cobj , func) {
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
}

function posabsolute(el,pos) {
    var posx = pos.x - el.offsetLeft;
    var posy = pos.y - el.offsetTop;
    
    return { x:posx , y: posy};
}

function posrelative(el,pos) {
    var posx = pos.x + el.offsetLeft;
    var posy = pos.y + el.offsetTop;
    
    return { x:posx , y: posy};
}

//--- Setting Tool ---
function setposition(el,frame) {
    if (typeof frame.top    !== "undefined") { el.style.top    = frame.top + "px"; }
    if (typeof frame.left   !== "undefined") { el.style.left   = frame.left + "px"; }
    if (typeof frame.right  !== "undefined") { el.style.right  = frame.right + "px"; }
    if (typeof frame.bottom !== "undefined") { el.style.bottom = frame.bottom + "px"; }
}

function setbgcolor(el,color) {
    if (color.length > 0) {
        el.style.backgroundColor = color;
    } else {
        el.style.backgroundColor = "transparent";
    }
}

//---
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    //console.log('Query variable %s not found', variable);
}