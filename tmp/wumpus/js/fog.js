/*****************************************
CREATE OBJECT INSTANCES
*****************************************/
// initialize fog canvas
var fog      = new Layer();
fog.initLayer('fog-rndr');
// cover the whole map in blue
function coverMap() {
    fog.ctx.fillStyle = fog.backGrColor;
    fog.ctx.fillRect(
        0,0,
        fog.tile.w * fog.tilesWide,
        fog.tile.h * fog.tilesHigh
    );
}
function clearPath(tile, where) {
    fog.ctx.clearRect(
        player.pos.x,
        player.pos.y,
        fog.tile.w,
        fog.tile.h
    );
    if(!tile.visited) {
        if(tile.type === 'bends-top-right') {
            if(where === 'to_R' || where === 'to_T'){
                console.log('bottom-left-cover');
                drawOverlay('12',where);
            } else {
                console.log('top-right-cover');
                drawOverlay('13',where);
            }
        } else if(tile.type === 'bends-top-left')  {
            if(where === 'to_R' || where === 'to_B'){
                console.log('top-left-cover');
                drawOverlay('9',where);
            } else {
                console.log('bottom-right-cover');
                drawOverlay('10',where);
            }
        }
    }
    if(tile.visited) {
    
    }
}
function drawOverlay(tileNumber, where) {
    var theTile     = tileMap.guide[tileNumber];
    fog.ctx.drawImage(
        tileMap.image,
        theTile.x,
        theTile.y,
        fog.tile.w,
        fog.tile.h,
        player.pos.x,
        player.pos.y,
        fog.tile.w,
        fog.tile.h
    );
}



