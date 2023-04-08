let url = "https://api.disneyapi.dev/characters"
$(document).ready(function () {
    // $(".Game").hide();

    $("#starter").click(function () {
        $(".Game").show(1000);
    });
    $("#addImgs").click(function () {
        $.getJSON(url, function (data) {
            let characters = data;
            let para = $("#para");
            para.append(characters);
        });
    });

});

//https://theonlineadvertisingguide.com/wp-content/uploads/2013/08/125x125.jpg