
# Scheme-JS

<img src="https://github.com/benitos/scheme-js/blob/master/assets/logo.png" alt="Scheme.js Logo :)" width="250" />

Scheme-JS ist ein Scheme-Interpreter geschrieben in JavaScript für die Vorlesung "Design und Implementierung fortgeschrittener Programmiersprachen" der HdM Stuttgart im SS2014.



## Features
Unter anderem:
- GUI + CLI
- Laden von Bibliotheken (textuell und grafisch via Drag&Drop)
- Großer Funktionsumfang (siehe unten)
- Komplett getestet mit Mocha & Chai (> 400 Tests, kein Anspruch auf 100%ige Abdeckung)
- Viele Funktionen verarbeiten (wo sinnvoll) eine variable Anzahl an Argumenten (`(+ 1 2 3 4 5 6 ...)`)
- Subtraktion und Division berechnen auch bei mehr als 2 Zahlen richtig (von links nach rechts (`(- 5 4 3)` = -2)
- Define berücksichtigt den aktuelle Scope (wenn in aktuellem Scope nicht vorhanden, hier neu definieren statt Parent verändern) und überschreibt vorhandene Variablen (nähere Infos hierzu im Code/unten)
- Zahlen werden in unterschiedlichen Formen erkannt (`1`, `+1`, `-1`, `1.2`, `1e5`, `-1.134e-2`, ...)
- Viele Fehler-Hinweise, damit der Nutzer weiß, was er falsch gemacht hat
- Unterschiede bei Vergleichen berücksichtigt (`=`, `eq?`, `eqv?` und `equals?`)
- Scheme convenience hinsichtlich True/False berücksichtigt (alles was nicht false ist, ist true)
- Quote, True & False mit Shorthands
- Debug-Environment-Infos (textuell via `(debug)` und grafisch in der GUI)
- "Advanced" Debuging in der GUI über Inspektor
- Reader verfügt weitere Debug-Infos über ReservedWords (`sjs.memory`, `sjs.env`, `sjs.uptime`)
- Modulare Reader & Printer (File, Console, Web)
- ...


## CLI & GUI
Das Projekt umfasst sowohl eine CLI als auch eine grafische Oberfläche mit Features wie Syntax-Highlighting, Debug Console oder Drag & Drop um Bibliotheken zu laden.
- `:q` beendet scheme.js (sowohl CLI als auch GUI)
- Die GUI verfügt grundsätzlich über 2 Modes - Plain und Visual (Syntax-HL & Co.) -, von denen akut der Visual-Mode aktiviert ist
- Damit die CLI nicht all zu lieblos aussieht, verfügt auch sie über verschiedene Farben (rudimentär)
- Bilbliotheken können in der GUI auch per Drag&Drop geladen werden. Sobald die betreffende Datei mit der Maus auf den Editor gezogen wird, erscheint die Meldung `Drop to load this file ...`. Lässt man die Datei nun fallen, so wird nochmals gefragt, ob sie geladen werden soll.


### GUI-Shortcuts
Um die Verwendung angenehmer zu gestalten, verfügt die GUI über einige Shortcuts:
- `Ctrl + R` = Setzt das Programm zurück
- `Ctrl + Return` = Evaluiert die Eingabe
- `Ctrl + D` = Blendet das Debug-Infobox-Overlay ein/aus
      - Neben dem Debug-Overlay kann außerdem auch eine vollständige Debug-Console über das Menü `scheme.js > Debug > Console` geöffnet werden




# Installation & Start
Falls noch nicht installiert, so wird [Node.js](http://nodejs.org/) sowie der zugehörige Packet-Manager [npm](https://www.npmjs.org/) benötigt (dieser ist idR. bei Node.js bereits enthalten). 
Anschließend kann im Projekt-Verzeichnis `npm install` ausgeführt werden, wodurch die Abhängigkeiten installiert werden. 
Um die CLI zu starten muss dann lediglich das Kommando `node src/app.js` ausgeführt werden.
Die GUI hingegen kann wie eine normale Applikation (z.B. durch Doppelklick) oder (sofern node-webkit lokal installiert ist) über `zip -r schemejs.nw * && /Applications/node-webkit/node-webkit.app/Contents/MacOS/node-webkit schemejs.nw` ausgeführt werden -  der Pfad zu node-webkit ist ggf. anzupassen.

Mit der Eingabe von `:q` kann sowohl die CLI als auch die GUI beendet werden.



# Testing
Für alle Komponenten wurden Tests erstellt, die mit Hilfe des Testing-Frameworks [Mocha](http://mochajs.org/) und der BDD/TDD-Assertion Bibliothek [Chai](http://chaijs.com/) getestet werden können. Mocha und Chai werden bei der Installation (`npm install`) automatisch mit installiert. Die Tests können dann einfach durch den Aufruf von `npm test` im Projekt-Verzeichnis oder über `mocha --recursive --ui bdd --reporter spec test/EINZELTESTFILE.js` ausgeführt werden.




----------------------------------------------------




# Unterstützte Kommandos

## Übersicht

| Befehl           | Funktion                                 |
| ---------------- | ---------------------------------------- |
| `nil`            | Liefert ein SchemeNil                    |
| `false` / `#f`   | Liefert ein SchemeFalse                  |
| `true` / `#t`    | Liefert ein SchemeTrue                   |
| `sjs.memory`     | Zeigt die aktuelle Speicherverwendung    |
| `sjs.env`        | Zeigt Infos zur Umgebung                 |
| `sjs.uptime`     | Zeigt die Laufzeit des Programms         |
| `sjs.debug`      | Debug-Ausgabe ein-/ausschalten           |
| `(display ...)`  | Display                                  |
| `(+ ...)`        | Addition                                 |
| `(- ...)`        | Subtraktion                              |
| `(* ...)`        | Multiplikation                           |
| `(/ ...)`        | Division                                 |
| `(define ...)`   | Anlegen von Bindings (Variablen)         |
| `(cons ...)`     | Anlegen von Cons                         |
| `(list ...)`     | Anlegen von Listen                       |
| `(car ...)`      | Erstes Element eines Cons                |
| `(cdr ...)`      | Zweites Element eines Cons               |
| `(= ...)`        | Numerischer Vergleich                    |
| `(< ...)`        | Kleiner als                              |
| `(<= ...)`       | Kleiner gleich                           |
| `(> ...)`        | Größer als                               |
| `(>= ...)`       | Größer gleich                            |
| `(eq? ...)`      | Selbes Objekt?                           |
| `(eqv? ...)`     | `eq?` / Selber Wert? (Number/String)     |
| `(equal? ...)`   | Selbe "Ausgabe"?                         |
| `(boolean? ...)` | Boolean?                                 |
| `(symbol? ...)`  | Symbol?                                  |
| `(number? ...)`  | Number?                                  |
| `(string? ...)`  | String?                                  |
| `(cons? ...)`    | Cons?                                    |
| `(null? ...)`    | Null?                                    |
| `(if ...)`       | If - then - else                         |
| `(not ...)`      | Nicht                                    |
| `(and ...)`      | Und-Verknüpfung                          |
| `(or ...)`       | Oder-Verknüpfung                         |
| `(quote ...)`    | Quote (Shorthand: `'`)                   |
| `(begin ...)`    | Evaluierung mehrerer Teilblöcke          |
| `(set! ...)`     | Ändern eines Bindings                    |
| `(set-car! ...)` | Ändern des ersten Elements eines Cons    |
| `(set-cdr! ...)` | Ändern des zweiten Elements eines Cons   |
| `(let ...)`      | Erzeugen eines neuen/lokalen Scopes      |
| `(lambda ...)`   | Lambda                                   |
| `(type? ...)`    | Liefert den Datentyp                     |
| `(error ...)`    | Erzeugt eine Fehlermeldung               |
| `(load ...)`     | Lädt eine Scheme-Bibliothek              |
| `(debug ...)`    | Debug-Ausgabe                            |



## Display
`(display {SchemeObject})`
Gibt das übergebene Objekt (evaluiert) auf dem Printer aus.

```scheme
sjs › (display "hello world")
      (SchemeString)    "hello world"
sjs › (display a)
      (SchemeNumber)    10
```


## Addition
`(+ {SchemeObject}{1,})`
Evaluiert und addiert eine variable Anzahl übergebener Objekte vom Typ `SchemeNumber`.

```scheme
sjs › (+ 1 2)
      (SchemeNumber)    3
sjs › (+ 3 4 6 7 234)
      (SchemeNumber)    254
sjs › (+ a 5)
      (SchemeNumber)    15
```


## Subtaktion
`(- {SchemeObject}{1,})`
Evaluiert und subtrahiert eine variable Anzahl übergebener Objekte vom Typ `SchemeNumber`.
Eine Besonderheit hierbei ist, dass von links nach rechts berechnet werden muss (`20 - 10 - 5 = 5` und nicht `15`), was durch einen kleinen Trick umgesetzt wurde: ab dem 2. Argument werden alle weiteren Argumente aufsummiert und anschließend in Summe vom 1. Argument abgezogen.

```scheme
sjs › (- 10 5)
      (SchemeNumber)    5
sjs › (- 20 10 5)
      (SchemeNumber)    5
sjs › (- 3 2 a)
      (SchemeNumber)    -9
```

## Multipliklikation
`(* {SchemeObject}{1,})`
Evaluiert und multipliziert eine variable Anzahl übergebener Objekte vom Typ `SchemeNumber`.

```scheme
sjs › (* 2 2)
      (SchemeNumber)    4
sjs › (* 2 3 4 5 6)
      (SchemeNumber)    720
sjs › (* 2 a)
      (SchemeNumber)    20
```

## Division
`(/ {SchemeObject}{1,})`
Evaluiert und dividiert eine variable Anzahl übergebener Objekte vom Typ `SchemeNumber`.
Eine Besonderheit hierbei ist, dass wie bei `-` von links nach rechts berechnet werden muss (`20 / 10 / 5 = 0.4` und nicht `10`), was wieder durch einen kleinen Trick umgesetzt wurde: ab dem 2. Argument werden alle weiteren Argumente multipliziert und anschließend mit dem 1. verrechnet.

```scheme
sjs › (/ 10 5)
      (SchemeNumber)    2
sjs › (/ 20 10 5)
      (SchemeNumber)    0.4
sjs › (/ 20 a)
      (SchemeNumber)    2
```

## Define
`(define {SchemeObject} {SchemeObject})`
Evaluiert das übergebene Argument (2) und weißt das Ergebnis (Wert oder Funktion) der Variablen (1) zu (erstellt ein Binding).
Hierbei war fraglich, wie mit bereits definierten Variablen umgegangen werden soll - scheinbar ist es der Implementation überlassen und da DrRacket die nachträgliche Veränderung via `define` erlaubt, tut dieser Interpreter dies ebenso.

```scheme
sjs › (define a 10)
      (SchemeNumber)    10
sjs › a
      (SchemeNumber)    10
sjs › (define b "hello world")
      (SchemeString)    "hello world"
sjs › b
      (SchemeString)    "hello world"
sjs › (define c (+ 20 30))
      (SchemeNumber)    50
sjs › (define (add2 x) (+ x 2))
      (SchemeUserDefinedFunction)   <user-defined-function>
sjs › (add2 2)
      (SchemeNumber)    4
```


## Cons
`(cons {SchemeObject} {SchemeObject})`
Evaluiert die beiden übergebenen Argumente erzeugt ein Cons.

```scheme
sjs › (cons 1 20)
      (SchemeCons)      (1 . 20)
sjs › (cons 1 (+ 2 3))
      (SchemeCons)      (1 . 5)
sjs › (cons 1 (cons 2 (cons 3 4)))
      (SchemeCons)      (1 2 3 . 4)
```


## List
`(list {SchemeObject}{1,})`
Evaluiert die variable Anzahl übergebener Argumente erzeugt eine Liste.
Da die Erzeugung verketteter Listen mit `cons` recht mühsam ist, stellt Scheme die `list`-Operation zur Verfügung, mit der einfach eine Liste erzeugt werden kann.

```scheme
sjs › (list 1 2)
      (SchemeCons)      (1 2 . nil)
sjs › (list 1 2 3 4 5)
      (SchemeCons)      (1 2 3 4 5 . nil)
sjs › (list 1 (+ 2 3))
      (SchemeCons)      (1 5 . nil)      
```


## Car
`(car {SchemeCons})`
Liefert das erste Element des übergebenen evaluierten Arguments.

```scheme
sjs › (car (cons 1 2))
      (SchemeNumber)    1
sjs › (define x (cons 3 4))
      (SchemeCons)      (3 . 4)
sjs › (car x)
      (SchemeNumber)    3
```


## Cdr
`(cdr {SchemeCons})`
Liefert das zweite Element des übergebenen evaluierten Arguments.

```scheme
sjs › (cdr (cons 1 2))
      (SchemeNumber)    2
sjs › (define y (cons 1 (cons 2 3)))
      (SchemeCons)      (1 2 . 3)
sjs › (cdr y)
      (SchemeCons)      (2 . 3)
```


## Numerischer Vergleich
`(= {SchemeObject}{2,})`
Evaluiert die variable Anzahl übergebener Argumente vergleicht sie (numerisch).
Liefert `SchemeTrue` bei Übereinstimmung, ansonsten `SchemeFalse`.

```scheme
sjs › (= 1 1)
      (SchemeTrue)      #true
sjs › (= 1 2)
      (SchemeFalse)     #false
sjs › (= 1 1 1 1)
      (SchemeTrue)      #true
sjs › (= 1 1 1 2 3)
      (SchemeFalse)     #false
sjs › (define a 10)
      (SchemeNumber)    10
sjs › (define b 20)
      (SchemeNumber)    20
sjs › (= a b)
      (SchemeFalse)     #false
sjs › (= a 10)
      (SchemeTrue)      #true
```


## Kleiner als
`(< {SchemeObject} {SchemeObject})`
Evaluiert die übergebenen Argumente vergleicht sie (numerisch).
Liefert `SchemeTrue` wenn Argument1 kleiner ist als Argument2, ansonsten `SchemeFalse`.

```scheme
sjs › (< 10 20)
      (SchemeTrue)      #true
sjs › (< 20 10)
      (SchemeFalse)     #false
sjs › (define a 20)
      (SchemeNumber)    20
sjs › (< a 30)
      (SchemeTrue)      #true
sjs › (< 10 "hi")
      Error: (<): argument is not a number!
```


## Kleiner gleich
`(<= {SchemeObject} {SchemeObject})`
Evaluiert die übergebenen Argumente vergleicht sie (numerisch).
Liefert `SchemeTrue` wenn Argument1 kleiner oder gleich ist wie Argument2, ansonsten `SchemeFalse`.

```scheme
sjs › (<= 10 20)
      (SchemeTrue)      #true
sjs › (<= 20 10)
      (SchemeFalse)     #false
sjs › (define a 20)
      (SchemeNumber)    20
sjs › (<= a 30)
      (SchemeTrue)      #true
sjs › (<= 10 10)
      (SchemeTrue)      #true
```


## Größer als
`(> {SchemeObject} {SchemeObject})`
Evaluiert die übergebenen Argumente vergleicht sie (numerisch).
Liefert `SchemeTrue` wenn Argument1 größer ist als Argument2, ansonsten `SchemeFalse`.

```scheme
sjs › (> 20 10)
      (SchemeTrue)      #true
sjs › (> 10 20)
      (SchemeFalse)     #false
sjs › (define a 20)
      (SchemeNumber)    20
sjs › (> a 10)
      (SchemeTrue)      #true
```


## Größer gleich
`(>= {SchemeObject} {SchemeObject})`
Evaluiert die übergebenen Argumente vergleicht sie (numerisch).
Liefert `SchemeTrue` wenn Argument1 größer oder gleich ist wie Argument2, ansonsten `SchemeFalse`.

```scheme
sjs › (>= 20 10)
      (SchemeTrue)      #true
sjs › (>= 10 20)
      (SchemeFalse)     #false
sjs › (define a 20)
      (SchemeNumber)    20
sjs › (>= a 30)
      (SchemeTrue)      #false
sjs › (>= 10 10)
      (SchemeTrue)      #true
```


## Eq?
`(eq? {SchemeObject} {SchemeObject})`
Eq? vergleicht, ob es sich bei den beiden übergebenen Argumenten um das selbe Objekt im Speicher handelt.

```scheme
sjs › (define a (cons 1 2))
      (SchemeCons)      (1 . 2)
sjs › (define b (cons 1 2))
      (SchemeCons)      (1 . 2)
sjs › (eqv? a b)
      (SchemeFalse)     #false
sjs › (define a 10)
      (SchemeNumber)    10
sjs › (define b a)
      (SchemeNumber)    10
sjs › (define c 20)
      (SchemeNumber)    20
sjs › (define d true)
      (SchemeTrue)      #true
sjs › (eq? a 10)
      (SchemeFalse)     #false
sjs › (eq? a a)
      (SchemeTrue)      #true
sjs › (eq? a b)
      (SchemeTrue)      #true
sjs › (eq? a c)
      (SchemeFalse)     #false
sjs › (eq? d true)
      (SchemeTrue)      #true *(da true ein Singleton ist)*
sjs › (eq? 1 1)
      (SchemeFalse)     #false *(da auch gleiche Zahlen in der jetzigen Implementierung jeweils neu erzeugt werden)*
```


## Eqv?
`(eqv? {SchemeObject} {SchemeObject})`
Eqv? vergleicht, ob es sich bei den beiden übergebenen Argumenten um das selbe Objekt im Speicher handelt.
Zusätzlich werden die Werte von Objekte vom Typ `SchemeNumber` und `SchemeString` verglichen.

```scheme
sjs › (eqv? 1 1)
      (SchemeTrue)      #true
sjs › (eqv? "hi" "hi")
      (SchemeTrue)      #true
sjs › (eqv? 1 2)
      (SchemeFalse)     #false
sjs › (eqv? "hi" "low")
      (SchemeTrue)      #true
sjs › (eqv? () ())
      (SchemeTrue)      #true
sjs › (eqv? nil nichtVorhandenesSymbol)
      (SchemeTrue)      #true
sjs › (eqv? 'yes 'yes)
      (SchemeTrue)      #true
sjs › (eqv? 'yes 'no)
      (SchemeFalse)     #false
```

## Equal?
`(equal? {SchemeObject} {SchemeObject})`
Equal? vergleicht die Werte/Inhalte der beiden übergebenen Argumente.

```scheme
sjs › (equal? 'a 'a)
      (SchemeTrue)      #true
sjs › (equal? '(a) '(a))
      (SchemeTrue)      #true
sjs › (equal? '(a (b) c) '(a (b) c))
      (SchemeTrue)      #true
sjs › (equal? "abc" "abc")
      (SchemeTrue)      #true
sjs › (equal? 2 2)
      (SchemeTrue)      #true
sjs › (equal? 2 3)
      (SchemeFalse)     #false
sjs › (define a "hi")
      (SchemeString)    "hi"
sjs › (equal? a "hi")
      (SchemeTrue)      #true
sjs › (equal? a 1)
      (SchemeFalse)     #false
```


## Boolean?
`(boolean? {SchemeObject})`
Prüft, ob das übergebene Argument ein `SchemeTrue` oder `SchemeFalse` ist.

```scheme
sjs › (boolean? 1)
      (SchemeFalse)     #false
sjs › (boolean? true)
      (SchemeTrue)      #true
sjs › (boolean? false)
      (SchemeTrue)      #true
sjs › (define a true)
      (SchemeTrue)      #true
sjs › (boolean? a)
      (SchemeTrue)      #true
sjs › (define b 20)
      (SchemeNumber)    20
sjs › (boolean? b)
      (SchemeFalse)     #false
```


## Symbol?
`(symbol? {SchemeObject})`
Prüft, ob das übergebene Argument ein `SchemeSymbol` ist.

```scheme
sjs › (symbol? 1)
      (SchemeFalse)     #false
sjs › (define a 10)
      (SchemeNumber)    10
sjs › (symbol? a)
      (SchemeFalse)     #false
sjs › (symbol? 'a)
      (SchemeTrue)      #true
```


## Number?
`(number? {SchemeObject})`
Prüft, ob das übergebene Argument ein `SchemeNumber` ist.

```scheme
sjs › (number? 1)
      (SchemeTrue)      #true
sjs › (number? true)
      (SchemeFalse)     #false
sjs › (define a 10)
      (SchemeNumber)    10
sjs › (number? a)
      (SchemeTrue)      #true
```


## String?
`(string? {SchemeObject})`
Prüft, ob das übergebene Argument ein `SchemeString` ist.

```scheme
sjs › (string? "hi")
      (SchemeTrue)      #true
sjs › (string? 1)
      (SchemeFalse)     #false
sjs › (define test "hallo")
      (SchemeString)    "hallo"
sjs › (string? test)
      (SchemeTrue)      #true
sjs › (string? 'test)
      (SchemeFalse)     #false
```


## Cons?
`(cons? {SchemeObject})`
Prüft, ob das übergebene Argument ein `SchemeCons` ist.

```scheme
sjs › (cons? (cons 1 2))
      (SchemeTrue)      #true
sjs › (define a (cons 2 3))
      (SchemeCons)      (2 . 3)
sjs › (cons? a)
      (SchemeTrue)      #true
sjs › (cons? "hi")
      (SchemeFalse)     #false
```


## Null?
`(null? {SchemeObject})`
Prüft, ob das übergebene Argument ein `SchemeNil` ist.

```scheme
sjs › (null? ())
      (SchemeTrue)      #true
sjs › (null? nil)
      (SchemeTrue)      #true
sjs › (null? true)
      (SchemeFalse)     #false
sjs › (define a 10)
      (SchemeNumber)    10
sjs › (null? a)
      (SchemeFalse)     #false
sjs › (null? b)
      (SchemeTrue)      #true
```


## If
`(if {SchemeObject} {SchemeObject} {SchemeObject})`
Evaluiert je nach Auswertung der Bedingung (Argument 1) Argument 2 (then) oder Argument 3 (else).
Dabei wird alles, was nicht `false` ist automatisch als wahr angesehen (ftp://ftp.cs.utexas.edu/pub/garbage/cs345/schintro-v14/schintro_19.html#SEC19).

```scheme
sjs › (if (nil? ()) (display "gibt's ja garnicht") (display "gibt's ja wohl"))
      (SchemeString)    "gibt's ja garnicht"
sjs › (if (< 10 20) (+ 10 20) (- 10 20))
      (SchemeNumber)    30
sjs › (if (< 20 10) (+ 10 20) (- 10 20))
      (SchemeNumber)    -10
```


## Not
`(not {SchemeObject})`
Evaluiert das übergebene Argument und invertiert es.
Auch hier gilt wieder, dass alles, was nicht `false` ist automatisch als wahr angesehen wird (ftp://ftp.cs.utexas.edu/pub/garbage/cs345/schintro-v14/schintro_19.html#SEC19) und damit im Umkehrschluss zu `false` wird.

```scheme
sjs › (not 1)
      (SchemeFalse)     #false
sjs › (not true)
      (SchemeFalse)     #false
sjs › (not false)
      (SchemeTrue)      #true
```


## And
`(and {SchemeObject}{1,})`
Evaluiert die übergebenen Argumente von links nach rechts und liefert das letzte Ergebnis solange kein `false` auftritt.

```scheme
sjs › (and 1)
      (SchemeNumber)    1
sjs › (and 1 2 "hallöle")
      (SchemeString)    "hallöle"
sjs › (and "hallo" false)
      (SchemeFalse)     #false
sjs › (and "hallo" 1 2 3)
      (SchemeNumber)    3
sjs › (and false "hallo")
      (SchemeFalse)     #false
```


## Or
`(or {SchemeObject}{1,})`
Evaluiert die übergebenen Argumente von links nach rechts und liefert das erste nicht-falsche Ergebnis oder `false`.

```scheme
sjs › (or 1)
      (SchemeNumber)    1
sjs › (or 1 2)
      (SchemeNumber)    1
sjs › (or "hi" du)
      (SchemeString)    "hi"
sjs › (or "hi" false)
      (SchemeString)    "hi"
sjs › (or false "macht nix")
      (SchemeString)    "macht nix"
sjs › (or false)
      (SchemeFalse)     #false
```


## Quote
`(quote {SchemeObject})`
Evaluiert das übergebene Argument und liefert es (nicht dessen Wert) zurück.
Als Shorthand hierfür kann `'` genutzt werden.

```scheme
sjs › (define a 10)
      (SchemeNumber)    10
sjs › (quote a)
      (SchemeSymbol)    <a>
sjs › (quote hallo)
      (SchemeSymbol)    <hallo>
sjs › (quote 1)
      (SchemeNumber)    1
sjs › (quote nil)
      (SchemeSymbol)    <nil>
sjs › (quote (cons 1 2))
      (SchemeCons)      (<cons> 1 2 . nil)
sjs › (quote (1 2))
      (SchemeCons)      (1 2 . nil)
sjs › (quote (+ 1 2))
      (SchemeCons)      (<+> 1 2 . nil)

sjs › 'a
      (SchemeSymbol)    <a>
sjs › '(1 2)
      (SchemeCons)  (1 2 . nil)
```


## Begin
`(begin {SchemeObject}{1,})`
Evaluiert die variable Anzahl übergebener Argumente und liefert den Wert des Letzten zurück.

```scheme
sjs › (begin (display "hi"))
      (SchemeString)    "hi"
sjs › (begin (display "hi") (display "du"))
      (SchemeString)    "du"
sjs › (begin (+ 2 3) (define x (+ 5 7)) (display "supi") x)
      (SchemeNumber)    12
```


## Set
`(set! {SchemeObject}{1,})`
Weißt einem Binding einen neuen Wert zu.

```scheme
sjs › (define a 4)
      (SchemeNumber)    4
sjs › (set! a 19)
      (SchemeNumber)    19
sjs › a
      (SchemeNumber)    19

sjs › (set! nichtdefiniert 5)
      Error: (set!): `<nichtdefiniert>` is not defined and therefore cannot be set to `5`.
```


## Set-Car
`(set-car! {SchemeObject}{1,})`
Weißt dem `car` eines `SchemeCons` einen neuen Wert zu.

```scheme
sjs › (define a (cons 1 2))
      (SchemeCons)      (1 . 2)
sjs › a
      (SchemeCons)      (1 . 2)

sjs › (set-car! a 5)
      (SchemeCons)      (5 . 2)
sjs › a
      (SchemeCons)      (5 . 2)

sjs › (set-car! nichtDefiniert 2)
      Error: (set-car!): argument is not a cons
```


## Set-Cdr
`(set-cdr! {SchemeObject}{1,})`
Weißt dem `cdr` eines `SchemeCons` einen neuen Wert zu.

```scheme
sjs › (define a (cons 1 2))
      (SchemeCons)      (1 . 2)
sjs › (set-cdr! a 5)
      (SchemeCons)      (1 . 5)
sjs › a
      (SchemeCons)      (1 . 5)

sjs › (set-cdr! nichtDefiniert 5)
      Error: (set-cdr!): argument is not a cons
```


## Let
`(let {SchemeCons} {SchemeObject}{1,})`
Erzeugt einen neuen Scope und weißt den angegebenen Binding die entsprechende Werte zu.

```scheme
sjs › (let ((a 2)) a)
      (SchemeNumber)    2
sjs › (let ((a 2) (b 3)) a b)
      (SchemeNumber)    3

sjs › (define a 10)
      (SchemeNumber)    10
sjs › a
      (SchemeNumber)    10
sjs › b
      (SchemeNil)       nil
sjs › (let ((a 20) (b 5)) (+ a b))
      (SchemeNumber)    25
sjs › a
      (SchemeNumber)    10
sjs › b
      (SchemeNil)       nil
```


## Lambda
`(lambda {SchemeCons} {SchemeObject}{1,})`
Erzeugt eine Funktion mit Argumenten (Argument 1) und einem Body (Argument 2).

```scheme
sjs › (lambda (x) (+ x 2))
      (SchemeUserDefinedFunction)   <user-defined-function>
sjs › ((lambda (n) (+ n 2)) 2)
      (SchemeNumber)    4
sjs › (define add2 (lambda (x) (+ x 2)))
      (SchemeUserDefinedFunction)   <user-defined-function>
sjs › (add2 4)
      (SchemeNumber)    6
```


## Type
`(type? {SchemeObject})`
Type wurde zusätzlich implementiert und liefert den Datentyp des übergebenen Arguments.

```scheme
sjs › (type? 1)
      (SchemeString)    "SchemeNumber"
sjs › (type? false)
      (SchemeString)    "SchemeFalse"
sjs › (type? "hi there")
      (SchemeString)    "SchemeString"
sjs › (define a (cons 1 2))
      (SchemeCons)      (1 . 2)
sjs › (type? a)
      (SchemeString)    "SchemeCons"
```


## Error
`(error {SchemeString})`
Error wurde zusätzlich implementiert und gibt einen Fehler mit der im Argument übergebenen Meldung aus.

```scheme
sjs › (error "Mach mal Pause!")
      Error: Mach mal Pause!
```


## Load
`(load {SchemeString})`
Load wurde zusätzlich implementiert - mit dessen Hilfe kann ein File in den Interpreter geladen werden.

```scheme
sjs › (load "src/lib.lsp")
      (SchemeEnvironment)   Bindings:
      <a>:    2
      <b>:    1
      <x>:    2
      ...
```


## Debug
`(debug)`
Debug wurde zusätzlich implementiert und gibt das aktuelle Environment aus.

```scheme
sjs › (debug)
      (SchemeEnvironment)   Bindings:
      <display>:  <builtin-function:display>
      <+>:    <builtin-function:+>
      <->:    <builtin-function:->
      ...
```


## Über den Reader eingeführte Befehle

Um die Verarbeitungs-Kette zu verkürzen und gewisse Wörter zu schützen, führt der Reader einige Befehle ein.

| Befehl         | Funktion                              |
| -------------- | ------------------------------------- |
| `nil`          | Liefert ein SchemeNil                 |
| `false` / `#f` | Liefert ein SchemeFalse               |
| `true` / `#t`  | Liefert ein SchemeTrue                |
| `sjs.memory`   | Zeigt die aktuelle Speicherverwendung |
| `sjs.env`      | Zeigt Infos zur Umgebung              |
| `sjs.uptime`   | Zeigt die Laufzeit des Programms      |
| `sjs.debug`    | Schaltet die Debug-Ausgabe ein-/aus   |




----------------------------------------------------




# Weitere Überlegungen und mögliche Verbesserungen
- Auf die Implementierung einer Speicher-Verwaltung/Garbage-Collection wurde verzichtet, da dies bei JavaScript bereits integriert ist (Mark & Sweep)
- Numerische Bindings könnten in Hashmaps vorgehalten und referenziert werden (effizienter)
- Eine wirkliche Tail-Call-Eliminierung via Continuation-Passing verträgt sich auf Grund des Call-Stacks nicht besonders mit JavaScript und sollte daher über Trampolines implementiert werden. Auf Grund des weit überschrittenen Zeit-Budgets wurde hierauf verzichtet - prinzipiell wäre dies jedoch z.B. wie folgt denkbar:
  ```JavaScript
    // Statt herkömmlich rekursiv:
    var factorial = function factorial (n) {
        return n ? n * factorial(n - 1) : 1;
    }

    factorial(32768);
    // => RangeError: Maximum call stack size exceeded



    // Mit Trampolin
    var tramp = function tramp(fnc) {
        return function (args) {
            var result = fnc.apply(this, args);

            while (result instanceof Function) {
                result = result();
            }

            return result;
        };
    }

    var fac = function fac(n) {
        var _fac = tramp(function tmp (acc, n) {
            return n > 0 ? function () { return tmp(acc * n, n - 1); } : acc;
        });

        return _fac([1, n]);
    }

    fac(32768);
    // => Infinity = works :)
  ```
