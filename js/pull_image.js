function pull_abc() {
	
    var zoom = document.getElementById("zoom");
    var latitude = document.getElementById("lat");
    var longitude = document.getElementById("long");
    var a = document.getElementById("a");
    var b = document.getElementById("b");
    var c = document.getElementById("c");
    a.src = "https://" + a.id + ".tile.openstreetmap.org/"+ zoom.value +"/" + longitude.value + "/" + latitude.value + ".png";
    b.src = "https://" + b.id + ".tile.openstreetmap.org/"+ zoom.value +"/" + longitude.value + "/" + latitude.value + ".png";
    c.src = "https://" + c.id + ".tile.openstreetmap.org/"+ zoom.value +"/" + longitude.value + "/" + latitude.value + ".png";

}

function pull_image() {
    
    var zoom = document.getElementById("zoom");
    var latitude = document.getElementById("lat");
    var longitude = document.getElementById("long");
    var a = $('a');
    a.src = "http://a.tile.openstreetmap.org/"+ zoom.value +"/" + longitude.value + "/" + latitude.value + ".png";
    a.onerror = "http://b.tile.openstreetmap.org/"+ zoom.value +"/" + longitude.value + "/" + latitude.value + ".png";
    a.onerror = "http://c.tile.openstreetmap.org/"+ zoom.value +"/" + longitude.value + "/" + latitude.value + ".png";
}

function click_count (item_value, addID, reduceID) {

    if(isInt(parseInt(item_value.value))){
        addID.onclick = function() {
            item_value.value =  parseInt(item_value.value) + 1;
        };
        reduceID.onclick = function() {
            item_value.value =  parseInt(item_value.value) - 1;
        };
    }else{
        item_value.value = 0;
    };
    return item_value.value;

}

function isInt(n){
    return typeof n== "number" && isFinite(n) && n%1===0;

}

function isInRange(num ,min, max) {
    min = parseInt(min);
    max = parseInt(max);
    if (num < min || num > max) {
        return false;
    }else{
        return true;
    };
}

function loadImageMap(nametag, zoom, longitude, latitude) {//***
    
    var item = $(nametag);
    item.src = "http://a.tile.openstreetmap.org/"+ zoom + "/" + longitude + "/" + latitude + ".png";
    //if error load server B, C
}

