$(document).ready(function(){
    $("#add-new").click(function(){
      $("#main").toggleClass("hidden");
      $("#form-bg").toggleClass("hidden");
    });
    $("#test-arena, test-arena").click(function(){
        $("#main").toggleClass("hidden");
        $(".secondary").toggleClass("hidden");
    });
    $("#home").click(function(){
        $("#main").toggleClass("hidden");
        if(!$("#form-bg").hasClass("hidden"))
        {
            $("#form-bg").toggleClass("hidden")
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

        /* Send the data using post */
        var posting = $.post(url, data, function(response)
        {
            alert(response);
            /* Put the results in a div */
            // var content = $(response).find('#summary');
            // $('#result').empty().append(content);
        });
    });
});