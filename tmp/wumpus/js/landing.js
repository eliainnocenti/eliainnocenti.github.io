//initiate closing animation on button hover
$("#button-btn").mouseover(function(){
    $('#top-closein,#bot-closein').css('transition', '2.75s ease-in');
    $('#top-closein').css('top', '0');
    $('#bot-closein').css('bottom', '0');
    //start page change animation (3s)
    $(this).delay( 3000 ).queue(function(){
        window.location.href = "main.html"
    });
});
//cancels closing animation on mouse out
$("#button-btn").mouseout(function(){
    $('#top-closein,#bot-closein').css('transition', '.2s ease-out');
    $('#top-closein').css('top', '-50vh');
    $('#bot-closein').css('bottom', '-50vh');
    //stops page change animation
    $(this).clearQueue();
});

