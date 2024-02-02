/*****************************************
CREATE OBJECT INSTANCES
*****************************************/
// initialize background canvas
var backGr      = new Layer();
backGr.initLayer('background-rndr');
// create test to indicate wich canvas this is
backGr.test     = 'this is the background renderer';
// create the map tile template that is unique to the background
backGr.mapTile  = function(){
    this.num    = 1;
    this.doors  = ['up','down','left', 'right'];
    this.type   = 'four-door';
    this.pos    = {
        x : 0,
        y : 0
    };
    this.coords = {
        x : 0,
        y : 0
    };
    this.visited= false;
};
// create tileMap sprite
var tileMap   = new Sprite('resources/tiles/wump-tiles.png');
/*****************************************
DEFINE FUNCTIONS
*****************************************/
function genMap(seed) {
    // main function
//    var seed        = genBasicSeed(),
    var tempMap     = [];
    // add a basic tile object for each tile on map to tempMap
    for(var dex = 0; dex < backGr.totalTiles; dex ++){
        tempMap.push(new backGr.mapTile);
    }
    console.log('-- Game Seed Object --');
    console.log(seed);
    for (var i = 0; i < seed.firstHalf.length ; i++) {
        tempMap[seed.firstHalf[i]].num      = 8;
        tempMap[seed.firstHalf[i]].type     = 'bends-top-left';
        tempMap[seed.secondHalf[i]].num     = 11;
        tempMap[seed.secondHalf[i]].type    = 'bends-top-right';
    }
    // change this to map when ready
    return tempMap;
}
function drawTile(tileNumber,creator,index) {
    var theTile = tileMap.guide[tileNumber];
    // ******* EDIT THIS ***********
    backGr.map[index].pos.x     = creator.x;
    backGr.map[index].coords.x  = creator.x / 32;  
    backGr.map[index].pos.y     = creator.y;
    backGr.map[index].coords.y  = creator.y / 32;  
    backGr.ctx.clearRect(
        backGr.creator.x,
        backGr.creator.y,
        backGr.tile.w,
        backGr.tile.h
    );
    backGr.ctx.drawImage(
        tileMap.image,
        theTile.x,
        theTile.y,
        backGr.tile.w,
        backGr.tile.h,
        backGr.creator.x,
        backGr.creator.y,
        backGr.tile.w,
        backGr.tile.h
    );
}
function renderBg() {
    for(var tilesRndrd = 1;
        tilesRndrd <= backGr.totalTiles ;
        tilesRndrd++) {
        // find which tile should be used
        var mapIndex    = tilesRndrd - 1,
            tileNumber  = backGr.map[mapIndex].num.toString();
        // draw a tile and move along in the x axis
        if (backGr.creator.x < backGr.canvas.width) {
            // ******* EDIT THIS ***********
            drawTile(tileNumber,backGr.creator,mapIndex);
            backGr.creator.x += backGr.tile.w;
        // start new row of tiles
        } else if (backGr.creator.x = backGr.canvas.width) {
            backGr.creator.x = 0;
            backGr.creator.y += backGr.tile.h;
            // ******* EDIT THIS ***********
            drawTile(tileNumber,backGr.creator,mapIndex);
            backGr.creator.x += backGr.tile.w;
        }
    }
}
