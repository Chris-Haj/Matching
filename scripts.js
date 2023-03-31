let url = "https://api.disneyapi.dev/characters"

$(document).ready(function () {
    $("#starter").click(function () {
        $(".Game").hide(1000);
    });
    $("#addImgs").click(function () {
        $.getJSON(url, function (data) {
            let characters = data.data;
            let para = $("p");
            para.append(characters);
        });
    });
});
