$("#leave-comment").on("click", function(e) {
    var name = $("#name").val().trim();
    var comment = $("#body").val().trim();

    if (name === "") {
        e.preventDefault();
        $(".warning").html("Name is required");
    }

    if (comment === "") {
        e.preventDefault();
        $(".warning").html("Text field is empty");
    }

    if (name === "" && comment === "") {
        e.preventDefault();
        $(".warning").html("Input fields are empty");
    }


})


$("#nav-toggle").on("click", function() {
    $("#nav-links").fadeToggle().css("display", "inline-block")
});