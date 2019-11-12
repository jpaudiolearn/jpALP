$(document).ready(function(){
    var audio = document.getElementById("audio");
    $("#add-new").click(function(){
      $("#main").toggleClass("hidden");
      $("#form-bg").toggleClass("hidden");
    });
    $("#test-arena").click(function(){
        $("#main").toggleClass("hidden");
        $("#output-audio").toggleClass("hidden");
        outputAudio(audio);
    });
    $(".home").click(function(){
        $("#main").toggleClass("hidden");
        if(!$("#form-bg").hasClass("hidden"))
        {
            $("#form-bg").toggleClass("hidden")
        }
        else if(!$("#output-audio").hasClass("hidden"))
        {
            $("#output-audio").toggleClass("hidden")
            audio.pause();
        }
    });
    /* attach a submit handler to the form */
    $('#add-new-word-form').submit(function (event)
    {
        /* stop form from submitting normally */
        event.preventDefault();

        /* get some values from elements on the page: */
        var $form = $(this),
        data = $form.serialize(),
        url = $form.attr('action');
        regEx_jp = /[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+[々〆〤]+/;
        regEx_en = /[a-zA-Z0-9]+|[ａ-ｚＡ-Ｚ０-９]+/;
        jp = $('input[name="japaneseWord"]').val();
        en = $('input[name="englishWord"]').val();
        if(!regEx_jp.test(jp))
        {
            $.alert({
                title: 'Alert!',
                content: 'enter proper japanese word',
            });
            return false;
        }
        else if(!regEx_en.test(en))
        {
            $.alert({
                title: 'Alert!',
                content: 'enter proper english word',
            });
            return false;
        }
        $(".status").html("<p>contacting database</p>")
        /* Send the data using post */
        var posting = $.post(url, data, function(response)
        {
            $(".status").html("<p>"+response+"</p>");
            $.alert({
                title: 'Success!',
                content: 'Inserted Data',
            });
        });
    });
});
function outputAudio(audio){
    $("#output-audio .msg").html("Loading the test");
    var url;
    var posting = $.post("/api/v1/output", function(response)
    {
        $("#output-audio .msg").html("created the test...Start now");
        audio.setAttribute("src",response);
        audio.load();
        audio.play();
    });
}
