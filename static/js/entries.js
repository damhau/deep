var originalEntries = [];
var entries = [];


function filterEntries(clear, filterFunction) {
    if (clear) {
        entries = originalEntries;
        refreshList();
        return;
    }

    entries = [];
    for (var i=0; i < originalEntries.length; ++i) {
        var entry = $.extend(true, {}, originalEntries[i]);
        entry.informations = entry.informations.filter(filterFunction);

        if (entry.informations.length > 0)
            entries.push(entry);
    }
    refreshList();
}

$(document).ready(function(){
    $('#sources-filter').selectize();
    $('#users-filter').selectize();
    $('#date-modified-filter').selectize();
    var areasSelectize = $('#areas-filter').selectize();
    $('#affected-groups-filter').selectize();
    $('#vulnerable-groups-filter').selectize();
    $('#specific-needs-groups-filter').selectize();
    $('#pillars-filter').selectize();
    $('#subpillars-filter').selectize();
    $('#sectors-filter').selectize();
    $('#subsectors-filter').selectize();
    $('#reliabilities-min-filter').selectize();
    $('#reliabilities-max-filter').selectize();
    $('#severities-min-filter').selectize();
    $('#severities-max-filter').selectize();

    $.getJSON("/api/v1/entries/?event="+eventId, function(data){
        originalEntries = data;
        entries = data;

        // Get areas options
        for (var i=0; i<entries.length; ++i) {
            for (var j=0; j<entries[i].informations.length; ++j) {
                var info = entries[i].informations[j];
                for (var k=0; k<info.map_selections.length; ++k) {
                    var ms = info.map_selections[k];
                    areasSelectize[0].selectize.addOption({value:ms.name, text:ms.name});
                }
            }
        }

        entries.sort(function(e1, e2) {
            return new Date(e2.modified_at) - new Date(e1.modified_at);
        });

        refreshList();
    });

    // Filters

    $('#lead-title-search').on('input paste change drop', function() {
        var filterBy = $(this).val();
        filterEntries(filterBy == "", function(info){
            return info.lead_title.toLowerCase().includes(filterBy.toLowerCase());
        });
    });
    $('#sources-filter').change(function() {
        var filterBy = $(this).val();
        filterEntries(filterBy == "", function(info){
            return info.lead_source == filterBy;
        });
    });
    $('#users-filter').change(function() {
        var filterBy = $(this).val();
        filterEntries(filterBy == "", function(info){
            return info.modified_by == filterBy;
        });
    });
    $('#areas-filter').change(function() {
        var filterBy = $(this).val();
        filterEntries(filterBy == "", function(info){
            return info.map_selections.filter(function(ms){ return ms.name == filterBy; }).length > 0;
        });
    });
    $('#affected-groups-filter').change(function() {
        var filterBy = $(this).val();
        filterEntries(filterBy == "", function(info){
            return info.affected_groups.filter(function(a){ return a.name == filterBy; }).length > 0;
        });
    });
    $('#vulnerable-groups-filter').change(function() {
        var filterBy = $(this).val();
        filterEntries(filterBy == "", function(info){
            return info.vulnerable_groups.filter(function(v){ return v.name == filterBy; }).length > 0;
        });
    });
    $('#specific-needs-groups-filter').change(function() {
        var filterBy = $(this).val();
        filterEntries(filterBy == "", function(info){
            return info.specific_needs_groups.filter(function(s){ return s.name == filterBy; }).length > 0;
        });
    });

    $('#search').on('input paste change drop', function() {
        var filterBy = $(this).val();
        filterEntries(filterBy == "", function(info){
            return info.excerpt.toLowerCase().includes(filterBy.toLowerCase());
        });
    });


    $('#pillars-filter').change(function() {
        var filterBy = $(this).val();
        filterEntries(filterBy == "", function(info){
            return info.attributes.filter(function(a){ return a.subpillar != null && a.subpillar.pillar.id == filterBy; }).length > 0;
        });
    });
    $('#subpillars-filter').change(function() {
        var filterBy = $(this).val();
        filterEntries(filterBy == "", function(info){
            return info.attributes.filter(function(a){ return a.subpillar != null && a.subpillar.id == filterBy; }).length > 0;
        });
    });
    $('#sectors-filter').change(function() {
        var filterBy = $(this).val();
        filterEntries(filterBy == "", function(info){
            return info.attributes.filter(function(a){ return a.sector != null && a.sector.id == filterBy; }).length > 0;
        });
    });
    $('#subsectors-filter').change(function() {
        var filterBy = $(this).val();
        filterEntries(filterBy == "", function(info){
            return info.attributes.filter(function(a){ return a.subsectors != null && a.subsectors.filter(function(ss){ return ss.id == filterBy }).length > 0; }).length > 0;
        });
    });

    $('.reliabilities-filter').change(function() {
        var minFilterBy = $('#reliabilities-min-filter').val();
        var maxFilterBy = $('#reliabilities-max-filter').val();

        filterEntries(minFilterBy == "" || maxFilterBy == "", function(info){
            return info.reliability.level >= minFilterBy && info.reliability.level <= maxFilterBy;
        });
    });

    $('.severities-filter').change(function() {
        var minFilterBy = $('#severities-min-filter').val();
        var maxFilterBy = $('#severities-max-filter').val();

        filterEntries(minFilterBy == "" || maxFilterBy == "", function(info){
            return info.severity.level >= minFilterBy && info.severity.level <= maxFilterBy;
        });
    });
});

function refreshList() {

    $("#entries").empty();
    for (var i=0; i<entries.length; ++i) {
        var entry = entries[i];

        var entryElement = $(".entry-template").clone();
        entryElement.removeClass("entry-template");
        entryElement.addClass("entry");

        entryElement.find(".entry-title").text(entry.lead_title);
        entryElement.find(".created-by").text(entry.modified_by);
        entryElement.find(".created-on").text(formatDate(new Date(entry.modified_at)));

        entryElement.appendTo($("#entries"));
        entryElement.show();

        for (var j=0; j<entry.informations.length; ++j) {
            var information = entry.informations[j];

            var informationElement = $(".information-template").clone();
            informationElement.removeClass("information-template");
            informationElement.addClass("information");

            informationElement.find('.excerpt').text(information.excerpt);

            informationElement.find('.reliability').find('span[data-id=' + information.reliability.id + ']').addClass('active');
            informationElement.find('.severity').find('span[data-id=' + information.severity.id + ']').addClass('active');

            informationElement.find('.date').text(information.date);
            informationElement.find('.number').text(information.number);

            informationElement.find('.vulnerable-groups').text(
                information.vulnerable_groups.map(function(vg) {
                    return vg.name;
                }).join(", ")
            );
            informationElement.find('.sepecific-need-groups').text(
                information.specific_needs_groups.map(function(sg) {
                    return sg.name;
                }).join(", ")
            );

            informationElement.find('.affected-group-list').text(
                information.affected_groups.map(function(ag) {
                    return ag.name;
                }).join(", ")
            );

            informationElement.find('.geo-locations-list').text(
                information.map_selections.map(function(ms) {
                    return ms.name;
                }).join(", ")
            );

            for (var k=0; k<information.attributes.length; ++k) {
                var attribute = information.attributes[k];

                var attributeElement = $('.attribute-template').clone();
                attributeElement.removeClass('attribute-template');
                attributeElement.addClass('attribute');

                attributeElement.find('.pillar').text(attribute.subpillar.pillar.name);
                attributeElement.find('.sub-pillar').text(attribute.subpillar.name);

                if (attribute.sector) {
                    attributeElement.find(".sector").text(attribute.sector.name);

                    if (attribute.subsectors) {
                        attributeElement.find(".sub-sector").text(
                            attribute.subsectors.reduce(function(a, b) {
                                if (a) return a + ", " + b.name;
                                else return b.name;
                            }, null)
                        );
                    }
                }

                attributeElement.appendTo(informationElement.find('.attribute-list'));
                attributeElement.show();
            }

            informationElement.appendTo(entryElement.find('.information-list'));
            informationElement.show();
        }

        entryElement.find('.edit-btn').unbind().click(function(entry){
            return function() {
                window.location.href = "/" + eventId + "/entries/edit/" + entry.id + "/";
            }
        }(entry));

        entryElement.find('.delete-btn').unbind().click(function(entry){
            return function() {
                var data = { id: entry.id };
                redirectPost("/" + eventId + "/entries/delete/", data, csrf_token);
            }
        }(entry));
    }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
}

function formatTime(time) {
    var d = new Date(time),
        hr = '' + (d.getHours() + 1),
        min = '' + d.getMinutes(),
        sec = d.getSeconds();

    if (hr.length < 2) hr = '0' + hr;
    if (min.length < 2) min = '0' + min;
    if (sec.length < 2) sec = '0' + sec;

    return [hr, min].join(':') + "<span hidden>"+sec+"</span>";
}
