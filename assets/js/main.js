(function ($) {
    "use strict";
    $(window).on('load', function () {
        $('.preloader').fadeOut(1000);
    })

    $(document).ready(function () {

        /*==== header Section Start here =====*/

        //Header
        var fixed_top = $(".header-section");
        $(window).on('scroll', function () {
            if ($(this).scrollTop() > 1) {
                fixed_top.addClass("header-fixed fadeInUp");
            } else {
                fixed_top.removeClass("header-fixed fadeInUp");
            }
        });


        $('.hamburger-menu').on('click', function () {
            $('.hamburger-menu .line-top, .line-bottom, .mobile_menu').toggleClass('current');
        });






        // lightcase 
        // $('a[data-rel^=lightcase]').lightcase();


        //Check to see if the window is top if not then display button
        $(window).scroll(function () {
            if ($(this).scrollTop() > 300) {
                $('.scrollToTop').css({
                    'bottom': '2%',
                    'opacity': '1',
                    'transition': 'all .5s ease'
                });
            } else {
                $('.scrollToTop').css({
                    'bottom': '-30%',
                    'opacity': '0',
                    'transition': 'all .5s ease'
                })
            }
        });
        //Click event to scroll to top
        $('.scrollToTop').on('click', function () {
            $('html, body').animate({
                scrollTop: 0
            }, 500);
            return false;
        });
    });

    //js for newsletter
    var b = $("#contact-form");
    var a = $("#form-messages");
    $(b).submit(function (d) {
        d.preventDefault();
        var c = $(b).serialize();
        $.ajax({
            type: "POST",
            url: $(b).attr("action"),
            data: c
        }).done(function (e) {
            $(a).removeClass("error");
            $(a).addClass("success");
            $(a).text(e);

            $("#email").val("");
        }).fail(function (e) {
            $(a).removeClass("success");
            $(a).addClass("error");
            if (e.responseText !== "") {
                $(a).text(e.responseText)
            } else {
                $(a).text("Oops! An error.")
            }
        })
    })
}(jQuery));