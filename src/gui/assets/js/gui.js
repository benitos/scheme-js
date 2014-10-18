/**
 * Die GUI von Scheme.JS
 */


(function () {

    var SchemeJS = {};

    /** Initialisierung */
    SchemeJS.init = function () {
        this.initMenus();
        // this.initEditorPlain();
        this.initEditorACE();
        this.initInfoBox();
        this.initDragDrop();


        // Reset :)
        document.addEventListener('keyup', function (evt) {
            // Ctrl + R = reset
            if (evt.keyCode == 82) {
                if (evt.ctrlKey) {
                    this.printer.target.innerHTML = '';
                    this.repl.evaluator.init();
                    this.repl.emit('update');
                }
            }
        }.bind(this));

        // Debug
        window.schemeJs = this;
    };

    /** Drag & Drop initialisieren */
    SchemeJS.initDragDrop = function () {
        var self = this,
            holder = document.getElementById('repl');

        // Page change/reload verhindern
        window.ondragover = function (evt) { evt.preventDefault(); return false; };
        window.ondrop = function (evt) { evt.preventDefault(); return false; };

        holder.ondragenter = function () { this.className += ' hover'; return false; };
        holder.ondragleave = holder.ondragend = function () { this.className = this.className.replace(/hover/g, '').trim(); return false; };

        // Files verarbeiten
        holder.ondrop = function (evt) {
            evt.preventDefault();

            var file = evt.dataTransfer.files[0],
              reader = new FileReader();

            this.className = this.className.replace(/hover/g, '').trim();

            if (window.confirm('Do you want to load `'+ file.name +'`?')) {
                reader.onload = function (evt) {
                    if (evt.target.error) {
                        throw 'An error occured while loading file `'+ file.name +'` ...';
                    }

                    self.reader.rawInput.dispatchEvent(new CustomEvent('data', { detail: evt.target.result }));
                };

                // Read
                reader.readAsText(file);
            }

            return false;
        };
    };

    /** Init GUI Menus */
    SchemeJS.initMenus = function () {
        var gui = require('nw.gui');
        var win = gui.Window.get();

        var rootMenu = new gui.Menu({ type: 'menubar'});
        var myMenu = new gui.Menu();

        myMenu.append(new gui.MenuItem({
            type: 'normal',
            label: 'Debug',
            click: function (){
                win.showDevTools();
            }
        }));

        rootMenu.createMacBuiltin('scheme.js');
        rootMenu.append(new gui.MenuItem({
            label: 'scheme.js',
            submenu: myMenu
        }));

        win.menu = rootMenu;
    };

    /** Infobox initialisieren */
    SchemeJS.initInfoBox = function () {
        var infobox = this.infobox = document.getElementById('infobox'),
            visible = false;

        // Initialer Inhalt
        infobox.innerHTML = this.printer.convert2HTML(this.repl.evaluator.environment.toString());

        // Bei Update aktualisieren
        this.repl.on('update', function (data) {
            infobox.innerHTML = this.printer.convert2HTML(this.repl.evaluator.environment.toString());
            infobox.scrollTop = infobox.scrollHeight;
        }.bind(this));

        // Default = geschlossen
        infobox.className += ' hide';

        // Oeffnen und schließen mit CTRL + D
        document.addEventListener('keyup', function (evt) {
            // Ctrl + D = debug
            if (evt.keyCode == 68) {
                if (evt.ctrlKey) {
                    infobox.className = visible ? infobox.className + ' hide' : infobox.className.replace('hide', '');
                    visible = !visible;
                }
            }
        });
    };
    

    /** Plain-Text-Editor initialisieren */
    SchemeJS.initEditorPlain = function () {
        var printerEl = document.getElementById('printer'),
            inputEl   = document.getElementById('input-plain');

        inputEl.addEventListener('keyup', function (evt) {
            // Prevent Default
            evt.preventDefault();

            // Ctrl + Enter = eval
            if (evt.keyCode == 13) {
                if (evt.ctrlKey) {
                    this.dispatchEvent(new CustomEvent('data', { detail: this.value.trim() }));
                    this.value = '';
                }
            }
        });

        document.body.className += ' editor-plain';


        // REPL
        this.initREPL(inputEl, printerEl);
    };

    /** ACE-Editor initialisieren */
    SchemeJS.initEditorACE = function () {
        var printerEl = document.getElementById('printer'),
            editor = this.ace = ace.edit('input-ace');

        // Settings
        editor.setTheme('ace/theme/tomorrow_night_eighties');
        editor.getSession().setMode('ace/mode/lisp');
        editor.focus();

        editor.container.addEventListener('keyup', function (evt) {
            // Prevent Default
            evt.preventDefault();

            // Ctrl + Enter = eval
            if (evt.keyCode == 13) {
                if (evt.ctrlKey) {
                    this.dispatchEvent(new CustomEvent('data', { detail: editor.getValue() }));
                    editor.setValue('');
                }
            }
        });

        document.body.className += ' editor-ace';

        // REPL
        this.initREPL(editor.container, printerEl);
    };


    /** REPL initialisieren */
    SchemeJS.initREPL = function (readerInput, printerOutput) {
        var SchemeREPL = require('../repl'),
            SchemeReaderWeb  = require('../reader.web'),
            SchemePrinterWeb = require('../printer.web'),
            repl, reader, printer;

        reader = this.reader = new SchemeReaderWeb(readerInput);
        printer = this.printer = new SchemePrinterWeb(printerOutput);
        repl = this.repl = new SchemeREPL(reader, printer);

        // End Listener
        reader.on('end', function () {
            console.log('end');
            window.close();
        });

        // Debuging :)
        console.log(repl);

        return repl;
    };

    // Energie!
    SchemeJS.init();
    
})();