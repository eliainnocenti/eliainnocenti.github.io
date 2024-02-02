/*****************************************
CREATE OBJECT INSTANCES
*****************************************/
// initialize midground canvas
var midGr      = new Layer();
midGr.initLayer('midground-rndr');
// create tileMap sprite
var enemySheet   = new Sprite('resources/chars/wump-enemys.png');
// create new player object
var wumpus = new Actor();
console.log(wumpus);
wumpus.skin = 1;

//Placing the Wumpus

function setWumpusTile(tile) {
    var leftEdge, rightEdge, topEdge, botEdge;
    var tilesWide   = midGr.tilesWide,
        tilesHigh   = midGr.tilesHigh,
        totalTiles  = midGr.totalTiles;
    // check for left and right edges
//    if(tile.now % tilesWide === 0) {
//        leftEdge    = true;
//        console.log('your on the left edge')
//    }else if(tile.now % tilesWide === tilesWide - 1) {
//        rightEdge   = true;
//        console.log('your on the right edge')
//    };
//    // check for top and bottom edges
//    if(tile.now < tilesWide) {
//        topEdge     = true;
//        console.log('your on the top edge')
//    }else if(tile.now > totalTiles - tilesWide) {
//        botEdge     = true;
//        console.log('your on the bottom edge')
//    };
//    // set tile to left
//    if(leftEdge) {
//        tile.to_L   = tile.now + tilesWide - 1;
//    }else{
//        tile.to_L   = tile.now - 1;
//    };
//    // set tile to right
//    if(rightEdge) {
//        tile.to_R   = tile.now - tilesWide + 1;
//    }else{
//        tile.to_R   = tile.now + 1;
//    };
//    console.log(totalTiles)
//    // set tile to top
//    if(topEdge) {
//        tile.to_T   = tile.now + totalTiles - tilesWide;
//    }else{
//        tile.to_T   = tile.now - tilesWide;
//    };
//    // set tile to bottom
//    if(botEdge) {
//        tile.to_B   = tile.now - totalTiles + tilesWide;
//    }else{
//        tile.to_B   = tile.now + tilesWide;
//    }; 
    //This is just for testing purposes.
    console.log(totalTiles)
    topEdge = true;
    leftEdge = true;
    
    tile.to_B   = tile.now + tilesWide;
    tile.to_T   = tile.now + totalTiles - tilesWide;
    tile.to_L   = tile.now + tilesWide - 1;
    tile.to_R   = tile.now + 1;
    console.log(tile);
}

function spawnWumpus(seed,map) {
    var skinString  = wumpus.skin.toString,
        theSkin     = enemySheet.guide[wumpus.skin],
        pos         = wumpus.pos;
    //set current tile and surrounding tiles
    var tile        = wumpus.tile;
    tile.now        = seed.wump[0];
    setWumpusTile(tile);
    // set player position using spawn
    pos.x = map[tile.now].pos.x;
    pos.y = map[tile.now].pos.y;
    
    
    midGr.ctx.drawImage(
        enemySheet.image,
        theSkin.x,
        theSkin.y,
        midGr.tile.w,
        midGr.tile.h,
        pos.x,
        pos.y,
        midGr.tile.w,
        midGr.tile.h
    );
}


