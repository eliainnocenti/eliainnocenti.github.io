/*****************************************
MAIN FUNCTIONS
*****************************************/
function genSeed() {
    //create shuffle function
    function shuffle(array) {
        var i = array.length,
            j = 0,
            temp;
        while (i--) {
            j = Math.floor(Math.random() * (i+1));
            // swap randomly chosen element with current element
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    // create Start array generator
    function genStartArray() {
        var array = [];
        for (var i = 0; i < backGr.totalTiles; i++) {
            array.push(i);
        }
        return array;
    }
    // gen seed
    var seedLength  = Math.floor(backGr.totalTiles / 4),
        halfSeed    = Math.floor(seedLength / 2);
    // create start array based on the amount of tiles
    var startArray  = genStartArray();
    // shuffle the start array
    var ranNums     = shuffle(startArray);
    // take the first ten numbers
    var ranTen      = ranNums.splice(0, seedLength),
        playerSpawn = ranNums.splice(0,1),
        wumpSpawn   = ranNums.splice(0,1); 
    // create the basic seed object 
    var basicSeed = {};
    basicSeed.firstHalf   = ranTen.splice(0,halfSeed);
    basicSeed.secondHalf  = ranTen;
    basicSeed.spawn       = playerSpawn;
    basicSeed.wump        = wumpSpawn; 

    return basicSeed;
}
/*****************************************
RUN GAME
*****************************************/


// ensure all images are loaded fully    
$(window).on('load', function() {
    var seed = genSeed();
    backGr.map = genMap(seed);
    renderBg();
    spawnPlayer(seed,backGr.map);
    spawnWumpus(seed,backGr.map);
    coverMap();
    clearPath( backGr.map[player.tile.now],'nowhere');
    // fade in animation
    $("#opening").fadeOut();
    
    window.addEventListener('keydown', function(e) {
        console.log(e);
        console.log(player.state);
        
        var checkKey = function(code, where) {
            if(e.keyCode === code) {
                movePlayer(where, backGr.map)
            }
        }
        
        if (player.state != 'center') {
            if (player.state === 'top-left' || player.state === 'bottom-left') {
                checkKey(37, 'to_L');
            } else if (player.state === 'top-right' || player.state === 'bottom-right') {
                checkKey(39, 'to_R');
            }
            if (player.state === 'top-left' || player.state === 'top-right') {
                checkKey(38, 'to_T');
            } else if (player.state === 'bottom-left' || player.state === 'bottom-right') {
                checkKey(40, 'to_B');
            }
        } else {
            checkKey(38, 'to_T');
            checkKey(40, 'to_B');
            checkKey(37, 'to_L');
            checkKey(39, 'to_R');
        }
    }, false);
    
    foreGr.canvas.addEventListener('mousedown', function(e) {
        var tileSize = getTileDimen(); 
        // set x and y coords of the click event
        var x = e.x, y = e.y;
        x -= backGr.canvas.parentNode.offsetLeft;
        y -= backGr.canvas.parentNode.offsetTop;
        
        var clntPos = function() {
            this.x      = 0;
            this.y      = 0;
            this.where  = null;
            this.getXY  = function() {
                this.x  = backGr.map[player.tile[this.where]].coords.x * tileSize.w;
                this.y  = backGr.map[player.tile[this.where]].coords.y * tileSize.h;
            };
            this.check  = function() {
                if (x > this.x && x <= this.x + tileSize.w &&
                    y > this.y && y <= this.y + tileSize.h) {

                    console.log(this.where);
                    movePlayer(this.where, backGr.map);
                }
            };
        }
        // define client positions
        var clntPos_L = new clntPos(),
            clntPos_R = new clntPos(),
            clntPos_T = new clntPos(),
            clntPos_B = new clntPos();
        // set the where 
        clntPos_L.where = 'to_L';
        clntPos_R.where = 'to_R';
        clntPos_T.where = 'to_T';
        clntPos_B.where = 'to_B';
        // get the x and y
        clntPos_L.getXY();
        clntPos_R.getXY();
        clntPos_T.getXY();
        clntPos_B.getXY();
        // check if the tiles have been clicked
        if (player.state != 'center') {
            if (player.state === 'top-left' || player.state === 'bottom-left') {
                clntPos_L.check();
            } else if (player.state === 'top-right' || player.state === 'bottom-right') {
                clntPos_R.check();
            }
            if (player.state === 'top-left' || player.state === 'top-right') {
                clntPos_T.check();
            } else if (player.state === 'bottom-left' || player.state === 'bottom-right') {
                clntPos_B.check();
            }
        } else {
            clntPos_L.check();
            clntPos_R.check();
            clntPos_T.check();
            clntPos_B.check();
        }
//        console.log(clntPos_T);
//        console.log(backGr.map[player.tile.to_T]);
//        console.log(x + ' -- ' + y);
//        console.log(tileSize);
//        console.log(tileSize.w + ' x ' + tileSize.h);
    }, false);
    
    function getTileDimen(){
        var tileDimen   = {};
        tileDimen.w     = backGr.canvas.clientWidth / backGr.tilesWide;
        tileDimen.h     = backGr.canvas.clientHeight / backGr.tilesHigh;
        return tileDimen;
    }
    
    setInterval(function(){
    
    },30);
});


















