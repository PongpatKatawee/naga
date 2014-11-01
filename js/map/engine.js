/*
Index Engine Module
For Beta Map

Operation Web 1.0
Oct 2014
*/

var ow = new ow();

ow.creates = [ { obj:"pg",cls:"page" } ];
           
var tank = ow.tank;    
var sys = ow.sys;
           
ow.oldLoader = window.onload || function() {};

window.onload = function() {
    ow.renders = [ { obj:"pg", el:document.getElementById('page') } ];
    ow.start();
    ow.oldLoader.call(this);
};