/*****************************************
CREATE OBJECT TEMPLATES
*****************************************/
var Layer   = function(options) {
    this.canvas     = null;
    this.ctx        = null;
    this.initLayer  = function(canvas_id) {
        this.canvas     = document.getElementById(canvas_id);
        this.ctx        = this.canvas.getContext('2d');
        return this.context;
    };
    this.tile       = {
        w   : 32,
        h   : 32
    };
    this.creator    = {
        x   : 0,
        y   : 0
    }; 
    // **** THE BIG MAP TEST ****
    // Note that you only have to change these variables and
    // the resolution of the map to re size the whole game. 
    // I'm trying to keep everything as robust and changable as this.
    // this.tilesWide  = 50;
    // this.tilesHigh  = 50;
    this.tilesWide  = 7;
    this.tilesHigh  = 7;
    this.totalTiles = this.tilesWide * this.tilesHigh;
    // set background color
    this.backGrColor = '#080845';
}
var Actor   = function() {
    this.skin   = 1;
    this.pos    = {
        x : 0,
        y : 0 
    };
    this.tile   = {
        to_L    : null,
        to_R    : null,
        to_T    : null,
        to_B    : null
    } 
}
var Sprite  = function(filePath) {
    this.image      = new Image();
    this.image.src  = filePath;
    // eventually you should dynamically create guides.
    // This method asumes that all sprite sheets are 
    // 8 tiles wide and only have 12 tiles used
    this.guide      = {
        "1"    : {  "x": 0 ,  "y": 0  },
        "2"    : {  "x": 32,  "y": 0  },
        "3"    : {  "x": 64,  "y": 0  },
        "4"    : {  "x": 96,  "y": 0  },
        "5"    : {  "x": 128, "y": 0  },
        "6"    : {  "x": 160, "y": 0  },
        "7"    : {  "x": 192, "y": 0  },
        "8"    : {  "x": 224, "y": 0  },
        "9"    : {  "x": 0,   "y": 32 },
        "10"   : {  "x": 32,  "y": 32 },
        "11"   : {  "x": 64,  "y": 32 },
        "12"   : {  "x": 96,  "y": 32 },
        "13"   : {  "x": 128, "y": 32 }
    };
}