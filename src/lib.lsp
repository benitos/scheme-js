; --------------------------------
; Aliase
; 

(define first car)
(define rest cdr)
(define head car)
(define tail cdr)




; --------------------------------
; Funktionen
;

(define gcdr (lambda (c) (if (cons? c) (cdr c) 0)))

(define (len list)
    (if (null? list)
        0
    ;else
        (+ 1 (len (gcdr list)))
    )
)




; --------------------------------
; Einfach mal etwas Inhalt
; 

; Simple add
(define (add2 x) (+ x 2))


; Geschachteltes define
(define (make-adder n)
  (define (add-n x)
    (+ x n))

  add-n)

(define add1 (make-adder 1))
(define add10 (make-adder 10))

(add10 15)

(let ((a 2) (b 1)) 
    (define x 2)
    (debug)
)