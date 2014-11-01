/*
    Page for home.html 
    Water
    Oct 2014
*/

function page(parent) {
    this.parent = parent;
    this.container = false;
  
}

page.prototype.render = function(container) {
    if (container) {
        this.container = container;

        $('submit').onclick = function() { pull_abc(); };

        $('a').src="https://a.tile.openstreetmap.org/9/264/169.png";
        $('b').src="https://b.tile.openstreetmap.org/9/265/169.png";
        $('c').src="https://c.tile.openstreetmap.org/9/265/169.png";
    }
};
