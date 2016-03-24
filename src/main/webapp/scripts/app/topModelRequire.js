require.config({
	'baseUrl': 'scripts/',

    'paths': {
		'jquery': 'lib/jquery-2.1.4.min',
		'underscore': 'lib/lodash.min',
		'backbone': 'lib/backbone-min',

        // hosted version
		'augmented': '/augmented/scripts/core/augmented',
        'augmentedPresentation': '/augmented/scripts/presentation/augmentedPresentation'

        // local version
		//'augmented': 'lib/augmented/augmented-min',
        //'augmentedPresentation': 'lib/augmented/augmentedPresentation-min'
	}
});

require(['augmented', 'augmentedPresentation'], function(Augmented, Presentation) {
    "use strict";
    var app = new Augmented.Presentation.Application("Top Model");
    app.registerStylesheet("https://fonts.googleapis.com/css?family=Work+Sans:300,400");
    app.registerStylesheet("https://fonts.googleapis.com/css?family=Source+Code+Pro:400");
    app.registerStylesheet("styles/main.css");
    app.start();

    var MainView = Augmented.Presentation.Mediator.extend({
        el: "#main",
        template: "<h1>Augmented Top Model</h1><h2>Easy Model Validation</h2><h3>JSON Schema (Draft 4)</h3><div><textarea id=\"schema\"></textarea></div><h3>Model JSON Data</h3><div><textarea id=\"model\"></textarea></div><p id=\"message\">Ready</p><div id=\"controlPanel\"></div>",
        events: {
            "change textarea#schema": function(event) {
                var m = event.target;
                if (m) {
                    try {
                        var data = JSON.parse(m.value);
                        this.schema = data;
                        this.showMessage("Updated schema.");
                        console.info("Updated schema.");
                    } catch(e) {
                        this.showError("Could Not parse schema!");
                        console.error("Could Not parse schema!");
                    }
                }
            },
            "change textarea#model": function(event) {
                var m = event.target;
                if (m) {
                    try {
                        var data = JSON.parse(m.value);
                        this.model.set(data);
                        this.showMessage("Updated model data.");
                        console.info("Updated model data.");
                    } catch(e) {
                        this.showError("Could Not parse model data!");
                        console.error("Could Not parse model data!");
                    }
                }
            },
        },
        showError: function(error) {
            var m = document.getElementById("message");
            m.innerHTML = error;
            m.setAttribute("class", "error");
        },
        showMessage: function(message) {
            var m = document.getElementById("message");
            m.textContent = message;
            m.removeAttribute("class");
        },
        init: function() {
            this.on('mainEvent',
                function(data) {
                    if (data === "validate") {
                        this.validate();
                    }
                }
            );
            this.model = new Augmented.Model();
        },
        validate: function() {
            if (this.model && this.schema) {
                this.model.schema = this.schema;

                if (this.model.isValid()) {
                    this.showMessage("Validation: Model is valid!");
                } else {

                    var formatValidationMessages = function(messages) {
                        var html = "<ul class=\"errors\">";
                            var i = 0, l = messages.length;
                            for (i = 0; i < l; i++) {
                                html = html + "<li>" + messages[i] + "</li>";
                            }
                            html = html + "</ul>";
                        return html;
                    };

                    this.showError("Validation: Model is not valid!<br/>" + formatValidationMessages(this.model.validationMessages.errors));
                }
            } else {
                this.showError("Validation: No Model or Schema!");
            }
        },
        render: function() {
            if (this.el) {
                this.el.innerHTML = this.template;
            }
            return this;
        }

    });

    var view = new MainView();

    app.registerMediator(view);

    view.render();

    var ControlPanelView = Augmented.Presentation.Colleague.extend({
        el: "#controlPanel",
        template: "<button id=\"validate\">Validate</button>",
        events: {
            "click button#validate": function() {
                this.sendMessage("mainEvent", "validate");
            }
        },
        render: function() {
            if (this.el) {
                this.el.innerHTML = this.template;
            }
            return this;
        }
    });

    var control = new ControlPanelView();

    view.observeColleague(
        control, // colleague view
        function() {
            logger.debug("EXAMPLE: MainView - the control panel");
        }, // callback
        "control" // channel
    );

    control.render();
});
