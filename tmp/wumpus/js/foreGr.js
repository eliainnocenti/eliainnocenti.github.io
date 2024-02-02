/*****************************************
CREATE OBJECT INSTANCES
*****************************************/
// initialize foreground canvas
var foreGr      = new Layer();
foreGr.initLayer('foreground-rndr');
// create tileMap sprite
var charSheet   = new Sprite('resources/chars/wump-chars.png');
// create new player object
var player = new Actor();
console.log(player);

player.states = [
    'center',
    'top-left',
    'bottom-right',
    'top-right',
    'bottom-left'
]
player.state = 'center';

/*****************************************
DEFINE FUNCTIONS
*****************************************/
function setPlayerTile(tile) {
    var leftEdge, rightEdge, topEdge, botEdge;
    var tilesWide   = foreGr.tilesWide,
        tilesHigh   = foreGr.tilesHigh,
        totalTiles  = foreGr.totalTiles;
    // check for left and right edges
    if(tile.now % tilesWide === 0) {
        leftEdge    = true;
        console.log('your on the left edge')
    }else if(tile.now % tilesWide === tilesWide - 1) {
        rightEdge   = true;
        console.log('your on the right edge')
    };
    // check for top and bottom edges
    if(tile.now < tilesWide) {
        topEdge     = true;
        console.log('your on the top edge')
    }else if(tile.now > totalTiles - tilesWide -1) {
        botEdge     = true;
        console.log('your on the bottom edge')
    };
    // set tile to left
    if(leftEdge) {
        tile.to_L   = tile.now + tilesWide - 1;
    }else{
        tile.to_L   = tile.now - 1;
    };
    // set tile to right
    if(rightEdge) {
        tile.to_R   = tile.now - tilesWide + 1;
    }else{
        tile.to_R   = tile.now + 1;
    };
    console.log(totalTiles)
    // set tile to top
    if(topEdge) {
        tile.to_T   = tile.now + totalTiles - tilesWide;
    }else{
        tile.to_T   = tile.now - tilesWide;
    };
    // set tile to bottom
    if(botEdge) {
        tile.to_B   = tile.now - totalTiles + tilesWide;
    }else{
        tile.to_B   = tile.now + tilesWide;
    }; 
    console.log(tile);
}

function spawnPlayer(seed,map) {
    var skinString  = player.skin.toString,
        theSkin     = charSheet.guide[player.skin],
        pos         = player.pos;
    //set current tile and surrounding tiles
    var tile        = player.tile;
    tile.now        = seed.spawn[0];
    setPlayerTile(tile);
    // set player position using spawn
    pos.x = map[tile.now].pos.x;
    pos.y = map[tile.now].pos.y;
//    console.log(map);
    foreGr.ctx.drawImage(
        charSheet.image,
        theSkin.x,
        theSkin.y,
        foreGr.tile.w,
        foreGr.tile.h,
        pos.x,
        pos.y,
        foreGr.tile.w,
        foreGr.tile.h
    );
}

function movePlayer(where,map) {
    var pos     = player.pos;
    // clear old location
    foreGr.ctx.clearRect(
        pos.x,
        pos.y,
        foreGr.tile.w,
        foreGr.tile.h
    );
    // set new tile
    var newTile = getNewTile(where,map);
    // set new player graphic
    var theSkin = charSheet.guide[player.skin];
    // clear the fog 
    clearPath(newTile,where);
    // set visited to true
    newTile.visited = true;
    // draw new location
    foreGr.ctx.drawImage(
        charSheet.image,
        theSkin.x,
        theSkin.y,
        foreGr.tile.w,
        foreGr.tile.h,
        newTile.pos.x,
        newTile.pos.y,
        foreGr.tile.w,
        foreGr.tile.h
    );
}

function getNewTile(where,map) {
    var newTile = {};
    
    newTile = map[player.tile[where]];
    // set new player position
    player.pos.x = newTile.pos.x;
    player.pos.y = newTile.pos.y;
    player.tile.now = player.tile[where];
    setPlayerTile(player.tile);
    // select correct player graphic
    if(where === 'to_T'){
        if(newTile.type === 'bends-top-right') {
            player.skin     = 5;
        } else if (newTile.type === 'bends-top-left') {
            player.skin     = 3;
        } else {
            player.skin     = 1;
        }
    } else if(where === 'to_B'){
        if(newTile.type === 'bends-top-right') {
            player.skin     = 4;
        } else if (newTile.type === 'bends-top-left') {
            player.skin     = 2;
        } else {
            player.skin     = 1;
        }
    } else if(where === 'to_L'){
        if(newTile.type === 'bends-top-right') {
            player.skin     = 4;
        } else if (newTile.type === 'bends-top-left') {
            player.skin     = 3;
        } else {
            player.skin     = 1;
        }
    } else if(where === 'to_R'){
        if(newTile.type === 'bends-top-right') {
            player.skin     = 5;
        } else if (newTile.type === 'bends-top-left') {
            player.skin     = 2;
        } else {
            player.skin     = 1;
        }
    }
    // set current player state
    player.state = player.states[player.skin - 1];
    // return the new tile
    return newTile;
    
}
// this function means you cannot stand on tunnels
function getNewTileSlide(where,map) {
    var newTile = {};
    
    while(newTile.type != 'four-door') {
        
        newTile = map[player.tile[where]];


        player.pos.x = newTile.pos.x;
        player.pos.y = newTile.pos.y;
        player.tile.now = player.tile[where];
        setPlayerTile(player.tile);

        if(where === 'to_T'){
            if(newTile.type === 'bends-top-right') {
                where = 'to_L';
                continue;
            } else if (newTile.type === 'bends-top-left') {
                where = 'to_R';
                continue;
            }
        } else if(where === 'to_B'){
            if(newTile.type === 'bends-top-right') {
                where = 'to_R';
                continue;
            } else if (newTile.type === 'bends-top-left') {
                where = 'to_L';
                continue;
            }
        } else if(where === 'to_L'){
            if(newTile.type === 'bends-top-right') {
                where = 'to_T';
                continue;
            } else if (newTile.type === 'bends-top-left') {
                where = 'to_B';
                continue;
            }
        } else if(where === 'to_R'){
            if(newTile.type === 'bends-top-right') {
                where = 'to_B';
                continue;
            } else if (newTile.type === 'bends-top-left') {
                where = 'to_T';
                continue;
            }
        }
    }
    
    return newTile;
    
}













    
    
