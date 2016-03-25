require.config({
	'baseUrl': 'scripts/',

    'paths': {
		'jquery': 'lib/jquery-2.1.4.min',
		'underscore': 'lib/lodash.min',
		'backbone': 'lib/backbone-min',

        // hosted version
		//'augmented': '/augmented/scripts/core/augmented',
        //'augmentedPresentation': '/augmented/scripts/presentation/augmentedPresentation'

        // local version
		'augmented': 'lib/augmented',
        'augmentedPresentation': 'lib/augmentedPresentation'
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
        template: "<div id=\"logo\"></div><h1>Augmented “Top Model”</h1><h2>Easy Model Validation</h2><div id=\"container\"><div><h3>JSON Schema (Draft 4)</h3><textarea id=\"schema\"></textarea></div><div><h3>Model JSON Data</h3><textarea id=\"model\"></textarea></div><p id=\"message\"></p></div><div id=\"controlPanel\"></div>",
        events: {
            "change textarea#schema": function(event) {
                var m = event.target;
                if (m) {
                    try {
                        var data = JSON.parse(m.value);
                        this.schema = data;
                        this.showMessage("Updated schema.");
                        m.setAttribute("class", "good");
                    } catch(e) {
                        this.showError("Could Not parse schema!");
                        m.setAttribute("class", "bad");
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
                        m.setAttribute("class", "good");
                    } catch(e) {
                        this.showError("Could Not parse model data!");
                        m.setAttribute("class", "bad");
                    }
                }
            },
            "click div#logo": function() {
                window.location = "http://www.augmentedjs.com";
            }
        },
        reset: function() {
            var e = document.getElementById("schema");
            e.value = "";
            e.removeAttribute("class");
            e = document.getElementById("model");
            e.value = "";
            e.removeAttribute("class");
            this.showMessage("Ready");
        },
        showError: function(error) {
            var m = document.getElementById("message");
            m.innerHTML = error;
            m.setAttribute("class", "error");
        },
        showMessage: function(message, flag) {
            var m = document.getElementById("message");
            m.textContent = message;
            m.removeAttribute("class");
            if (flag) {
                m.setAttribute("class", "good");
            }
        },
        init: function() {
            this.on('mainEvent',
                function(message) {
                    if (message === "validate") {
                        this.validate();
                    } else if (message === "reset") {
                        this.reset();
                    }
                }
            );
            this.model = new Augmented.Model();
        },
        validate: function() {
            if (this.model && this.schema) {
                this.model.schema = this.schema;

                if (this.model.isValid()) {
                    this.showMessage("Validation: ✔ Model is valid!", true);
                } else {
                    this.showError("Validation: ✕ Model is not valid!<br/>" + this.formatValidationMessages(this.model.validationMessages.errors));
                }
            } else {
                this.showError("Error: ❗ No Model or Schema!");
            }
        },
        formatValidationMessages: function(messages) {
            var html = "<ul class=\"errors\">";
                var i = 0, l = messages.length;
                for (i = 0; i < l; i++) {
                    html = html + "<li>" + messages[i] + "</li>";
                }
                html = html + "</ul>";
            return html;
        },
        render: function() {
            if (this.el) {
                this.el.innerHTML = this.template;
            }
            this.showMessage("Ready");
            return this;
        }
    });

    var view = new MainView();

    app.registerMediator(view);

    view.render();

    var ControlPanelView = Augmented.Presentation.Colleague.extend({
        el: "#controlPanel",
        template: "<button id=\"validate\">Validate</button><button id=\"reset\">Reset</button>",
        events: {
            "click button#validate": function() {
                this.sendMessage("mainEvent", "validate");
            },
            "click button#reset": function() {
                this.sendMessage("mainEvent", "reset");
            },
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
        }, // callback
        "control" // channel
    );

    control.render();
});
