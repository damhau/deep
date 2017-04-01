
let templateEditor = {
    init: function() {
        let that = this;
        this.elements = [];

        $('#noob-widget button').on('click', function() {
            that.addElement(new NoobWidget(that.getContainer()));
            that.reloadElements();
        });

        $('#matrix1d-widget button').on('click', function() {
            that.addElement(new Matrix1D(that.getContainer()));
            that.reloadElements();
        });

        $('#matrix2d-widget button').on('click', function() {
            that.addElement(new Matrix2D(that.getContainer()));
            that.reloadElements();
        });

        // Save button
        $('#save-button').click(function() {
            redirectPost(window.location.pathname, {
                data: JSON.stringify(that.save()),
            }, csrf_token);
        });

        // Page switching
        $('#switch-page').click(function() {
            that.switchPage();
            that.reloadElements();
        });
    },

    addElement: function(element) {
        element.page = this.getPage();
        this.elements.push(element);
    },

    reloadElements: function() {
        $('#elements .element').remove();
        let that = this;
        for (let i=0; i<this.elements.length; i++) {
            let element = this.elements[i];
            if (element.page != this.getPage()) {
                continue;
            }

            let elementProperties = $('#elements .element-template').clone();
            elementProperties.removeClass('element-template').addClass('element');
            elementProperties.find('h4').text(element.getTitle());

            if (element.isRemovable()) {
                elementProperties.find('.delete-element').click(function() {
                    elementProperties.remove();
                    that.elements.splice(that.elements.indexOf(element), 1);
                    element.dom.remove();
                });
            }
            else {
                elementProperties.find('.delete-element').hide();
            }
            element.addPropertiesTo(elementProperties.find('.properties'));

            elementProperties.find('.properties').hide();
            elementProperties.find('.toggle-properties').click(function() {
                let btn = $(this);
                elementProperties.find('.properties').slideToggle(function() {
                    if ($(this).is(':visible')) {
                        btn.removeClass('fa-chevron-down').addClass('fa-chevron-up');
                    } else {
                        btn.removeClass('fa-chevron-up').addClass('fa-chevron-down');
                    }
                });
            });

            $('#elements').append(elementProperties);
            elementProperties.show();
        }
    },

    load: function(data) {
        let that = this;
        this.elements = [];
        $('#elements .element').remove();

        $('#template-name').text(data.name);
        that.getContainer().empty();

        let pageOneEntrySelectorAdded = false;
        let pageOneExcerptBoxAdded = false;
        let pageOneImageBoxAdded = false;
        let pageTwoExcerptBoxAdded = false;

        for (let i=0; i<data.elements.length; i++) {
            let element = data.elements[i];
            if (this.getPage() != element.page) {
                this.switchPage();
            }
            if (element.type == 'noob') {
                that.addElement(new NoobWidget(that.getContainer(), element));
            }
            else if (element.type == 'matrix1d') {
                that.addElement(new Matrix1D(that.getContainer(), element));
            }
            else if (element.type == 'matrix2d') {
                that.addElement(new Matrix2D(that.getContainer(), element));
            }
            else if (element.type == 'pageOneExcerptBox') {
                pageOneExcerptBoxAdded = true;
                that.addElement(new PageOneExcerptBox(that.getContainer(), element));
            }
            else if (element.type == 'pageOneImageBox') {
                pageOneImageBoxAdded = true;
                that.addElement(new PageOneImageBox(that.getContainer(), element));
            }
            else if (element.type == 'pageOneEntrySelector') {
                pageOneEntrySelectorAdded = true;
                that.addElement(new PageOneEntrySelector(that.getContainer(), element));
            }
            else if (element.type == 'pageTwoExcerptBox') {
                pageTwoExcerptBoxAdded = true;
                that.addElement(new PageTwoExcerptBox(that.getContainer(), element));
            }
        }

        if (!pageTwoExcerptBoxAdded) {
            if (this.getPage() != 'page-two') {
                this.switchPage();
            }
            that.addElement(new PageTwoExcerptBox(that.getContainer()));
        }

        if (this.getPage() != 'page-one') {
            this.switchPage();
        }
        if (!pageOneEntrySelectorAdded) {
            that.addElement(new PageOneEntrySelector(that.getContainer()));
        }
        if (!pageOneExcerptBoxAdded) {
            that.addElement(new PageOneExcerptBox(that.getContainer()));
        }
        if (!pageOneImageBoxAdded) {
            that.addElement(new PageOneImageBox(that.getContainer()));
        }

        that.reloadElements();
    },

    save: function() {
        let data = {};
        data['name'] = $('#template-name').text();
        data['elements'] = [];
        for (let i=0; i<this.elements.length; i++) {
            if (this.getPage() != this.elements[i].page) {
                this.switchPage();
            }
            let elementData = this.elements[i].save();
            elementData['page'] = this.elements[i].page;
            data['elements'].push(elementData);
        }
        return data;
    },

    getUniqueElementId: function() {
        let i = 0;
        while (true) {
            let elementId = 'element' + i;
            if (!this.checkElementId(elementId)) {
                return elementId;
            }
            i++;
        }
    },

    checkElementId: function(elementId) {
        let j = 0;
        for (; j<this.elements.length; j++) {
            if (this.elements[j].id == elementId) {
                break;
            }
        }
        return j < this.elements.length;
    },

    getPage: function() {
        if ($('#page-one').is(':visible')) {
            return 'page-one';
        } else {
            return 'page-two';
        }
    },

    getContainer: function() {
        if ($('#page-one').is(':visible')) {
            return $('#page-one');
        } else {
            return $('#page-two .entry');
        }
    },

    switchPage: function() {
        if ($('#page-one').is(':visible')) {
            $('#page-one').hide();
            $('#page-two').show();
            $('body').removeClass('page-one').addClass('page-two');
        } else {
            $('#page-two').hide();
            $('#page-one').show();
            $('body').removeClass('page-two').addClass('page-one');
        }
    },
};


$(document).ready(function() {
    templateEditor.init();
    templateEditor.load(templateData);
    $('#elements').sortable();
});
