$(document).ready(function(){
    $('#select-event').selectize();

    $('#select-event').change(function() {
        var event = $(this).val();
        window.location.href = window.location.pathname+"?"+$.param({event:event})
    });

    $('#country-list').scrollTop($('.active').eq(1).offset().top);


    // Search country
    $('#search-country').on('cut input paste drop keyup', function() {
        var query = $(this).val().trim().toLowerCase();
        if (query == '')
            $('#country-list .country-container').show();
        else {
            $('#country-list .country-container').each(function() {
                if ($(this).data('name').trim().toLowerCase().indexOf(query) >= 0) {
                    $(this).show();
                }
                else {
                    $(this).hide();
                }
            });
        }
    });

});
