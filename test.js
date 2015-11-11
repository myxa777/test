'use strict';
Ractive.DEBUG = false;

window["_"] = {};


//window._ = {};

// DONE: #.counter_recap - если на входе  soft delete - спец.сценарий ( добавить в начало [DELETE] + старую стрку )+ не помечать как countered
// DONE: а то после VIEWER ==> AE пропадает использованный delete
// DONE: подумать про hard delete -  должен ли он в виде пустой строки переползать в следующий каунтер
// DONE: index.html добавить {{ #if }} с подсветской обоих delets


// DONE: запоминать позицию курсора в редакторе и возвразаться на неё

// todo: в FAQ сделать работающий пример
// todo: подумать про maintain действие
// todo: подумать про сохранение разметки, пустых строк (может им сразу присваивать значение accepted и с глаз долой до самого clean recapa?)
// todo: тогда надо будет удалить внедрение пустых строк где-то в согздании рекапа

// todo: http://getbootstrap.com/javascript/#buttons-stateful
// todo: http://getbootstrap.com/javascript/#live-demo-1
// todo: http://getbootstrap.com/javascript/#tabs-examples


// DONE: CLEAN RECAP COLLECTION (ESPECIALL SPLITTED LINES)
// DONE: LABELS TRANSFERS FROM TO EACH IROUND/COUNTER (ESPECIALLY SPLITTED LINES - SHOULD KEEP GOING UNDER LABEL)
// NONEED: escape/_.unescapeHtml extend (what if local symbols will be used.... e.g. http://www.htmlescape.net/htmlescape_for_javascript.html)
// DONE: VIA NULL VALUE sysa for subArrays (splitted lines)
// DONE: labels
// DONE: избавиться от underscore & string.s
// DONE: extra linebraks to recap?

// todo: iPad ontouch events for sortable
// todo: jQuery sortable to specific sortable?

// todo: recap_creator with history?
// todo: god mode?
// todo: final edition / перемещения вверх-вниз перед публикацией финального рекапа
// todo: pre-described recap proformas? (like Trafigura recap)
// todo: auto-labels?
// todo: extracting from email
// todo: show each line history? (maybe floating help onmouseover?!!) ::)
// DONE: полный запрет на selection?


// переход VIEWER <=> AE

// DONE: восстановсление после прехода во VIWER и обрантно в AE - подсветка каунтернутых строк
// todo??: при переходе VIEWVER/AE разрезанный массив должен слепляться в один и помечаться как каунтернутый - может переделать .ae() так, чтобы она
//при переходе туда-обратно делала АЕ, а увеличение _.roundCurrent отедльно тогда
// DONE: помечать цветом каунтернутый после перехода VIEWER/AE
// DONE: поработать над .icounteredQ() чтобы работала с резаными массивами
// DONE: выводить резаный массив как резаный массив (группой)

// DONE: ondblclick - remove ## N ## at the _.editor window
// todo????: Submit должен склеивать резаный массив при переходе на следуюший раунд
// DONE: разобраться с show_label, чтобы она показывла label даже резаному массиву (головной label)

//DONE: if label is one one line and para on the next line
/*
CP DATE: 
ON SUBS
VESSEL              : BLA-BLA-BLA*/


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//done: ВАЖНО: нумерация через ID и переход по номеру, а не по содержимому (чтобы не было проблем с повоторяющимися содержимым)
// сделано через добавление номера строки в конце и тег hidden при  отображении

//$( document ).ready( function() {


//( function() {

   

    //window._ = {};

        _.addDragAndDrop = function() {

            var elementS = $( "#sortable li" );

            $( '#countr' ).change( function() {
                if ( $( this ).is( ":checked" ) ) {
                    elementS.draggable( "enable" );                    
                } else {                  
                    elementS.draggable( "disable" );
                    $( '#HARDDELETE' ).mousedown( function( e ){ e.preventDefault() } );
                    $( '#HARDDELETE' ).bind( 'mousedown', false );
                    $( '#HARDDELETE' ).mouseup( function( e ){ e.preventDefault() } );
                    $( '#HARDDELETE' ).bind( 'mouseup',false );
                    $( '#SOFTDELETE' ).mousedown( function( e ){ e.preventDefault() } );
                    $( '#SOFTDELETE' ).bind( 'mousedown', false );
                    $( '#SOFTDELETE' ).mouseup( function( e ){ e.preventDefault() } );
                    $( '#SOFTDELETE' ).bind( 'mouseup', false );
                }
            } );

            $( "#sortable, #droppable" ).sortable( {
                connectWith: "#droppable",
                revert: true,
                receive: function( e, ui ) { //insert an aray entry to _.insertLines
                    /*if ( ui.item.text().replace( /##\d+##$/, ' ' ).trim() === _.SOFT_DELETE
                            || ui.item.text().replace( /##\d+##$/, ' ' ).trim() === _.HARD_DELETE ) {
                        //ui.item.clone();
                        //$( "#sortable, #droppable" ).sortable('refresh');
                        return false;
                    }*/

                    if ( _.roundCurrent === 0 ) {
                        _.insertLines.splice( ui.item.index(), 0, ui.item.text().trim() ); //first round simple splice (x, 0, z)
                        return true;
                    } else { //2nd++ round via find_line in _.recap_array
                        var x = ui.item.next( 'li' );
                        var temp = _.recap_array.find_line( _.remove_label( x.text().trim() ) );
                        var k = 0;
                        var z = _.recap_array.size1();

                        while ( !temp ) { //if a few new entries in a row
                            x = x.next( 'li' );
                            temp = _.recap_array.find_line( _.remove_label( x.text().trim() ) );
                            k++;
                            if ( k > z ) temp = z //the very last position
                        }
                        _.insertLines.splice( temp, 0, ui.item.text().trim() );
                        return true;
                    }
                }   
            } );

            elementS.draggable( {
                opacity: .8,
                //helper: $(this).text().replace( /##\d+##$/, ' ' ).trim() !== _.HARD_DELETE.trim()  ? 'clone' : 'original',
                cursor: 'move',
                revert: true,
                revertDuration: 200
                //revert: $(this).text().replace( /##\d+##$/, ' ' ).trim() === _.HARD_DELETE.trim()  ? true : false,
                //zIndex: 100
                //stop: function ( e, ui ) {
                //    $(this).append($(ui.helper).clone())``;
                ///}
            } ).disableSelection();

            $( '#droppable ul li' ).droppable( _.dropFn ).disableSelection();

        },

        _.read_ace = function() {

            //var offer = s.lines( _.editor.getValue() );
            var offer = _.editor.getValue().split( '\n' )
            var zed = null;
            var ret = [];
            toastr.options.timeOut = 10000;

            //for ( var i = 0, len = offer.length; i < len; i++ ) {
            //    offer[ i ] = offer[ i ].replace( /^\s*$/, '' )
            //}
            //offer = offer.filter( Boolean );

            for ( var i = 0, len = offer.length; i < len; i++ ) {
                offer[ i ] = offer[ i ]
                    .replace( /\s\s+/g, ' ' )
                    .trim()
                    .toUpperCase();
                offer[ i ] = _.unescapeHtml( offer[ i ] );

                if ( offer[ i ].match( /^%%%OFFER%%%/ ) && zed === null ) {
                    //switching switch to FEEDING OFFER mode
                    _.roundTotal = -1;
                    zed = 0
                } else if ( offer[ i ].match( /^%%%OFFER%%%/ ) && zed !== null ) {
                    toastr.error( 'numerous %%%OFFER%%%. Should be only one.' );
                    _.editor.gotoLine( i+4 );
                    _.editor.focus();
                    //_.roundTotal = null;
                    return false;
                    
                    // place cursor here
                    //!!!!!!!!!!!!!!!!!!!!! exit ????????????????????
                }

                if ( offer[ i ].match( /^%%%COUNTER%%%/ ) && zed !== null ) {
                    //setting switcher and iterator
                    _.roundTotal++;
                    _.counter_labels[ _.roundTotal ] = [];
                    zed = 0;
                    _.counter_array[ _.roundTotal ] = new _.SubArray();
                    //_.counter_array[ _.roundTotal ][ 0 ] = [];
                    //_.counter_array[ _.roundTotal ].add_line( 0, _.HARD_DELETE );
                    //_.counter_array[ _.roundTotal ][ 1 ] = [];
                    //_.counter_array[ _.roundTotal ].add_line( 1, _.SOFT_DELETE );

                    //_.counter_array[round].sysa = [];
                } else if ( offer[ i ].match( /^%%%COUNTER%%%/ ) && zed === null ) {
                    toastr.error( '%%%COUNTER%%% before %%%OFFER%%%?? are you serious?' );
                    _.editor.gotoLine( i );
                    _.editor.focus();
                    //_.roundTotal = null;
                    return false;
                    //place cursor here
                    //!!!!!!!!!!!!!!!!!!!!!!!!! exit?????????????????????
                }

                //#applying switcher and iterator
                if ( _.roundTotal === null && i < offer.length - 1 ) {
                    //#any line before %offer% is skipped
                    ret = [];
                    continue
                } else if ( _.roundTotal === null && i === offer.length - 1 ) {
                    toastr.error( 'there are no %%%OFFER%%% and %%%COUNTER%%% in your file' );
                    _.editor.gotoLine( i );
                    _.editor.focus();
                    return false;
                    //exit????????????????????
                } else if ( _.roundTotal === -1 && !/^%%%OFFER%%%/.test( offer[ i ] ) && !/(^##.+)/.test( offer[ i ] ) ) {
//feeding OFFER !!!!
                    _.recap_array[ zed ] = [];
                    _.recap_array.add_line( zed, offer[ i ] );
                    zed++;
                } else if ( _.roundTotal >= 0 && !/^%%%COUNTER%%%/.test( offer[ i ] ) && !/^##.+/.test( offer[ i ] ) && /.*\S.*/.test( offer[ i ] ) ) {
//feeding COUNTER !!!!
                    _.counter_array[ _.roundTotal ][ zed ] = [];
                    _.counter_array[ _.roundTotal ].add_line( zed, offer[ i ] );
                    zed++;
                }
            }               // FOR LOOP


            //deleting excessive/empty %%%COUNTER%%%
            for ( var i = _.counter_array.length - 1; i >= 0; i-- ) {
                if ( _.counter_array[ i ].length === 0 ) {
                    _.counter_array[ i ] = false;
                } else {
                    _.counter_array[ i ].add_line( 0, _.HARD_DELETE );
                    _.counter_array[ i ].add_line( 1, _.SOFT_DELETE );
                }
            };
            _.counter_array = _.counter_array.filter( Boolean );
            _.roundTotal = _.counter_array.length - 1;

            if ( _.roundTotal >= 0 ) {
                if ( _.recap_array.size1() === 0 ) {
                    toastr.error( 'there is a %%% COUNTER %%%, but no %%% OFFER %%% ' );
                    _.editor.gotoLine( 4 );
                    _.editor.focus();
                    //_.roundTotal = null;
                    return false;
                }
                return true
            } else if ( _.recap_array.size1() === 0 ) {
                toastr.error( 'there is no %%% OFFER %%%' );
                _.editor.gotoLine( 4 );
                _.editor.focus();
                //_.roundTotal = null;
                return false;
            } else {
                toastr.error( 'there is only %%% OFFER %%%, but no %%% COUNTER %%%' );
                _.editor.gotoLine( 4 );
                _.editor.focus();
                //_.roundTotal = null;
                return false;
            }

        }, //OPEN FILE FUNCTION


        //on press 'Done editing'
        _.doneEditingFunction = function( nbr, someText ) {
            var textRecap = document.getElementById( "recapText" );
            var splittedRecap = _.editRecap( textRecap.value, nbr );

            if ( splittedRecap ) {
                textRecap.parentElement.innerHTML = splittedRecap;
                $( '#droppable ul li' ).droppable( _.dropFn )
            } else {
                toastr.error( "Easy, tiger! :)\n\nIt is very b-a-a-a-d to change accepted entries :)\n\nOnly linebreaks are allowed for proper countering. \n\nTry again." );
                textRecap.value = _.tempa.replace( /##\d+##$/, "" );
            }
        },


        // splits entered text into separate lines and converts them to bootstrap-HTML for entering into recap
        _.editRecap = function( z, nbr ) {
            var labelBeg = "<li class='list-group-item nodrop'><span class='label label-info'>";
            var labelEnd = "</span><div class='panel panel-primary'><div class='panel-body'><ul class='list-group'>";
            var nextStrBeg = "<li class='list-group-item' id='splitted'>";
            var nextStrEnd = "</li>";
            var x = "";
            var tempString = z;
            var temp1 = [];

            if ( _.tempa.replace( /##\d+##$/, "" ) !== z.replace( /(\r\n)|(\n)/g, '' ) ) return false; //if original text has been changed (not only linebreaks, but real backtrader's _.insertLines)

            z = z.trim();
            z = z.split( '\n' );

            for ( var i = 0, len = z.length; i < len; i++ ) {
                z[ i ] = z[ i ]
                    .replace( /\s\s+/g, ' ' )
                    .replace( /^(\r|\s)$/, '' );
                if ( z[ i ] ) {
                    z[ i ] = z[ i ] + ' ##' + Math.floor( ( Math.random() * 1000 ) + 1 ) + '##'
                }
            };
            z = z.filter( Boolean );
            temp1 = z.slice();

            _.recap_array[ nbr ][ 0 ] = temp1; //copy by value

            for ( var i = 0, len = _.recap_array[ nbr ][ 0 ].length; i < len; i++ ) {
                _.recap_array[ nbr ][ 0 ][ i ] = _.recap_array[ nbr ][ 0 ][ i ].split( '\n' ) //convert string to array
            }

            x = labelBeg + labelEnd; // + nextStrBeg + z[0] + nextStrEnd;

            for ( var i = 0; i < z.length; i++ ) {
                tempString = z[ i ].replace( /##\d+##$/, '<span hidden>' + z[ i ].match( /##\d+##$/ ) + '</span>' );
                x += nextStrBeg + tempString + nextStrEnd
            }

            x += "</ul></div></div></li>";
            return x //returns html for splitted counter
        }, // end of EditRecap


        _.selectChangedTheme = function( value ) {
//alert('onselectChangedTheme');
            _.editor.setTheme( value )
        },

        _.selectChangedFontSize = function( value ) {
//alert('onselectChangedFontSize');
            _.editor.setOptions( {
                fontSize: parseInt( value )
            } )
        },

        _.onclickRECAPULATR = function() {
//alert('onclickRECAPULATR');

            if ( _.roundTotal !== null ) {                                                      //if we are already countering
                toastr.success( 'Hello, chartering people! :)' );
            } else {                                                                            //or before countering
                if ( _.statusMenu === 'AE' ) {
                    _.editor.session.setValue( _.createDraftAE( true ) );
                    _.editor.gotoLine( 3 );
                } else {
                    _.editor.session.setValue( ' ' );
                }
                _.editor.focus()
            }
        },

        _.onclickAE = function() {
//alert('onclickAE');

            document.getElementById( 'about' ).setAttribute( 'hidden', 'true' );
            document.getElementById( 'contact' ).setAttribute( 'hidden', 'true' );

            document.getElementById( 'theme' ).removeAttribute( 'disabled' );
            document.getElementById( 'font' ).removeAttribute( 'disabled' );
            document.getElementById( 'submitRecap' ).removeAttribute( 'disabled' );
            document.getElementById( 'highlightText' ).removeAttribute( 'disabled' );
            document.getElementById( 'submitCounter' ).removeAttribute( 'disabled' );

            if ( _.roundTotal !== null ) {                                                     //if we are already countering
                _.redrawRecap();
                document.getElementById( 'editor' ).setAttribute( 'hidden', 'true' );
                document.getElementById( 'menuRecap' ).style.display = "none";
                document.getElementById( 'menuAE' ).style.display = "inline-block"
            } else {
                document.getElementById( 'editor' ).removeAttribute( 'hidden' );
                if ( _.statusMenu !== 'AE' ) {                   
                    _.myVarRecap = [ _.editor.session.getValue(), _.editor.selection.getCursor() ];
                    _.editor.session.setValue( _.myVarAE[ 0 ] );
                    _.editor.selection.moveCursorToPosition( _.myVarAE[ 1 ] );
                }
                document.getElementById( 'menuAE' ).style.display = "none";
                //document.getElementById( 'menuRecap' ).removeAttribute( 'disabled' );
            }
            
            _.statusMenu = 'AE';
            _.editor.focus();
        },

 
        _.onclickVIEWER = function() {
//alert('onclickVIEWER')''
            document.getElementById( 'about' ).setAttribute( 'hidden', 'true' );
            document.getElementById( 'contact' ).setAttribute( 'hidden', 'true' );
            document.getElementById( 'theme' ).removeAttribute( 'disabled' );
            document.getElementById( 'font' ).removeAttribute( 'disabled' );
            document.getElementById( 'submitRecap' ).removeAttribute( 'disabled', 'true' );
            document.getElementById( 'highlightText' ).removeAttribute( 'disabled', 'true' );
            if ( _.roundTotal !== null ) {                                                //if we are already countering
                if ( _.statusMenu !== 'VIEWER' ) {                                            //to avoid twice clicked error AE or VIEWER              
                    _.myVarAE = [ _.editor.session.getValue(), _.editor.selection.getCursor() ];
                    _.myVarRecap = [ _.recap_array.create_recap().join( '\n' ), _.editor.selection.getCursor(), 1 ];
                    _.editor.session.setValue( _.myVarRecap[ 0 ] );
                    _.editor.selection.moveCursorToPosition( _.myVarRecap[ 1 ] )
                }
                _.jsBody.set( 'status', 'VIEWER' );                                             //redraw VIEWR toolbox with AE toolbox
                document.getElementById( 'editor' ).removeAttribute( 'hidden' );
                document.getElementById( 'menuRecap' ).style.display = "inline-block";
                document.getElementById( 'menuAE' ).style.display = "none";
                document.getElementById( 'submitRecap' ).setAttribute( 'disabled', 'true' )
            } else {                                                                            //or before countering
                if ( _.statusMenu === 'AE' ) {
                    _.myVarAE = [ _.editor.session.getValue(), _.editor.selection.getCursor() ];
                    _.editor.session.setValue( _.myVarRecap[ 0 ] );
                    _.editor.selection.moveCursorToPosition( _.myVarRecap[ 1 ] )
                } else if ( _.statusMenu === 'FAQ' ) {
                    _.editor.session.setValue( _.myVarRecap[ 0 ] );
                    _.editor.selection.moveCursorToPosition( _.myVarRecap[ 1 ] )
                }
                _.jsBody.set( 'status', 'VIEWER' );                                             //redraw VIEWR toolbox with AE toolbox
                document.getElementById( 'editor' ).removeAttribute( 'hidden' );
                document.getElementById( 'about' ).setAttribute( 'hidden', 'true' );
                document.getElementById( 'contact' ).setAttribute( 'hidden', 'true' );
                document.getElementById( 'menuRecap' ).style.display = "inline-block";
                document.getElementById( 'menuAE' ).style.display = "none";
                document.getElementById( 'submitRecap' ).setAttribute( 'disabled', 'true' )
            }
            _.statusMenu = 'VIEWER';
            _.editor.focus();
        },

        _.onclickABOUT = function() {
//alert('onclickABOUT');
            $( '#accordion1' ).collapse();
            document.getElementById( 'about' ).removeAttribute( 'hidden' );
            document.getElementById( 'contact' ).setAttribute( 'hidden', 'true' );
            _.onclickBOTH()
        },

        _.onclickCONTACT = function() {
//alert('onclickCONTACT');
            document.getElementById( 'contact' ).removeAttribute( 'hidden' );
            document.getElementById( 'about' ).setAttribute( 'hidden', 'true');
            _.onclickBOTH()
        },

        _.onclickBOTH = function() {        
            if ( _.roundTotal !== null && _.statusMenu !== 'VIEWER' ) {                                                    //if we are already countering
                _.jsBody.set( 'status', 'VIEWER' );
                document.getElementById( 'menuAE' ).style.display = "inline-block";
                document.getElementById( 'menuRecap' ).style.display = "none";
                document.getElementById( 'theme' ).setAttribute( 'disabled', 'true' );
                document.getElementById( 'font' ).setAttribute( 'disabled', 'true' );
                document.getElementById( 'highlightText' ).setAttribute( 'disabled', 'true' );
                document.getElementById( 'submitCounter' ).setAttribute( 'disabled', 'true' );
            } else if ( _.roundTotal !== null ) {
                document.getElementById( 'menuAE' ).style.display = "none";
                document.getElementById( 'menuRecap' ).style.display = "inline-block";
                document.getElementById( 'submitRecap' ).setAttribute( 'disabled', 'true' );
                document.getElementById( 'submitCounter' ).setAttribute( 'disabled', 'true' );
                document.getElementById( 'editor' ).setAttribute( 'hidden', 'true');
                document.getElementById( 'theme' ).setAttribute( 'disabled', 'true' );
                document.getElementById( 'font' ).setAttribute( 'disabled', 'true' );
                document.getElementById( 'highlightText' ).setAttribute( 'disabled', 'true' );
            } else {
                document.getElementById( 'menuAE' ).style.display = "none";
                document.getElementById( 'menuRecap' ).style.display = "inline-block";
                document.getElementById( 'submitRecap' ).setAttribute( 'disabled', 'true' );
                document.getElementById( 'submitCounter' ).setAttribute( 'disabled', 'true' );
                document.getElementById( 'theme' ).setAttribute( 'disabled', 'true' );
                document.getElementById( 'font' ).setAttribute( 'disabled', 'true' );
                document.getElementById( 'highlightText' ).setAttribute( 'disabled', 'true' );
                document.getElementById( 'editor' ).setAttribute( 'hidden', 'true');
            }
        },

        _.escapeHtml = function( str ) {
            return str
                .replace( /&/g, "&AMP;" )
                .replace( /</g, "&LT;" )
                .replace( />/g, "&GT;" )
                .replace( /"/g, "&QUOT;" )
                .replace( /'/g, "&#039;" );
        },

        _.unescapeHtml = function( str ) {
            return str
                .replace( /&amp;/g, '&' )
                .replace( /&lt;/g, '<' )
                .replace( /&gt;/g, '>' )
                .replace( /&quot;/g, '"' )
                .replace( /&apos;/g, '\'' );
        },


        _.remove_label = function( linetext ) {
            return ( /^(\W*\s*.?\w+){3}\s*:/.test( linetext ) ? linetext.replace( /^(\W*\s*.?\w+){3}\s*:/, "" ) : linetext )
        },

        //heredoc: function( f ) {
        //    return f.toString().match( /\/\*\s*([\s\S]*?)\s*\*\//m )[ 1 ];
        //},

        _.makeArrayOf = function( value, length ) {
            var arr = [],
                i = length;
            while ( i-- ) {
                arr[ i ] = value;
            }
            return arr;
        },

        _.createDraftAE = function( z ) {
            if ( z ) {
                var rcpltr = '%%%OFFER%%%\n\n\n\n\n\n\n\n\n\n\n'
                for ( var i = 100; i >= 0; i-- ) {
                    rcpltr += '%%%COUNTER%%%\n\n\n'
                }
                rcpltr += '## I hope you have had less number of counters before you got clean fixture :)';
                return rcpltr

            } else {
                var rcpltr = '%%%OFFER%%%\n## initial offer:\n\n\n\n\n\n\n\n\n## paste your initial offer here after the system word %%%OFFER%%%\n## any line starting with double-sharp (##) is a comment and will be ignored\n\n%%%COUNTER%%%\n##first counter:\n\n\n\n\n## paste the first counter here after the system word %%%COUNTER%%%\n## any empty %%%COUNTER%%% section will be ignored as well, don\'t worry\n## just paste all counters in chrono order (first, second, etc. etc)\n\n\n%%%COUNTER%%%\n## next counter:\n\n\n%%%COUNTER%%%\n## next-next counter:\n\n## and so on, and so on\n\n\n%%%COUNTER%%%\n\n\n## etc. etc. etc.\n\n\n'
                for ( var i = 100; i >= 0; i-- ) {
                    rcpltr += '%%%COUNTER%%%\n\n\n'
                }
                rcpltr += '## I hope you have had less number of counters before you got clean fixture :)';
                return rcpltr
            }
        },

        _.exampleRecap = function() {
//alert('exampleRecap');

            if ( _.statusMenu === 'VIEWER' ) {
                _.tempa = [ _.editor.session.getValue(), _.editor.selection.getCursor(), _.editor.session ];
                _.myVarRecap = [ _.editor.session.getValue(), _.editor.selection.getCursor() ];
            } else if ( _.statusMenu === 'AE' ) {
                _.tempa = [ _.myVarRecap[ 0 ], _.myVarRecap[ 1 ], _.editor.session ];
                _.myVarAE = [ _.editor.session.getValue(), _.editor.selection.getCursor() ];
            }
            //_.editor.session.setValue( _.myVarRecap[ 0 ] );
            //_.editor.selection.moveCursorToPosition( _.myVarRecap[ 1 ] )   
            //_.editor.session;
            _.statusMenu = 'FAQ';
            //var newSession = 
            //_.editor.setSession( ace.createEditSession( "text" ) )
            _.editor.session.setValue( "_.hgjgjhgjhgjgjgjhg[ 0 ]" );
            _.editor.setOptions( { readOnly: true } );

            $( "#editor" ).before( "<div id='object1'/>" )
            $( "#editor1" ).replaceWith( document.getElementById( 'editor' ) );
            $( "#editor" ).attr( 'hidden', false );
            
        },

        _.exampleRecapEnd = function() {
//alert('exampleRecapEnd');

            


            $( "#editor" ).before( "<div id='editor1'/>" )
            $( "#editor" ).attr( 'hidden', true );
            $( '#object1' ).replaceWith( $( '#editor' ) );

            _.editor.session.setValue( _.tempa[ 0 ] );
            _.editor.selection.moveCursorToPosition( _.tempa[ 1 ] );
            _.editor.setSession( _.tempa[ 2 ] );
            _.editor.setOptions( { readOnly: false } );
            

        },




        //main action

        /*
                                                                                                                                                                                       
                                                                                                                                                                                       
                                                    iiii                                                                      tttt            iiii                                     
                                                   i::::i                                                                  ttt:::t           i::::i                                    
                                                    iiii                                                                   t:::::t            iiii                                     
                                                                                                                           t:::::t                                                     
           mmmmmmm    mmmmmmm     aaaaaaaaaaaaa   iiiiiiinnnn  nnnnnnnn           aaaaaaaaaaaaa      ccccccccccccccccttttttt:::::ttttttt    iiiiiii    ooooooooooo   nnnn  nnnnnnnn    
         mm:::::::m  m:::::::mm   a::::::::::::a  i:::::in:::nn::::::::nn         a::::::::::::a   cc:::::::::::::::ct:::::::::::::::::t    i:::::i  oo:::::::::::oo n:::nn::::::::nn  
        m::::::::::mm::::::::::m  aaaaaaaaa:::::a  i::::in::::::::::::::nn        aaaaaaaaa:::::a c:::::::::::::::::ct:::::::::::::::::t     i::::i o:::::::::::::::on::::::::::::::nn 
        m::::::::::::::::::::::m           a::::a  i::::inn:::::::::::::::n                a::::ac:::::::cccccc:::::ctttttt:::::::tttttt     i::::i o:::::ooooo:::::onn:::::::::::::::n
        m:::::mmm::::::mmm:::::m    aaaaaaa:::::a  i::::i  n:::::nnnn:::::n         aaaaaaa:::::ac::::::c     ccccccc      t:::::t           i::::i o::::o     o::::o  n:::::nnnn:::::n
        m::::m   m::::m   m::::m  aa::::::::::::a  i::::i  n::::n    n::::n       aa::::::::::::ac:::::c                   t:::::t           i::::i o::::o     o::::o  n::::n    n::::n
        m::::m   m::::m   m::::m a::::aaaa::::::a  i::::i  n::::n    n::::n      a::::aaaa::::::ac:::::c                   t:::::t           i::::i o::::o     o::::o  n::::n    n::::n
        m::::m   m::::m   m::::ma::::a    a:::::a  i::::i  n::::n    n::::n     a::::a    a:::::ac::::::c     ccccccc      t:::::t    tttttt i::::i o::::o     o::::o  n::::n    n::::n
        m::::m   m::::m   m::::ma::::a    a:::::a i::::::i n::::n    n::::n     a::::a    a:::::ac:::::::cccccc:::::c      t::::::tttt:::::ti::::::io:::::ooooo:::::o  n::::n    n::::n
        m::::m   m::::m   m::::ma:::::aaaa::::::a i::::::i n::::n    n::::n     a:::::aaaa::::::a c:::::::::::::::::c      tt::::::::::::::ti::::::io:::::::::::::::o  n::::n    n::::n
        m::::m   m::::m   m::::m a::::::::::aa:::ai::::::i n::::n    n::::n      a::::::::::aa:::a cc:::::::::::::::c        tt:::::::::::tti::::::i oo:::::::::::oo   n::::n    n::::n
        mmmmmm   mmmmmm   mmmmmm  aaaaaaaaaa  aaaaiiiiiiii nnnnnn    nnnnnn       aaaaaaaaaa  aaaa   cccccccccccccccc          ttttttttttt  iiiiiiii   ooooooooooo     nnnnnn    nnnnnn
                                                                                                                                                                                       
                                                                                                                                                                                       
                                                                                                                                                                                       
                                                                                                                                                                                       
                                                                                                                                                                                       
                                                                                                                                                                                       
                                                                                                                                                                                       

        */


        _.submitRecap = function() {
//alert('submitRecap');
            

            if ( _.read_ace() ) {
                document.getElementById( 'editor' ).setAttribute( 'hidden', 'true' );
                document.getElementById( 'menuRecap' ).style.display = "none";
                document.getElementById( 'menuAE' ).style.display = "inline-block"
                _.redrawRecap();
                toastr.success( 'start dragging your counter to the offer' );              
                setTimeout( function() { toastr.success(' <== it means this direction <== ') }, 4000);
                setTimeout( function() { toastr.success( 'Press "Recap viewer" to see your up-to-date recap' ) }, 10501)
            } else {
                _.roundTotal = null;
                _.roundCurrent = 0;
                //_.statusMenu = 'VIEWER';
                _.recap_array = new _.SubArray();
                _.clean_recap = [];
                _.counter_array = [];
                _.insertLines = [];
                _.counter_labels = [];
                _.offer_labels = [];
                _.tempa = '';
            }

        },

        _.redrawRecap = function() {
//alert('redrawRecap');
            if ( _.roundCurrent <= _.roundTotal ) {
                _.insertLines = new Array( _.recap_array.size1() );
                _.jsBody.resetTemplate( '#templateBody' );
                _.jsBody.set( {                                              //redraw body to countering
                    status: 'AE',
                    counterLines: _.counter_array[ _.roundCurrent ].to_counter_a(),
                    recapLines: _.recap_array.to_counter_a()
                } );

                _.jsBody.once( {                                             //add dblclick 
                    click_starteditor: function( i ) {
                        //var temp1;//, temp2;
                        _.tempa = i.node.textContent;
                        var temp1 = _.recap_array.find_line( _.tempa );
                        //temp1 = i.index.i + " ";
                        //_.tempa = _.tempa.replace( /##\d+##$/, "" );
                        i.node.parentElement.innerHTML = '<textarea rows="4" cols="50" autofocus required hard id="recapText">' + _.tempa.replace( /##\d+##$/, "" ) +
                            "</textarea>" + '<br>' + '<button class="btn btn-primary" onclick="_.doneEditingFunction( ' + temp1 + ' )">Done editing</button>';
                        document.getElementById( 'recapText' ).focus();
                    }
                } );
                _.statusMenu = 'AE';
                _.addDragAndDrop();
                $( '#countr' ).bootstrapToggle( 'on' );

            } else {                                                              // starting a new life
                toastr.options.timeOut = 10000;
                toastr.success( 'finita!! this is your final recap' );
                toastr.success( 'good luck with subs :)' );
                _.onclickVIEWER();
                _.roundTotal = null;
                _.myVarAE = [ _.createDraftAE( true ), { row: 0, column: 0 } ];
                _.myVarRecap [ "", { row: 0, column: 0 } ];
                _.roundCurrent = 0;
                _.statusMenu = 'VIEWER';
                _.recap_array = new _.SubArray();
                _.clean_recap = [];
                _.counter_array = [];
                _.insertLines = [];
                _.counter_labels = [];
                _.offer_labels = [];
                _.tempa = '';

                $( ".navbar-nav li" ).removeClass( 'active' );
                $( "#RECAPviewer" ).addClass( 'active' );
            }
            //_.statusMenu = 'AE'
        }, // REDRAW RECAP FUNCTION


        /**
         * _.defineClass() -- a utility function for defining JavaScript classes.
         *
         * This function expects a single object as its only argument.  It defines
         * a new JavaScript class based on the data in that object and returns the
         * constructor function of the new class.  This function handles the repetitive
         * tasks of defining classes: setting up the prototype object for correct
         * inheritance, copying methods from other types, and so on.
         * 
         * The object passed as an argument should have some or all of the
         * following properties:
         *
         *      name: the name of the class being defined.
         *            If specified, this value will be stored in the classname
         *            property of the prototype object.
         * 
         *    extend: The constructor of the class to be extended.  If omitted,
         *            the Object() constructor will be used.  This value will
         *            be stored in the superclass property of the prototype object.
         *
         * construct: The constructor function for the class. If omitted, a new
         *            empty function will be used.  This value becomes the return
         *            value of the function, and is also stored in the constructor
         *            property of the prototype object.
         *
         *   methods: An object that specifies the instance methods (and other shared
         *            properties) for the class.  The properties of this object are
         *            copied into the prototype object of the class.  If omitted,
         *            an empty object is used instead.  Properties named
         *            "classname", "superclass", and "constructor" are reserved
         *            and should not be used in this object.
         *
         *   statics: An object that specifies the static methods (and other static
         *            properties) for the class.  The properties of this object become
         *            properties of the constructor function.  If omitted, an empty
         *            object is used instead.
         *
         *   borrows: A constructor function or array of constructor functions.
         *            The instance methods of each of the specified classes are copied
         *            into the prototype object of this new class so that the 
         *            new class borrows the methods of each specified class.
         *            Constructors are processed in the order they are specified,
         *            so the methods of a class listed at the end of the array may
         *            overwrite the methods of those specified earlier. Note that
         *            borrowed methods are stored in the prototype object before
         *            the properties of the methods object above.  Therefore,
         *            methods specified in the methods object can overwrite borrowed
         *            methods. If this property is not specified, no methods are
         *            borrowed.
         *
         *  provides: A constructor function or array of constructor functions.
         *            After the prototype object is fully initialized, this function
         *            verifies that the prototype includes methods whose names and
         *            number of arguments match the instance methods defined by each
         *            of these classes.  No methods are copied; this is simply an
         *            assertion that this class "provides" the functionality of the
         *            specified classes.  If the assertion fails, this method will
         *            throw an exception.  If no exception is thrown, any
         *            instance of the new class can also be considered (using "duck
         *            typing") to be an instance of these other types.  If this
         *            property is not specified, no such verification is performed.
         **/
        _.defineClass = function( data ) {
            // Extract the fields we'll use from the argument object.
            // Set up default values.
            var classname = data.name;
            var superclass = data.extend || Object;
            var constructor = data.construct || function() {};
            var methods = data.methods || {};
            var statics = data.statics || {};
            var borrows;
            var provides;

            // Borrows may be a single constructor or an array of them.
            if ( !data.borrows ) borrows = [];
            else if ( data.borrows instanceof Array ) borrows = data.borrows;
            else borrows = [ data.borrows ];

            // Ditto for the provides property.
            if ( !data.provides ) provides = [];
            else if ( data.provides instanceof Array ) provides = data.provides;
            else provides = [ data.provides ];

            // Create the object that will become the prototype for our class.
            var proto = new superclass();

            // Delete any noninherited properties of this new prototype object.
            for ( var p in proto )
                if ( proto.hasOwnProperty( p ) ) delete proto[ p ];

                // Borrow methods from "mixin" classes by copying to our prototype.
            for ( var i = 0; i < borrows.length; i++ ) {
                var c = data.borrows[ i ];
                borrows[ i ] = c;
                // Copy method properties from prototype of c to our prototype
                for ( var p in c.prototype ) {
                    if ( typeof c.prototype[ p ] !== "function" ) continue;
                    proto[ p ] = c.prototype[ p ];
                }
            }

            // Copy instance methods to the prototype object
            // This may overwrite methods of the mixin classes
            for ( var p in methods ) proto[ p ] = methods[ p ];

            // Set up the reserved "constructor", "superclass", and "classname"
            // properties of the prototype.
            proto.constructor = constructor;
            proto.superclass = superclass;
            // classname is set only if a name was actually specified.
            if ( classname ) proto.classname = classname;

            // Verify that our prototype provides all of the methods it is supposed to.
            for ( var i = 0; i < provides.length; i++ ) { // for each class
                var c = provides[ i ];
                for ( var p in c.prototype ) { // for each property
                    if ( typeof c.prototype[ p ] !== "function" ) continue; // methods only
                    if ( p === "constructor" || p === "superclass" ) continue;
                    // Check that we have a method with the same name and that
                    // it has the same number of declared arguments.  If so, move on
                    if ( p in proto &&
                        typeof proto[ p ] === "function" &&
                        proto[ p ].length === c.prototype[ p ].length ) continue;
                    // Otherwise, throw an exception
                    throw new Error( "Class " + classname + " does not provide method " +
                        c.classname + "." + p );
                }
            }

            // Associate the prototype object with the constructor function
            constructor.prototype = proto;

            // Copy static properties to the constructor
            for ( var p in statics ) constructor[ p ] = data.statics[ p ];

            // Finally, return the constructor function
            return constructor;
        }
    //};



    /*
                                                                                                
                                                                                                
                        lllllll                                                                 
                        l:::::l                                                                 
                        l:::::l                                                                 
                        l:::::l                                                                 
        cccccccccccccccc l::::l   aaaaaaaaaaaaa      ssssssssss       ssssssssss                
      cc:::::::::::::::c l::::l   a::::::::::::a   ss::::::::::s    ss::::::::::s        :::::: 
     c:::::::::::::::::c l::::l   aaaaaaaaa:::::ass:::::::::::::s ss:::::::::::::s       :::::: 
    c:::::::cccccc:::::c l::::l            a::::as::::::ssss:::::ss::::::ssss:::::s      :::::: 
    c::::::c     ccccccc l::::l     aaaaaaa:::::a s:::::s  ssssss  s:::::s  ssssss              
    c:::::c              l::::l   aa::::::::::::a   s::::::s         s::::::s                   
    c:::::c              l::::l  a::::aaaa::::::a      s::::::s         s::::::s                
    c::::::c     ccccccc l::::l a::::a    a:::::assssss   s:::::s ssssss   s:::::s       :::::: 
    c:::::::cccccc:::::cl::::::la::::a    a:::::as:::::ssss::::::ss:::::ssss::::::s      :::::: 
     c:::::::::::::::::cl::::::la:::::aaaa::::::as::::::::::::::s s::::::::::::::s       :::::: 
      cc:::::::::::::::cl::::::l a::::::::::aa:::as:::::::::::ss   s:::::::::::ss               
        ccccccccccccccccllllllll  aaaaaaaaaa  aaaa sssssssssss      sssssssssss                 
                                                                                                
                                                                                                
                                                                                                
                                                                                                
                                                                                                
                                                                                                
                                                                                                

    */


    _.SubArray = _.defineClass( {
        name: "_.SubArray",
        extend: Array,
        construct: function() {
            this.superclass(); // chain to superclass
            this.sysa = [];
        },
        methods: {
            //isInside: function(x,y) {
            //    return x > this.x && x < this.x+this.width &&
            //        y > this.y && y < this.y+this.height;
            //},

            //round: function() {
            //   return RecapClass._.roundCurrent;
            //},

            /*to_a: function()
            {
              var temp = [];
              for ( var i = 0, len = this.size1(); i < len; i++ ) temp.push( this[i] );
              return temp
            },*/

            to_counter_a: function() {

                var temp = [];
                var tempString;
                var tempArray = [];
                var tempCountered = [];

                temp.countered = [];

                for ( var i = 0, len = this.size1(); i < len; i++ ) {
                    if ( this[ i ][ 0 ] instanceof Array ) {                                             // if it was splitted

                        for ( var ii = 0, lenii = this[ i ][ 0 ].length; ii < lenii; ii++ ) {
                            if ( this[ i ][ 0 ][ ii ][ 0 ] ) {                                           // and countered
                                if ( /##\d+##$/.test( this[ i ][ 0 ][ ii ][ 0 ] ) ) {                    // and has ## N ##
                                    tempString = this[ i ][ 0 ][ ii ][ 0 ].replace( /##\d+##$/, '<span hidden>' + this[ i ][ 0 ][ ii ][ 0 ].match( /##\d+##$/ ) + '</span>' );
                                    tempArray.push( tempString );
                                } else {                                                                // or has no ## N ##
                                    tempArray.push( this[ i ][ 0 ][ ii ][ 0 ] )
                                }
                                tempCountered.push( this[ i ][ 0 ][ ii ].length === 1 ? false : true );
                            }
                        }
                        temp.push( tempArray );
                        temp.countered.push( tempCountered );
                        tempArray = [];
                        tempCountered = [];
                    } else if ( /^\s##\d+##/.test( this[ i ][ 0 ] ) ) {                             // skip, if empty line or empty label
                        continue;
                    } else if ( !this.sysa[ i ][ 1 ] ) {                                               // if NOT accepted AND not splitted (simple counter)
                        tempString = this[ i ][ 0 ].replace( /##\d+##$/, '<span hidden>' + this[ i ][ 0 ].match( /##\d+##$/ ) + '</span>' );
                        temp.push( tempString )
                        temp.countered.push( this.sysa[ i ][ 0 ] ) //countered?
                    }
                }
                return temp
            },

            size1: function() {
                var count = 0;
                for ( var i in this ) {
                    if ( !isNaN( parseInt( i ) ) ) count++
                }
                return count
            },

            add_line: function( nbr, value ) {
                if ( this[ nbr ] ) this.splice( nbr, 0, 'here will be a new recap_line' ); //if NBR exist (true) - insert the new array entry in bewteen
                this[ nbr ] = _.makeArrayOf( null, _.roundCurrent );
                if ( !/##\d+##$/.test( value ) ) value = value + ' ##' + nbr + '##';
                this[ nbr ].unshift( value );
                //if ( value instanceof Array ) this[ nbr ] = _.flatten( this[ nbr ] );
                if ( this.sysa[ nbr ] ) this.sysa.splice( nbr, 0, [] );
                this.sysa[ nbr ] = [ false, false, '', true, nbr ]; // deafult new sysa

                /*
                #sys = [false,false,'',true]
                # @sys[0] countered?
                # @sys[1] accepted?
                # @sys[2] label
                # @sys[3] hard-label?
                # @sys[4] line no.
                */

                ///^(\W*\s*.?\w+){3}\s*:

                //^(\S*\s*.?\S+){3}\s*:

                var temp = value.match( /^(\S*\s*.?\w+){3}\s*:/ );
                if ( temp ) {
                    //var temp = value.match( /^(\W*\s*.?\w+){3}\s*:/ );
                    this.sysa[ nbr ][ 2 ] = temp[ 0 ];
                    this[ nbr ][ 0 ] = this[ nbr ][ 0 ].replace( temp[ 0 ], "" )
                }; //if label (any one - soft of hard)
                //if ( s.startsWith( value, '_' ) ) this.sysa[ nbr ][ 3 ] = false; //#if soft-label

            },

            show_label: function( nbr ) {
                return ( nbr instanceof Array ? this.sysa[ nbr[ 0 ] ][ 2 ] : this.sysa[ nbr ][ 2 ] )
            },

            counterRecap: function( offerline, counterline ) {
   
                var iOfferNbr = this.find_line( _.remove_label( offerline ) ) || this.find_line( offerline );
                var iCounterNbr = _.counter_array[ _.roundCurrent ].find_line( _.remove_label( counterline ) );
                var tempString;

                if ( iOfferNbr instanceof Array ) {                                                         // if it was splitted to Array

                    if ( iCounterNbr === 1) {
                        tempString = this[ iOfferNbr[ 0 ] ][ 0 ][ iOfferNbr[ 1 ] ][ 0 ].match( /##\d+##$/ );
                        this[ iOfferNbr[ 0 ] ][ 0 ][ iOfferNbr[ 1 ] ].unshift( 
                                  '[DELETION STARTS '
                                + this[ iOfferNbr[ 0 ] ][ 0 ][ iOfferNbr[ 1 ] ][ 0 ].replace( tempString, '' ) 
                                + ' [/DELETION ENDS] ' 
                                + tempString );
                    } else if ( iCounterNbr === 0 ) {
                        this[ iOfferNbr[ 0 ] ][ 0 ][ iOfferNbr[ 1 ] ].unshift( _.counter_array[ _.roundCurrent ][ iCounterNbr ][ 0 ] )
                        //this[ iOfferNbr[ 0 ] ][ 0 ][ iOfferNbr[ 1 ] ].unshift( '---' );
                        //this[ iOfferNbr[ 0 ] ][ 0 ][ iOfferNbr[ 1 ] ].unshift( null );
                    } else {
                        this[ iOfferNbr[ 0 ] ][ 0 ][ iOfferNbr[ 1 ] ].unshift( _.counter_array[ _.roundCurrent ][ iCounterNbr ][ 0 ] )
                    } //_.recap_array countered

                    if ( _.counter_array[ _.roundCurrent ].show_label( iCounterNbr ) ) {
                        this.sysa[ iOfferNbr[ 0 ] ][ 2 ] = _.counter_array[ _.roundCurrent ].show_label( iCounterNbr )
                    }

                    if ( iCounterNbr === 0 ) {
                        this.sysa[ iOfferNbr[ 0 ] ][ 1 ] = true
                    } else {
                        this.sysa[ iOfferNbr[ 0 ] ][ 0 ] = true
                    }                                                //  @sys[0] countered

                    if ( counterline.trim() !== ( _.SOFT_DELETE + " ##1##" ) 
                            && counterline.trim() !== ( _.HARD_DELETE + " ##0##" ) ) {
                        _.counter_array[ _.roundCurrent ].sysa[ iCounterNbr ][ 1 ] = true;
                        _.counter_array[ _.roundCurrent ].sysa[ iCounterNbr ][ 0 ] = true
                    }

                    return [ iOfferNbr, iCounterNbr ]

                } else {                                                                                    //usual counter      

                    if ( iCounterNbr === 1 ) {
                        tempString = this[ iOfferNbr ][ 0 ].match( /##\d+##$/ );
                        this[ iOfferNbr ].unshift( 
                                  '[DELETEION STARTS] ' 
                                + this[ iOfferNbr ][ 0 ].replace( tempString, '' ) 
                                + ' [/DELETION ENDS] '
                                + tempString );
                    } else {
                        this[ iOfferNbr ].unshift( _.counter_array[ _.roundCurrent ][ iCounterNbr ][ 0 ] )
                    }     //_.recap_array countered
                    
                    if ( iCounterNbr === 0 ) {
                        this.sysa[ iOfferNbr ][ 1 ] = true
                    } else {
                        this.sysa[ iOfferNbr ][ 0 ] = true
                    }                                                     //  @sys[0] countered

                    if ( _.counter_array[ _.roundCurrent ].show_label( iCounterNbr ) ) {
                        this.sysa[ iOfferNbr ][ 2 ] = _.counter_array[ _.roundCurrent ].show_label( iCounterNbr )
                    }                                                                                       //adding label to sysa = line

                    if ( counterline.trim() !== ( _.SOFT_DELETE + " ##1##") 
                            && counterline.trim() !== ( _.HARD_DELETE + " ##0##") ) {
                        _.counter_array[ _.roundCurrent ].sysa[ iCounterNbr ][ 1 ] = true;
                        _.counter_array[ _.roundCurrent ].sysa[ iCounterNbr ][ 0 ] = true
                    }

                    return [ iOfferNbr, iCounterNbr ]
                }
                //return false
            },

            find_line: function( linetext )
                //will return line NBR or ARRAY of line NBRs (if sub Array)
                {

                    //linetext = linetext
                    //    .replace( /<span hidden>/, "" )
                    //    .replace( /<\/span>/, "" );

                    //toastr.error(linetext);

                    linetext = linetext.trim().toUpperCase();

                    for ( var i = 0, len = this.size1(); i < len; i++ ) {
                        if ( this[ i ][ 0 ] instanceof Array ) {
                            for ( var k = 0, lenk = this[ i ][ 0 ].length; k < lenk; k++ ) {
                                if ( this[ i ][ 0 ][ k ][ 0 ] !== null && this[ i ][ 0 ][ k ][ 0 ].trim() === linetext ) return [ i, k ]
                            }
                        } else if ( this[ i ][ 0 ] !== null && _.remove_label( this[ i ][ 0 ].trim() ) === linetext ) {
                            return i
                        }
                    }

                    linetext = _.escapeHtml( linetext ); // just in case....

                    for ( var i = 0, len = this.size1(); i < len; i++ ) {
                        if ( this[ i ][ 0 ] instanceof Array ) {
                            for ( var k = 0, lenk = this[ i ][ 0 ].length; k < lenk; k++ ) {
                                if ( this[ i ][ 0 ][ k ][ 0 ] !== null && _.remove_label( this[ i ][ 0 ][ k ][ 0 ] ).trim() === linetext ) return [ i, k ]
                            }
                        } else if ( this[ i ][ 0 ] !== null && _.remove_label( this[ i ][ 0 ].trim() ) === linetext ) return i
                    }

                    linetext = _.unescapeHtml( linetext ); // just in case....

                    for ( var i = 0, len = this.size1(); i < len; i++ ) {
                        if ( this[ i ][ 0 ] instanceof Array ) {
                            for ( var k = 0, lenk = this[ i ][ 0 ].length; k < lenk; k++ ) {
                                if ( this[ i ][ 0 ][ k ][ 0 ] !== null && _.remove_label( this[ i ][ 0 ][ k ][ 0 ] ).trim() === linetext ) return [ i, k ]
                            }
                        } else if ( this[ i ][ 0 ] !== null && _.remove_label( this[ i ][ 0 ].trim() ) === linetext ) return i
                    }
                    return false
                },

            find_label: function( label ) {
                for ( var i = 0, len = this.sysa.length; i < len; i++ ) {
                    if ( this.sysa[ i ][ 2 ] === label ) return i //return label index
                };
                return false; //... or FALSE
            },

            ae: function() { //for the first round when line numbers are equal (offer === recap)
                for ( var i = 0, len = this.size1(); i < len; i++ ) {
                    //COUNTERED LINES
                    if ( !this.sysa[ i ][ 0 ] ) { // if not countered (false) = accepted (true)
                        this[ i ].unshift( null );
                        this.sysa[ i ][ 1 ] = true;
                    } else {
                        if ( this[ i ][ 0 ] instanceof Array ) { //split subarrays between counters
                            this[ i ].unshift( $.extend( true, [], this[ i ][ 0 ] ) ); // array of arrays copy by value
                            for ( var ii = 0, lenii = this[ i ][ 0 ].length; ii < lenii; ii++ ) {
                                if ( this[ i ][ 0 ][ ii ].length === 1 ) {
                                    this[ i ][ 0 ][ ii ].unshift( null );
                                    this[ i ][ 0 ][ ii ].splice( 1, 1 )
                                } else {
                                    this[ i ][ 1 ][ ii ].splice( 0, 1 );
                                    this[ i ][ 0 ][ ii ].splice( 1, 1 )
                                }
                            }
                        }
                        this.sysa[ i ][ 0 ] = false // else reset status for next _.roundCurrent of counteing
                    }
                } // for loop

                _.roundCurrent++;

                //ADDED LINES:
                for ( i in _.insertLines ) {
                    if ( _.insertLines[ i ] ) { //use really added _.insertLines (not UNDEFINED)
                        this.add_line( ( i - 0 ), _.insertLines[ i ] ); //copy all added lines to appropriate lines to _.recap_array
                        //this.sysa[i-0][0] = false                              //countered
                    }
                }
            },

            /*rehash: function()
            {
              for (var i = 0, len = this.size1(); i < len; i++) {
                this.sysa[i][4] = i
              }
            },*/

            create_recap: function( rou ) {
                //debugger;
                //if ( _.roundCurrent == 5 ) toastr.error('stop');
                var round_no = _.roundTotal - rou;
                var round_no_iteration;

                var temp = [];
                var tempSub_Array = [];
                var tempString;
                var tempLabel;

                round_no = 0;                                                     //!!!!!!!!!!!!!!!!!!!! temporarily desision

                for ( var i = 0, len = this.size1(); i < len; i++ ) {                                     
                    if ( this[ i ][ round_no ] instanceof Array ) {                         //if [subArray], [subArray], etc.              
                        iterateSubArray( i, round_no, this );
                    } else if ( this[ i ][ round_no ] ) {                                    // if "string with usual counter" (not splitted to subArray)
                        noSubArray( i, round_no, this );
                    } else {                                                                //if null then iterating thru round_no till next NOT NULL
                        round_no_iteration = round_no + 1;
                        while ( round_no_iteration <= _.roundTotal + 1 ) {                    //last iteration == roundTotal, finita == roundTotal + 1
                            if ( this[ i ][ round_no_iteration ] instanceof Array ) {        // if null, [subArray], [subArray], etc
                                iterateSubArray( i, round_no_iteration, this );
                                break;
                            } else if ( this[ i ][ round_no_iteration ] ) {                  // if null, "string with usual counter", "string with usual counter", etc.
                                noSubArray( i, round_no_iteration, this );
                                break
                            } else {
                                round_no_iteration++
                            }
                        }
                    }
                }

                temp.push('\n\n======\ncreated with www.fixingfriday.com')

                return temp;

                function iterateSubArray( i, iRound, that ) {
                    //var iround_no_iteration;
                    for ( var ii = 0, lenii = that[ i ][ iRound ].length; ii < lenii; ii++ ) {     // going via each splitted line of subArray
                        if ( that[ i ][ iRound ][ ii ][ 0 ] ) {                                    //if the line is not null
                            tempString = that[ i ][ iRound ][ ii ][ 0 ];
                            tempString = tempString.trim().replace( /##\d+##$/, '' );
                            tempSub_Array.push( tempString )
                        } else {                                                                     //else iterating thru round_no till next NOT NULL
                            round_no_iteration = iRound + 1;
                            while ( true ) {
                                if ( that[ i ][ round_no_iteration ][ ii ][ 0 ] ) {
                                    tempString = that[ i ][ round_no_iteration ][ ii ][ 0 ];
                                    tempString = tempString.trim().replace( /##\d+##$/, '' );
                                    tempSub_Array.push( tempString );
                                    break
                                } else {
                                    round_no_iteration++
                                }
                            }
                        }
                    }
                    tempLabel = that.show_label( i ) ? that.show_label( i ) + ' ' : "";
                    tempString = tempLabel + tempSub_Array.join( ' ' );//    + '\n';
                    temp.push( tempString );
                    tempSub_Array = [];
                }

                function noSubArray ( i, iRound, that ) {
                    tempString = that[ i ][ iRound ];
                    tempString = tempString.trim().replace( /##\d+##$/, ' ' );
                    tempLabel = that.show_label( i ) ? that.show_label( i ) + ' ' : "";
                    tempString = tempLabel + tempString; //+ '\n';
                    temp.push( tempString );
                }
            },

            icounteredQ: function( offerlineNo ) {
                // result of .find_line()   either i or [i, k]
                if ( offerlineNo instanceof Array ) {
                    return ( this[ offerlineNo[ 0 ] ][ 0 ][ offerlineNo[ 1 ] ].length !== 1 ? true : false )
                }
                return this.sysa[ offerlineNo ][ 0 ] //sysa[0] can be either TRUE or FALSE
            },


            /*                                                                                                                                              
                                                                                                                                                  dddddddd
                                lllllll                                                                                                           d::::::d
                                l:::::l                                                                                                           d::::::d
                                l:::::l                                                                                                           d::::::d
                                l:::::l                                                                                                           d:::::d 
                cccccccccccccccc l::::l   aaaaaaaaaaaaa      ssssssssss       ssssssssss            eeeeeeeeeeee    nnnn  nnnnnnnn        ddddddddd:::::d 
              cc:::::::::::::::c l::::l   a::::::::::::a   ss::::::::::s    ss::::::::::s         ee::::::::::::ee  n:::nn::::::::nn    dd::::::::::::::d 
             c:::::::::::::::::c l::::l   aaaaaaaaa:::::ass:::::::::::::s ss:::::::::::::s       e::::::eeeee:::::een::::::::::::::nn  d::::::::::::::::d 
            c:::::::cccccc:::::c l::::l            a::::as::::::ssss:::::ss::::::ssss:::::s     e::::::e     e:::::enn:::::::::::::::nd:::::::ddddd:::::d 
            c::::::c     ccccccc l::::l     aaaaaaa:::::a s:::::s  ssssss  s:::::s  ssssss      e:::::::eeeee::::::e  n:::::nnnn:::::nd::::::d    d:::::d 
            c:::::c              l::::l   aa::::::::::::a   s::::::s         s::::::s           e:::::::::::::::::e   n::::n    n::::nd:::::d     d:::::d 
            c:::::c              l::::l  a::::aaaa::::::a      s::::::s         s::::::s        e::::::eeeeeeeeeee    n::::n    n::::nd:::::d     d:::::d 
            c::::::c     ccccccc l::::l a::::a    a:::::assssss   s:::::s ssssss   s:::::s      e:::::::e             n::::n    n::::nd:::::d     d:::::d 
            c:::::::cccccc:::::cl::::::la::::a    a:::::as:::::ssss::::::ss:::::ssss::::::s     e::::::::e            n::::n    n::::nd::::::ddddd::::::dd
             c:::::::::::::::::cl::::::la:::::aaaa::::::as::::::::::::::s s::::::::::::::s       e::::::::eeeeeeee    n::::n    n::::n d:::::::::::::::::d
              cc:::::::::::::::cl::::::l a::::::::::aa:::as:::::::::::ss   s:::::::::::ss         ee:::::::::::::e    n::::n    n::::n  d:::::::::ddd::::d
                ccccccccccccccccllllllll  aaaaaaaaaa  aaaa sssssssssss      sssssssssss             eeeeeeeeeeeeee    nnnnnn    nnnnnn   ddddddddd   ddddd
                                                                                                                                                          
                                                                                                                                                          
                                                                                                                                                          
                                                                                                                                                          
                                                                                                                                                          
                                                                                                                                                          
                                                                                                                                                          
            */


            index_labels: function() {
                //return _.filter( this.sysa, function(num) {return num[2] !== ""; })
                var temp = [];
                for ( var i = 0, len = this.sysa.length; i < len; i++ ) {
                    if ( this.sysa[ i ][ 2 ] !== '' ) temp.unshift( this.sysa[ i ][ 2 ] )
                };
                //toastr.error(temp);
                return temp
            },

            sysa: function() {
                //toastr.error("caller is " + arguments.callee.caller.toString());
                return this.sysa;
            },

            //counter_with: function(offerline, counter_line) {
            //  if (this.sysa[offerline][0] || this.sysa[offerline][1]) return false;                // if frozen? or tainted? return FALSE
            //  this[offerline].unshift(counter_line);                    // #instert new value to beg of Strings array [0]
            //  this.sysa[offerline][0] = true                            // #mark as 'countered' (line is being worked firm right now, not accepted yet)
            //  return true;                                              // if countered OK return TRUE
            //},



            accept: function( offerline ) {
                if ( this.sysa[ offerline ][ 0 ] || this.sysa[ offerline ][ 1 ] ) return false;
                this.sysa[ offerline ][ 1 ] = true;
                return this.sysa[ offerline ][ 1 ];
            },

            any_taintedQ: function() {
                var x = 0;
                //_.each(this, function(num) { if (!this.sysa[num][0]) x+=1; });
                for ( var i = 0, len = this.sysa.length; i < len; i++ ) {
                    if ( this.sysa[ i ][ 0 ] ) x++
                };
                return x
            },

            ifreezeE: function( offerline ) {
                this.sysa[ offerline ][ 1 ] = true
            },
            itaintE: function( offerline ) {
                this.sysa[ offerline ][ 0 ] = false
            },
            iuntaintE: function( offerline ) {
                this.sysa[ offerline ][ 0 ] = true
            },

            ifrozenQ: function( offerline ) {
                return this.sysa[ offerline ][ 1 ]
            }


        },
        statics: {
            comparator: function( a, b ) {
                return a.compareTo( b );
            }
        }
        //borrows: [GenericEquals]
    } );

    /*
                                                                                                                                                         
                                                                                        bbbbbbbb                                                         
                                                                 iiii                   b::::::b            lllllll                                      
                                                                i::::i                  b::::::b            l:::::l                                      
                                                                 iiii                   b::::::b            l:::::l                                      
                                                                                         b:::::b            l:::::l                                      
    vvvvvvv           vvvvvvvaaaaaaaaaaaaa  rrrrr   rrrrrrrrr  iiiiiii   aaaaaaaaaaaaa   b:::::bbbbbbbbb     l::::l     eeeeeeeeeeee        ssssssssss   
     v:::::v         v:::::v a::::::::::::a r::::rrr:::::::::r i:::::i   a::::::::::::a  b::::::::::::::bb   l::::l   ee::::::::::::ee    ss::::::::::s  
      v:::::v       v:::::v  aaaaaaaaa:::::ar:::::::::::::::::r i::::i   aaaaaaaaa:::::a b::::::::::::::::b  l::::l  e::::::eeeee:::::eess:::::::::::::s 
       v:::::v     v:::::v            a::::arr::::::rrrrr::::::ri::::i            a::::a b:::::bbbbb:::::::b l::::l e::::::e     e:::::es::::::ssss:::::s
        v:::::v   v:::::v      aaaaaaa:::::a r:::::r     r:::::ri::::i     aaaaaaa:::::a b:::::b    b::::::b l::::l e:::::::eeeee::::::e s:::::s  ssssss 
         v:::::v v:::::v     aa::::::::::::a r:::::r     rrrrrrri::::i   aa::::::::::::a b:::::b     b:::::b l::::l e:::::::::::::::::e    s::::::s      
          v:::::v:::::v     a::::aaaa::::::a r:::::r            i::::i  a::::aaaa::::::a b:::::b     b:::::b l::::l e::::::eeeeeeeeeee        s::::::s   
           v:::::::::v     a::::a    a:::::a r:::::r            i::::i a::::a    a:::::a b:::::b     b:::::b l::::l e:::::::e           ssssss   s:::::s 
            v:::::::v      a::::a    a:::::a r:::::r           i::::::ia::::a    a:::::a b:::::bbbbbb::::::bl::::::le::::::::e          s:::::ssss::::::s
             v:::::v       a:::::aaaa::::::a r:::::r           i::::::ia:::::aaaa::::::a b::::::::::::::::b l::::::l e::::::::eeeeeeee  s::::::::::::::s 
              v:::v         a::::::::::aa:::ar:::::r           i::::::i a::::::::::aa:::ab:::::::::::::::b  l::::::l  ee:::::::::::::e   s:::::::::::ss  
               vvv           aaaaaaaaaa  aaaarrrrrrr           iiiiiiii  aaaaaaaaaa  aaaabbbbbbbbbbbbbbbb   llllllll    eeeeeeeeeeeeee    sssssssssss    
                                                                                                                                                         
                                                                                                                                                         
                                                                                                                                                         
                                                                                                                                                         
                                                                                                                                                         
                                                                                                                                                         
                                                                                                                                                         


    */

    _.myVarAE = [ _.createDraftAE(), { row: 0, column: 0 } ];
    //_.myVarRecap = "Paste your recap here, it will highlight some important words like \'deduct\', \'risk\', \'freight\', \'chrtrs\', \'insert\', \'delete\', USD 1 000 000 PMT etc. etc. for your convenience and quicker reading. You can use it for a very quick glance on your CP\/recap (pls feel free to send me email if want to add more keywords to the highlighing dictionary).\n\nExample below, to delete all this text: ## mouse click here => Ctrl-A => Del.\n\nIf colors are distructing - you can switch it on\/off. Also you can switch between a few dark and bright themes.\n\nLine numbering is added for easy ref.\n\nALL YOUR TEXT IS NOT SENT ANYWHERE, ALL THE HIGHLIGHTING IS BEING DONE ON CLIENT SIDE - I.E. BY YOUR OWN PC IN YOUR OWN WEB-BROUSER WITHOUT SENDING. \n\n=======\nSTART::\n=======\n\nPLSD TO RECAP FOLL SUBFIXTURE\n\nSUBS STEM\/SHIPPERS\/RECIEVERS\/CHARTERERS TOP MANAGEMENT APPROVAL TO BE LIFTED LATEST BY TODAY BLA-BLA-BLA 2013 18:00 HRS GENEVA TIME\n\n==============================================================\nS T R I C T L Y  P R I V A T E  A N D  C O N F I D E N T I A L\n==============================================================\n                        (TITLE)\n \nCHARTERER: \nBLA-BLA-BLA\n\nREGISTERED OWNERS: \nBLA-BLA-BLA\n\nTECHNICAL OPERATOR: \nBLA-BLA-BLA\n\nDPA OWNERS SIDE: REVERTING\n\nCOMMERCIAL OPERATOR: \nBLA-BLA-BLA\n\nBROKER : \nBLA-BLA-BLA\n\nCP FORM: \nBP VOY 4\n \nCP DATE: \nON SUBS\n \n------------------------------------------------------------------\n                        (VESSEL)\n \nVESSEL              : BLA-BLA-BLA\nSDWT                : BLA-BLA-BLA\nSDRAFT              : BLA-BLA-BLA\nLOA                  : BLA-BLA-BLA\nBEAM                 : BLA-BLA-BLA\nFLAG                 : BLA-BLA-BLA\nBUILT                : BLA-BLA-BLA\nCLASS                : BLA-BLA-BLA\nCUBIC 98 PCT         : BLA-BLA-BLA\nSLOP 98 PCT          : BLA-BLA-BLA\nSEGREGATIONS         : BLA-BLA-BLA\nPUMPS                : BLA-BLA-BLA\nTPC                  : BLA-BLA-BLA\nBCM                  : BLA-BLA-BLA\nKTM                  : BLA-BLA-BLA\nIGS                  : BLA-BLA-BLA\nCOW                  : BLA-BLA-BLA\nSBT                  : BLA-BLA-BLA\nCRANES               : BLA-BLA-BLA\nCOATED               : BLA-BLA-BLA\nHULL                 : DOUBLE HULL\nP AND I              : BLA-BLA-BLA\nH+M VALUE            : BLA-BLA-BLA\n\nLAST THREE CARGOES   : GASOIL \/ GASOIL \/ FUEL OIL\nLAST SIRE            : BLA-BLA-BLA\nTTBOOK               : BLA-BLA-BLA\n\nITINERARY            : BLA-BLA-BLA\n \n--------------------------------------------------------------------\n                           (CARGO)\n \nCARGO QUANTITY: CHOPT FULL CARGO \nGRADE(S): 1-2 GRADES GASOIL \/ ULSD UND 2.5 NPA \nHEAT: N\/A\nINTAKES: OWNERS WARRANT VESSELS\' MIN INTAKE IS BLA-BLA-BLA MTS GASOIL BASIS MIN SG 0.84 AT 15 DEG C.\n \n------------------------------------------------------------------------\n                          (GEOGRAPHICAL)\n \nLOADING  : 1 SPB BSEA\n \nDISCHARGE: 1 SPB USAC\/USG, OR IN CHOPT \n           1 SPB MED\n \n------------------------------------------------------------------------\n                          (FINANCIAL)\n \nFREIGHT:   USD BIZILLION LUMPSUM 1-1\n \nLAYCAN:    BLA-BLA-BLA 2013 00:01-23:59 \n \nLAYTIME:   72HRS TOTAL SHINC \n \nDEMURRAGE: USD BLA-BLA-BLA PDPR\n \nAGENTS:    CHARTERERS AGENTS BOTH ENDS PROVIDED COMPETITIVE\n \nSAMPLING CLAUSE\n---------------\nCHARTERERS HAVE THE OPTION TO PERFORM OPEN HATCH SAMPLING IF REQUIRED\nBUT ALWAYS SUBJECT TO HEAD OWNERS APPROVAL ON A CASE BY BASE BASIS.\nOPEN HATCH SAMPLING IS OK PROVIDED THAT PORT AUTHORITIES\/CHARTERERS\nAND LOAD\/DISCHARGE INSTALLATION ACCEPT SAME.\n \nSTS CLAUSE\n----------\nCHARTERERS HAVE THE OPTION TO DISCHARGE\/LOAD ALL CARGO VIA S-T-S AT A SAFE\nANCHORAGE\/PLACE. SUCH OPERATION TO BE ALWAYS SUBJECT\nTO MASTER\'S APPROVAL, WHICH NOT TO BE UNREASONABLY WITHHELD.\nCHARTERERS TO SUPPLY AT THEIR TIME AND EXPENSE ALL NECESSARY\nEQUIPMENT\/PERSONNEL\/PERMISSIONS FOR THE OPERATION WHICH TO BE\nCONDUCTED STRICTLY ACCORDING TO OCIMF S-T-S TRANSFER GUIDE\n(PETROLEUM). S-T-S OPERATION TO BE COMPLETELY FREE OF ANY EXPENSES\nFOR THE OWNERS\/VESSEL INCLUDING BUT NOT LIMITED TO D\/A\'S, AGENCY FEES, ETC.\nUPON VESSELS ARRIVAL AT STS POSITION TIME WILL COUNT IN FULL,\nUNINTERRUPTEDLY, UNTILL COMPLETION OF THE OPERATION OF THE CARGO\nAND THE 2 VSLS SEPERATED. NO ALLOWANCE FOR 6 HOURS FREETIME.\nTIME LOST THERE OWING TO BAD WEATHER\/SEA CONDITIONS TO COUNT IN FULL\nAGAINST LAYTIME OR FULL DEMURRAGE IF ON DEMURRAGE.\n \n                        (T E R M S) – SUB OWNERS REVIEW\n \nAMENDMENTS TO BPVOY 4\n---------------------\nIN THE EVENT OF CONFLICT BETWEEN THE PROVISIONS SET OUT HEREIN AND ANY\nPRINTED TERMS OF THE CHARTER PARTY FORM, THE PROVISIONS SET OUT HEREIN\nWILL PREVAIL:\n \nGENERAL AMENDMENTS:\nDELETE ALL REFERENCES TO \'BP SHIPPING QUESTIONNAIRE\' AND REPLACE WITH\n\'Q88 QUESTIONNAIRE FORM VERSION 3 OR ANY SUBSEQUENT MODIFICATION\'\nANY REFERENCE TO TELEX (ES) TO BE DEEMED TO ALSO BE A REFERENCE TO\nEMAIL(S) ALL DISTANCES AND ANY REFERENCE TO ADDITIONAL DISTANCES TO BE\nASSESSED BY REFERENCE TO ONLINE WEB-BASED \'BP SHIPPING MARINE DISTANCE\nTABLES\' PRODUCED BY ATOBVIAC.\n \nPART 1\n------\nLINE 75: DELETE 1600 INSERT 2359\n \nLINE 85: INSERT \'48 HRS\'\n \nDELETE FOLLOWING PARA: \nLINE 98.1: N. POSITION OWNERS WARRANT VESSEL\'S POSITION AT TIME OF\n           FIXTURE IS ___________ AND VESSEL IS PROCEEDING AT______\n           KNOTS, AND IS EXPECTED TO ARRIVE AND BE READY TO LOAD\n           _______________ AT LOAD PORT OF ___________________\n \nPART 2\n------\nCLAUSE 1 CONDITION OF VESSEL\nLINE 110: RECOMMENDATIONS SET OUT IN THE 1996 MOST RECENT EDITION OF\nISGOTT,\n \nCLAUSE 2 CHARTERING QUESTIONNAIRE\n         LINE 125: INSERT \'SIGNIFICANTLY\' AFTER \'TO BE\'\n \nCLAUSE 4 ESTIMATED TIME OF ARRIVAL\n         LINE 186: INSERT \'PROVEN\' BEFORE \'LOSS\'\n         LINE 195: AFTER \'PORT\' INSERT \'WHEN\/WHERE APPLICABLE\'\n         LINE 199: AS ABOVE\n         LINE 212: AFTER \'TELEX\' INSERT \'EMAIL\'\nCLAUSE 5 LOADING AND DISCHARGE PORT\/SHIFTING\n         LINE 219: AFTER \'ALWAYS\' INSERT \'PROCEED THERETO\'\n         LINE 234: DELETE \'ALL\' BEFORE \'SUPPORTING\'\n \nCLAUSE 6 NOTICE OF READINESS\n         LINE 254: AFTER \'REPRESENTATIVE\' INSERT \'IF SUCH SIGNATURE IS\n         OBTAINABLE\'\n         PART 6.3.3- DELETE CLAUSE IN ITS ENTIRETY AND INSERT THE\n         FOLLOWING: FREE PRATIQUE HAS BEEN GRANTED OR IS GRANTED WITHIN\n         SIX (6) HOURS OF THE MASTER TENDERING NOR. IF FREE PRATIQUE IS\n         NOT GRANTED WITHIN SIX (6) HOURS OF THE MASTER TENDERING NOR,\n         THROUGH NO FAULT OF OWNERS, AGENTS, OR THOSE ON BOARD THE\n         VESSEL, THE MASTER SHALL ISSUE A PROTEST IN WRITING (\'NOP\')\n         TO THE PORT AUTHORITY AND THE FACILITY AT THE PORT (\'TERMINAL\')\n         FAILING WHICH LAYTIME OR, IF THE VESSEL IS ON DEMURRAGE,\n         DEMURRAGE SHALL ONLY COMMENCE SIX (6) HOURS AFTER FREE PRATIQUE\n         HAS BEEN GRANTED OR VESSEL COMMENCES LOADING OR DISCHARGING\n         OPERATIONS, WHICHEVER IS THE EARLIEST; AND\n \n         PART 6.3.4- DELETE IN ITS ENTIRETY\n \nCLAUSE 7 LAYTIME\/DEMURRAGE\n         LINE 288: DELETE AS FROM \'UNLESS\' TILL END OF PARAGRAPH 7.2\n         LINE 294-299-300: DELETE \'0600\' INSERT \'0001 BUT CHARTERERS\n         ALWAYS ENTITLED TO 6 HOURS NOR EACH PORT\'\n         LINE 301: ADD AT THE END \'EXCEPT UNDER THE INTERIM PORT CLAUSE,\n         CHARTERERS ALWAYS TO BE ENTITLED TO 6 HOURS NOR AT FIRST PORT\n         AND FIRST DISPORT, UNLESS VESSEL BEING ALL FAST PRIOR, WHERE\n         TIME TO COUNT FROM BEING ALL FAST.\'\n         LINE 314-315: DELETE \'UPON THE COMPLETION OF CARGO\n         DOCUMENTATION\' AND REPLACE WITH \' ONCE CARGO DOCUMENTS ARE\n         DELIVERED ON BOARD.\'\n \nCLAUSE 8 CARGO TRANSFERS\n         LINE 342: AFTER \'THERETO\' INSERT \'ALWAYS SUBJECT TO\n         OWNERS\/MASTER ACCEPTANCE WHICH NOT TO BE UNREASONABLY WITHHELD\'\n         LINE 355: BEFORE \'OWNERS\' INSERT \'HOWEVER ALL TRANSFER ARE\n         ALWAYS SUBJECT TO OWNERS\/MASTER ACCEPTANCE WHICH SHALL NOT BE\n         UNREASONABLY WITHHELD\'\n         LINE 359: AFTER \'INCLUDING\' INSERT \'BUT NOT LIMITED TO\'\n         LINE 362: ADD AT THE END OF PARAGRAPH \'FOR STS OPERATIONS WITH\n         DPP PRODUCTS AND FOR ALL STS OPERATIONS IN DANISH WATERS STS\n         VESSELS MUST BE DOUBLE HULL. IN EVENT OF STS OFF THE COAST OF\n         USA, CHARTERERS WARRANT TO EMPLOY ONLY LIGHTERS\/BARGES OR MEANS\n         OF TRANSPORTATION FULFILLING ALL REQUIREMENTS UNDER OPA 90.\'\n         LINE 375: AFTER \'AS DEMURRAGE\' INSERT \'HOWEVER IF ADVERSE\n         WEATHER AND\/OR ADVERSE SEA STATE CONDITIONS AFFECT THE IN-PORT\n         TRANSFER THEN TIME TO COUNT IN FULL AS LAYTIME OR DEMURRAGE IN\n         ON DEMURRAGE\'\n         LINE 387: AFTER \'CLAUSE 18.1\' INSERT \'AND THE REFERENCE TO\n         ADVERSE WEATHER IN CLAUSE 17\'\n         LINE 416: AFTER \'UNDER\' INSERT \'CLAUSE 17 AND\' AND INSERT\n         \'CLAUSE\'\n         LINE 419: INSERT AT THE END \'TIME TO COUNT IN FULL WEATHER\n         AND\/OR CONDITIONS PERMITTING OR NOT\'\n \nCLAUSE 9 DOCUMENTATION\n         LINE 426: BEFORE \'LOSS\' INSERT \'PROVEN\'\n \nCLAUSE 12 INERT GAS SYSTEM (\'IGS\')\n         LINE 480: AFTER \'DEMURRAGE\' INSERT \'CHARTERERS SHALL REIMBURSE\n         OWNERS FOR ANY BUNKERS USED IN CONNECTION WITH THIS OPERATION\n         UPON RECEIPT OF OWNERS INVOICE WITH FULL SUPPORTING DOCUMENTATION\'\n \nCLAUSE 14 OILY RESIDUES\/CLEAN BALLAST\n         LINE 511: ADD AT THE END \'IF OBTAINABLE\'\n         LINE 523: DELETE \'CHARTERERS INSTRUCT\'\n         LINE 524: DELETE \'TO\'\n \nCLAUSE 15 AGENCY\n         LINE 540: AFTER \'DISCHARGE PORTS\' INSERT \'ALWAYS PROVIDED COMPETITIVE\'\n \nCLAUSE 16 CANCELLATION\n         LINE 562: EXERCISABLE WITHIN TWENTY-FOUR (24) HOURS (SATURDAYS,\n         SUNDAYS AND HOLIDAYS EXCEPTED) ALWAYS INCLUDING ONE LONDON\n         WORKING DAY OF\n         LINE 569: DELETE \'TIMEOUSLY\' INSERT \'WITHIN ONE LONDON WORKING DAY\'\n         LINE 572: HOURS (SATURDAYS, SUNDAYS AND HOLIDAYS EXCEPTED)\n         AFTER THE PERIOD ALLOWED FOR OWNERS\'\n         LINE 578: ADD AT THE END \'ABOVE PROVIDED IS DUE TO OWNERS\n         PROVEN NEGLIGENCE\'\n         LINE 579-586: DELETE IN FULL\n \nCLAUSE 17 HALF LAYTIME\/HALF DEMURRAGE\/FORCE MAJEURE\n         LINE 589: AFTER \'SEA-STATE CONDITIONS\' INSERT \'EXCEPT OTHERWISE\n         SPECIFIED IN THE WEATHER CLAUSE\'\n \nCLAUSE 18 SUSPENSION OF LAYTIME\/DEMURRAGE\n         LINE 600: DELETE \'INCLUDING DAYLIGHT, TIDE\' AND INSERT IT IN CLAUSE,\n         LINE 588 AFTER \'ARISING FROM\'\n         LINE 613: DELETE \'AS A RESULT, WHETHER DIRECTLY OR INDIRECTLY,\'\n         AND INSERT \'AS A DIRECT RESULT\'\n         LINE 621: IN, OR IN CONNECTION WITH, THE BUNKERING AND\/OR THE\n         DISCHARGING OF SLOPS, UNLESS BUNKERING AND\/OR THE\n \nCLAUSE 19 LOADING AND DISCHARGE OF CARGO\n         LINE 649-650: DELETE AS FROM \'MASTER MAY REQUIRE\' TILL END OF\n         SENTENCE AND INSERT \'THE CONNECTION\/DISCONNECTION MAY BE DONE\n         WITH THE ASSISTANCE OF THE CREW BUT ALWAYS UNDER THE\n         SUPERVISION AND APPROVAL OF THE SHORE PERSONNEL ONLY\'\n         LINE 652: INSERT \'BE CAPABLE OF\' AFTER \'VESSEL SHALL\'; CHANGE\n         \'LOAD\' TO \'LOADING\' ; INSERT \'HOMOGENEOUS\' AFTER \'LOADING\'\n         LINE 654: (24) HOURS OR 1\/3 OF TOTAL LAYTIME WHICHEVER IS LESS,\n         PRORATA\n         LINE 659: DELETE \'GRADES\/PARCELS DISCHARGED CONCURRENTLY OR\n         CONSECUTIVELY\'\n         LINE 660: (24) HOURS OR 1\/3 OF TOTAL LAYTIME WHICHEVER IS LESS,\n         PRO RATA ; AFTER \'FULL\' INSERT \'HOMOGENEOUS\'\n         LINE 661: DELETE \'A MINIMUM\' INSERT \'AN AVERAGE\'\n         LINE 673: DELETE \'A MINIMUM\' INSERT \'AN AVERAGE\'\n         LINE 674: AFTER \'MANIFOLD\' INSERT \'EXCLUDING STRIPPING OPERATIONS\'\n         LINE 720: AFTER \'REPRESENTATIVE\' INSERT \'PROVIDED SAME IS OBTAINABLE\'\n \nCLAUSE 20 CLAIMS TIME BAR\n         ADD ON TOP OF CLAUSE: \'THIS CLAUSE DOES NOT APPLY TO CLAIMS\n         UNDER BILLS OF LADING\' AT END OF CLAUSE, INSERT 20.3: CLAIMS\n         ARISING UNDER CLAUSE\n         20.1 AND\/OR 20.2 AND ANY OTHER CLAIM AGAINST CHARTERERS SHALL BE\n         EXTINGUISHED AND CHARTERERS SHALL BE DISCHARGED FROM ALL\n         LIABILITY WHATSOEVER IRRESPECT THEREOF UNLESS PROCEEDINGS HAVE\n         BEEN COMMENCED IN RESPECT OF SUCH CLAIM IN THE RELEVANT FORUM\n         WITHIN EIGHTEEN (18) MONTHS OF THE DATE OF ACCRUAL OF THE CAUSE\n         OF ACTION.\n \nCLAUSE 23 VESSEL\/CARGO INSPECTIONS\/BUNKER SURVEYS\n         LINE 873: AFTER \'COMPENSATED\' INSERT \'AT DEMURRAGE RATE\'\n \nCLAUSE 24 MAINTENANCE OF CARGO TEMPERATURE\n         LINE 880: OF THE CARGO UP TO A MAXIMUM OF 135°F 60°C. OWNERS\n         UNDERTAKE THAT THE VESSEL IS CAPABLE\n         LINE 881: OF MAINTAINING THE CARGO TEMPERATURE UP TO 135°F 60°C\n         THROUGHOUT THE LADEN VOYAGE AND\n \nCLAUSE 25 CARGO HEATING\n         DELETE LINES 895 TO 907\n \nCLAUSE 26 LIBERTY\n         LINE 918: INSERT AT THE END \'SUCH AGREEMENT NOT TO BE\n         UNREASONABLY WITHHELD BY CHARTERERS\'\n \nCLAUSE 28\n         DELETE IN FULL\n \nCLAUSE 30.3 BP INDEMNITY CLAUSE\n         DELETE ORIGINAL\/INSERT:\n         IF AN ORIGINAL BILL OF LADING IS NOT AVAILABLE AT ANY DISCHARGE\n         PORT TO WHICH THE VESSEL MAY BE ORDERED BY CHARTERERS UNDER\n         THIS CHARTER, OR IF CHARTERERS REQUIRE OWNERS TO DELIVER CARGO\n         TO A PARTY OR AT A PORT OTHER THAN AS SET OUT IN THE BILL OF\n         LADING, THEN OWNERS SHALL NEVERTHELESS DISCHARGE SUCH CARGO IN\n         COMPLIANCE WITH CHARTERERS\' INSTRUCTIONS, UPON PRESENTATION BY\n         THE CONSIGNEE NOMINATED BY CHARTERERS (\'THE RECEIVER\') OF\n         REASONABLE IDENTIFICATION TO THE MASTER AND IN CONSIDERATION OF\n         CHARTERERS INDEMNIFYING OWNERS AS PER OWNERS P&I CLUB WORDING\n         WHICH ARE HERE BELOW PRINTED IN APPENDIX TWO.\n \nCLAUSE 31 FREIGHT RATE\n         LINE 1077: 31.4 FREIGHT SHALL BE PAYABLE LATEST THE FIRST\n         WORKING DAY AFTER COMPLETION OF DISCHARGE, ON THE\n \nFOLLOWING PARAGRAPH N\/A THIS VOYAGE: \nLINE 1086: THEREOF, TO THE VOYAGE TO BE PERFORMED UNDER THIS CHARTER. OWNERS \nARE TO PROVIDE AN ROB CERTIFICATE, EVIDENCE OF PRICE PAID FOR BUNKERS AND \nMASTER\'S CALCULATION OF ADDITIONAL BUNKERS USED WITH FREIGHT INVOICES.\n \n         LINE 1088: 31.6 IF OWNERS INCREASE THE SPEED OF THE VESSEL IN\n         ACCORDANCE WITH CHARTERER\'S VOYAGE ORDERS, CHARTERERS SHALL\n         REIMBURSE OWNERS FOR ADDITIONAL BUNKERS CONSUMED AT ACTUAL\n         COSTS WITH PROPER SUPPORTING DOCUMENTS.\n \nCLAUSE 32 ADDRESS COMMISSION\n         LINE 1090: CHARTERERS SHALL DEDUCT 2.5% ADDRESS COMMISSION FROM\n         FREIGHT (INCLUDING FIXED AND\n         LINE 1091: VARIABLE FREIGHT DIFFERENTIALS), AND ANY DEAD\n         FREIGHT, DEMURRAGE, HIRE (STORAGE\/DEVIATION EXCEPT ON BUNKERS\n         REIMBURSEMENT)\n \nCLAUSE 33 CARGO RETENTION\n         LINE 1096: AFTER \'LIQUID\' INSERT \'PUMPABLE AND REACHABLE BY\n         VESSEL FIXED PUMPS\'\n         LINE 1097: AS ABOVE\n         LINE 1099: DELETE \'DEDUCT\' INSERT \'CLAIM\'\n         LINE 1119: DELETE \'DEDUCTED\' INSERT \'CLAIMED\'\n         LINE 1124: AS ABOVE\n \nCLAUSE 35 CARGO INSURANCE\n         DELETE IN FULL\n \nCLAUSE 36 BP UNIQUE IDENTIFIER AND US BUREAU OF CUSTOMS AND BORDER\n         PROTECTION DELETE ORIGINAL\/INSERT:\n         (A) IF THE VESSEL LOADS OR CARRIES CARGO DESTINED FOR THE US OR\n         PASSING THROUGH US PORTS IN TRANSIT, THE OWNERS SHALL COMPLY\n         WITH THE CURRENT US CUSTOMS REGULATIONS (19 CFR 4.7 AND 178) OR\n         ANY SUBSEQUENT AMENDMENTS THERETO AND SHALL (UNLESS CHARTERERS\n         REQUEST OTHERWISE) UNDERTAKE THE ROLE OF CARRIER FOR THE\n         PURPOSES OF SUCH REGULATIONS AND SHALL:\n \n         (I) HAVE IN PLACE A SCAC (STANDARD CARRIER ALPHA CODE) AND\n         INSERT THE SAME ON EACH BILL OF LADING;\n \n         (II) HAVE IN PLACE AN ICB (INTERNATIONAL CARRIER BOND);\n \n         (III) SUBMIT CARGO DECLARATIONS BY AMS (AUTOMATED MANIFEST\n         SYSTEM) TO THE US CUSTOMS; AND\n \n         (IV) PROVIDE CHARTERERS AND AGENTS ON REQUEST WITH DETAILS OF\n         THE UNIQUE IDENTIFIER IN RESPECT OF ALL CARGO CARRIED\n \n         (B) THE CHARTERERS SHALL PROVIDE ALL NECESSARY INFORMATION TO\n         THE OWNERS AND\/OR THEIR AGENTS TO ENABLE THE OWNERS TO SUBMIT A\n         TIMELY AND ACCURATE CARGO DECLARATION.\n \n         (C) OWNERS WARRANT THAT THEY ARE AWARE OF THE US BUREAU OF\n         CUSTOMS AND BORDER PROTECTION REGULATIONS FOR ENTERING US PORTS\n         (THE \'CBP REGULATIONS\'), INCLUDING BUT NOT LIMITED TO THOSE\n         REGULATIONS ISSUED ON DECEMBER 5TH UNDER FEDERAL REGISTER PART\n         II DEPARTMENT OF HOMELAND SECURITY 19 CFR PARTS 4, 103, ET AL,\n         AND OWNERS FURTHER WARRANT THAT THEY WILL COMPLY FULLY WITH THE\n         CBP REGULATIONS.\n \n         (D) THE OWNERS SHALL ASSUME LIABILITY FOR AND SHALL INDEMNIFY,\n         DEFEND AND HOLD HARMLESS THE CHARTERERS AGAINST ANY PROVEN LOSS\n         AND\/OR DAMAGE AND ANY PROVEN EXPENSES, FINES, PENALTIES AND ANY\n         OTHER CLAIMS, INCLUDING BUT NOT LIMITED TO LEGAL COSTS, ARISING\n         FROM THE OWNERS\' FAILURE TO COMPLY WITH ANY OF THE PROVISIONS\n         OF SUB-CLAUSE (A) OR FAILURE TO COMPLY WITH THE\n         CBP REGULATIONS, PROVIDED ALWAYS THAT CHARTERERS HAVE, WITHIN A\n         REASONABLE PERIOD AFTER BEING REQUESTED BY OWNERS, PROVIDED\n         THEM WITH SUCH INFORMATION AS IS REASONABLY REQUIRED TO ENABLE\n         THEM TO COMPLY WITH THE CBP REGULATIONS.\n         SHOULD SUCH FAILURE RESULT IN ANY DELAY THEN, NOTWITHSTANDING\n         ANY PROVISION IN THIS CHARTER PARTY TO THE CONTRARY, THE PERIOD\n         OF SUCH DELAY SHALL NOT COUNT AS LAYTIME OR, IF THE VESSEL IS\n         ON DEMURRAGE, AS DEMURRAGE.\n \n         (E) THE ASSUMPTION OF THE ROLE OF CARRIER BY THE OWNERS\n         PURSUANT TO THIS CLAUSE AND FOR THE PURPOSE OF THE US CUSTOMS\n         REGULATIONS (19 CFR 4.7) SHALL BE WITHOUT PREJUDICE TO THE\n         IDENTITY OF CARRIER UNDER ANY BILL OF LADING, OTHER CONTRACT,\n         LAW OR REGULATION.\n \nCLAUSE 38 EXCEPTIONS\n         LINE 1183: INSERT \'NEITHER OWNERS NOR\' BEFORE \'CHARTERERS;\n         DELETE \'NOT\' LINE 1188: DELETE AT THE END \'.\' AND INSERT\n         \', REQUISITION, PERIL OF THE SEA, ACT OF PUBLIC ENEMY\'S OR\n         ASSAILING THIEVES.\'\n \nCLAUSE 39 WAR RISKS\n         LINE 1296: ADD AT THE END OF CLAUSE \'ANY ADDITIONAL WAR RISK\n         PREMIUMS AND\/OR CREW WAR BONUSES TO BE FOR CHARTERERS ACCOUNT\n         BUT QUOTATION SHALL BE SUBMITTED BY OWNERS TO CHARTERERS BEFORE\n         INVOICING.\'\n \nCLAUSE 44 OIL POLLUTION INSURANCE\n         DELETE ORIGINAL\/INSERT:\n         OWNERS WARRANT THAT THEY HAVE, AND SHALL MAINTAIN IN FORCE\n         THROUGHOUT THE PERIOD OF THIS CHARTER, THE STANDARD OIL\n         POLLUTION INSURANCE COVER (CURRENTLY US$1,000 MILLION)\n         AVAILABLE, FROM TIME TO TIME, FROM THEIR PROTECTION AND\n         INDEMNITY CLUB.\n \nCLAUSE 45.1.2 OIL POLLUTION PREVENTION\n         DELETE ORIGINAL PART 45.1.2\/INSERT:\n         IS ENTERED IN THE P & I CLUB STATED IN THE Q88 LAST COMPLETED\n         BY OR ON BEHALF OF OWNERS AND WILL SO REMAIN UNLESS OWNERS HAVE\n         GIVEN CHARTERERS PRIOR WRITTEN NOTICE OF THEIR INTENTION TO\n         CHANGE. OWNERS WARRANT THAT THE VESSEL WILL ONLY BE ENTERED IN\n         A P & I CLUB WITHIN THE INTERNATIONAL GROUP OF P & I CLUBS.\n \nCLAUSE 47 SUB-LETTING\n         LINE 1419: AT THE END INSERT \'ALWAYS WITH OWNERS PRIOR CONSENT\n         WHICH SHALL NOT BE UNREASONABLY WITHHELD\'\n \nCLAUSE 49 LAW\n         LINE 1440: DISPUTE WHICH MAY ARISE OUT OF THIS CHARTER, SAVE AS\n         HEREINAFTER PROVIDED. ANY DISPUTE ARISING OUT OF THIS CHARTER\n         OF LESS THAN USD ,000 SHALL BE REFERRED TO A SINGLE ARBITRATOR\n         IN LONDON, SUBJECT TO THE LMAA SMALL CLAIMS PROCEDURE.\n \n \nBLA-BLA-BLA\'S VOYAGE CHARTERING TERMS EFFECTIVE BLA-BLA-BLA, 2001\n=============================================\n \nADDITIONAL CLAUSES TO BPVOY 4\n-----------------------------\n1. BP ISPS CLAUSE FOR VOYAGE CHARTER PARTIES\n   (A) (I) THE OWNERS SHALL PROCURE THAT BOTH THE VESSEL AND \'THE\n    COMPANY\' (AS DEFINED BY THE INTERNATIONAL CODE FOR THE SECURITY OF\n    SHIPS AND OF PORT FACILITIES AND THE RELEVANT AMENDMENTS TO CHAPTER\n    XI OF SOLAS (ISPS CODE)) AND THE \'OWNER\' (AS DEFINED BY THE US\n    MARITIME TRANSPORTATION SECURITY ACT 2002 (MTSA)) SHALL COMPLY WITH\n    THE REQUIREMENTS OF THE ISPS CODE RELATING TO THE VESSEL AND \'THE\n    COMPANY\' AND THE REQUIREMENTS OF THE MTSA, IF APPLICABLE,\n    RELATING TO THE VESSEL AND THE \'OWNER\'. UPON REQUEST THE OWNERS\n    SHALL PROVIDE A COPY OF THE RELEVANT INTERNATIONAL SHIP SECURITY\n    CERTIFICATE (OR THE INTERIM INTERNATIONAL SHIP SECURITY\n    CERTIFICATE) TO THE CHARTERERS. THE OWNERS SHALL PROVIDE THE\n    CHARTERERS WITH THE FULL STYLE CONTACT DETAILS OF THE COMPANY\n    SECURITY OFFICER (CSO). (II) EXCEPT AS OTHERWISE PROVIDED IN THIS\n    CHARTER PARTY, LOSS, DAMAGE, EXPENSE OR DELAY, EXCLUDING\n    CONSEQUENTIAL LOSS, CAUSED BY FAILURE ON THE PART OF THE OWNERS\n    OR \'THE COMPANY\' TO COMPLY WITH THE REQUIREMENTS OF THE ISPS CODE\n    OR THE MTSA, IF APPLICABLE, OR THIS CLAUSE SHALL BE FOR THE OWNERS\'\n    ACCOUNT.\n \n   (B) (I) THE CHARTERERS SHALL PROVIDE THE OWNER WITH THEIR FULL STYLE\n   CONTACT DETAILS AND ANY OTHER INFORMATION THE OWNERS REQUIRE TO\n   COMPLY WITH THE ISPS CODE AND THE MTSA, IF APPLICABLE. ADDITIONALLY,\n   CHARTERERS SHALL ENSURE THAT THE CONTACT DETAILS OF ANY\n   SUB-CHARTERERS ARE LIKEWISE PROVIDED AND THAT ALL SUB-CHARTERS THEY\n   ENTER INTO CONTAIN THE FOLLOWING PROVISION:\n   \'THE CHARTERERS SHALL PROVIDE OWNERS WITH THEIR FULL STYLE CONTACT\n   DETAILS AND, WHERE SUB-CHARTERING IS PERMITTED UNDER THE TERMS OF THE\n   CHARTER PARTY, SHALL ENSURE THAT CONTACT DETAILS OF ALL\n   SUB-CHARTERERS ARE LIKEWISE PROVIDED TO OWNERS.\'\n   (II) EXCEPT AS OTHERWISE PROVIDED IN THIS CHARTER PARTY, LOSS,\n   DAMAGE, EXPENSE, EXCLUDING CONSEQUENTIAL LOSS, CAUSED BY FAILURE ON\n   THE PART OF THE CHARTERERS TO COMPLY WITH THIS SUB-CLAUSE (B) SHALL\n   BE FOR THE CHARTERERS\' ACCOUNT AND ANY DELAY CAUSED BY SUCH FAILURE\n   SHALL BE COMPENSATED AT THE DEMURRAGE RATE.\n \n   (C) (I) WITHOUT PREJUDICE TO THE FOREGOING, OWNERS\' RIGHT TO TENDER\n   NOTICE OF READINESS AND CHARTERERS\' LIABILITY FOR DEMURRAGE IN\n   RESPECT OF ANY TIME DELAYS CAUSED BY BREACHES OF THIS CLAUSE SHALL\n   BE DEALT WITH IN ACCORDANCE WITH CLAUSES 6 (NOTICE OF READINESS), 7\n   (LAYTIME\/DEMURRAGE) AND 18 (SUSPENSION OF LAYTIME\/DEMURRAGE), OF THE\n   CHARTER.\n   (II) EXCEPT WHERE THE DELAY IS CAUSED BY OWNERS\' AND\/OR CHARTERERS\'\n   FAILURE TO COMPLY WITH SUB-CLAUSES (A) AND (B) RESPECTIVELY OF THIS\n   CLAUSE, THEN ANY DELAY ARISING OR RESULTING FROM MEASURES IMPOSED BY\n   A PORT FACILITY OR BY ANY RELEVANT AUTHORITY, UNDER THE ISPS\n   CODE\/MTSA, SHALL COUNT AS HALF LAYTIME, OR, IF THE VESSEL IS ON\n   DEMURRAGE, HALF RATE DEMURRAGE.\n \n   (D) ANY COSTS OR EXPENSES RELATED TO SECURITY REGULATIONS OR MEASURES\n   REQUIRED BY THE PORT FACILITY OR ANY RELEVANT AUTHORITY IN ACCORDANCE\n   WITH THE ISPS CODE\/MTSA INCLUDING, BUT NOT LIMITED TO, SECURITY\n   GUARDS, LAUNCH SERVICES, TUG ESCORTS, PORT SECURITY FEES OR TAXES AND\n   INSPECTIONS, SHALL BE SHARED EQUALLY BETWEEN OWNERS AND CHARTERERS,\n   EXCEPT WHERE:-\n   SUCH COSTS OR EXPENSES ARE IMPOSED AS A RESULT OF OWNERS\' OR\n   CHARTERERS\' FAILURE TO COMPLY WITH SUB-CLAUSES (A) AND (B)\n   RESPECTIVELY OF THIS CLAUSE; OR IF FREIGHT FOR THE VOYAGE IS BASED ON\n   WORDSCALE, SUCH COSTS OR EXPENSES ARE INCLUDED BY WORLDSCALE IN\n   THEIR FREIGHT CALCULATION (IN WHICH CASE SUCH COSTS OR EXPENSES SHALL\n   BE FOR OWNERS\' ACCOUNT).\n   ALL MEASURES REQUIRED BY THE OWNERS TO COMPLY WITH THE SHIP SECURITY\n   PLAN SHALL BE FOR OWNERS\' ACCOUNT.\n \n   (E) IF EITHER PARTY MAKES ANY PAYMENT WHICH IS FOR THE OTHER PARTY\'S\n   ACCOUNT ACCORDING TO THIS CLAUSE, THE OTHER PARTY SHALL INDEMNIFY THE\n   PAYING PARTY.\n \n   (F) (I) [OTHER THAN CALLING AT ON ] OWNERS WARRANT THAT ALL OF THE\n   PREVIOUS  TEN PORTS AT WHICH THE VESSEL HAS CALLED, OR WILL HAVE\n   CALLED, PRIOR TO TENDERING NOTICE OF READINESS AT THE FIRST LOAD PORT\n   HEREUNDER:\n   (AA) HAD AN APPROVED SECURITY PLAN; AND\n   (BB) WERE (AND REMAIN) REGISTERED WITH THE IMO AS ISPS COMPLIANT\n        PORTS; AND\n   (CC) HAD A SECURITY LEVEL NO HIGHER THAN LEVEL 1 (NORMAL) OR\n   MARSECLEVEL 1; AND\n   (DD) WERE NOT, NOR HAVE SUBSEQUENTLY BEEN, DEEMED UNACCEPTABLE BY THE\n    US AUTHORITIES UNDER THEIR SECURITY REGIME.\n   (II) OWNERS FURTHER WARRANT THAT, OTHER THAN AS EXPRESSLY DISCLOSED\n   TO CHARTERERS IN WRITING, THE VESSEL HAS NOT LOADED GOODS OR SUPPLIES\n   (NOR EMBARKED ANY INDIVIDUALS) FROM, NOR ENGAGED IN ANY SHIP TO SHIP\n   TRANSFER OF CARGO WITH, ANOTHER VESSEL.\n   (III) EXCEPT AS OTHERWISE PROVIDED IN THIS CHARTER PARTY, LOSS,\n   DAMAGE, EXPENSE OR DELAY CAUSED BY BREACH BY OWNERS OF THE WARRANTIES\n   CONTAINED IN THIS SUB-CLAUSE (F) SHALL BE FOR THE OWNERS\' ACCOUNT.\n \n2. BP ISM CLAUSE\n   (A) OWNERS UNDERTAKE THAT FOR THE DURATION OF THIS CHARTER, THE\n   VESSEL AND \'THE COMPANY\' (AS DEFINED IN THE INTERNATIONAL MANAGEMENT\n   CODE FOR THE SAFE OPERATION OF SHIPS AND FOR POLLUTION PREVENTION\n   (THE INTERNATIONAL SAFETY MANAGEMENT (ISM) CODE) (THE \'ISM CODE\'))\n   SHALL COMPLY WITH THE REQUIREMENTS OF THE ISM CODE. CHARTERERS MAY AT\n   ANY TIME REQUEST AN INSPECTION OF THE RELEVANT DOCUMENT OF COMPLIANCE\n   AND\/OR SAFETY MANAGEMENT CERTIFICATE, AND UPON RECEIPT OF SUCH A\n   REQUEST OWNERS SHALL FORTHWITH PROVIDE THE SAME.\n   (B) WITHOUT PREJUDICE TO ANY RIGHTS OR REMEDIES AVAILABLE TO\n   CHARTERERS UNDER THE TERMS OF THIS CHARTER OR UNDER THE LAW\n   APPLICABLE HERETO, IN THE EVENT OF A BREACH OF THE ABOVE UNDERTAKING\n   ANY LOSS, DAMAGE, EXPENSE OR DELAY FOLLOWING THEREFROM SHALL BE FOR\n   OWNERS\' ACCOUNT.\n \n3. BP REGULATORY AND GUIDELINE COMPLIANCE CLAUSE\n   THROUGHOUT THE PERIOD OF THIS CHARTER, THE OWNERS AND THE VESSEL\n   SHALL COMPLY WITH ALL RELEVANT REGULATIONS AND GUIDELINES ISSUED BY\n   THE IMO AND OCIMF AND, IN THE CASE OF A VESSEL CARRYING LPG OR LNG,\n   WITH THE RECOMMENDATIONS AND GUIDELINES ISSUED FROM TIME TO TIME BY\n   SIGTTO. IN ADDITION, ALL OPERATIONS SHALL BE CARRIED OUT IN\n   ACCORDANCE WITH THE LATEST EDITION OF ISGOTT, AND ANY AMENDMENTS OR\n   UPDATES THERETO WHICH MAY BE ISSUED FROM TIME TO TIME.\n \n4. ELIGIBILITY\n   OWNER WARRANTS THAT THE VESSEL IS IN ALL RESPECTS ELIGIBLE EXCEPT FOR\n   HER PHYSICAL CHARACTERISTICS FOR TRADING WITHIN, TO AND FROM RANGES\n   AND AREAS SPECIFIED IN CHARTER PARTY, AND THAT AT ALL TIMES SHE SHALL\n   HAVE ON BOARD ALL CERTIFICATES, RECORDS AND OTHER DOCUMENTS REQUIRED\n   FOR SUCH SERVICE.\n \n   IN THE EVENT THAT THE VESSEL IS FOUND, AT ANY TIME, NOT TO BE\n   ELIGIBLE AS WARRANTED, CHARTERERS SHALL HAVE THE RIGHT TO CANCEL\n   SUBJECT CHARTER PARTY AS WELL AS TO HAVE RECOURSE TO OWNERS FOR ANY\n   AND ALL DAMAGES, DEMURRAGE, EXPENSES AND LOSSES RELATED TO SUCH\n   CANCELLATION.\n \n5. BP OIL POLLUTION INSURANCE CERTIFICATION AND COFR\'S CLAUSE\n   THE VESSEL SHALL HAVE ON BOARD ALL CERTIFICATES OF FINANCIAL\n   RESPONSIBILITY (\'COFRS\') IN RESPECT TO OIL POLLUTION NECESSARY FOR\n   THE REQUIRED TRADE WITHIN THE AGREED TRADING LIMITS, INCLUDING BUT\n   NOT LIMITED TO:\n   (A) THE CERTIFICATE OF INSURANCE REQUIRED UNDER THE INTERNATIONAL\n   CONVENTION ON CIVIL LIABILITY FOR OIL POLLUTION DAMAGE AND THE\n   PROTOCOLS THERETO; AND\n   (B) THE CERTIFICATE OF INSURANCE REQUIRED UNDER THE INTERNATIONAL\n   CONVENTION ON CIVIL LIABILITY FOR BUNKER OIL POLLUTION 2001;\n   AND\n   (C) UNITED STATES COAST GUARD CERTIFICATE OF FINANCIAL RESPONSIBILITY\n   MEETING  THE REQUIREMENTS OF THE UNITED STATES FEDERAL OIL POLLUTION\n   ACT 1990 (\'OPA 90\').\n \n6. BP ITWF CLAUSE\n   OWNERS UNDERTAKE TO ENSURE THAT THE TERMS OF EMPLOYMENT OF THE\n   VESSEL\'S MASTER,  OFFICERS AND CREW SHALL ALWAYS REMAIN ACCEPTABLE TO\n   THE INTERNATIONAL TRANSPORT WORKER\'S FEDERATION (\'ITWF\')AND THE\n   VESSEL WILL AT ALL TIMES CARRY AN ITWF BLUE CARD OR EQUIVALENT\n   CERTIFICATION ACCEPTABLE TO ITWF.\n \n7. BALLAST WATER MANAGEMENT CLAUSE\n   VESSEL TO ARRIVE AT EACH LOADING PORT WITH CLEAN BALLAST, FREE OF\n   SLOPS AND TANK WASHINGS. VESSEL IS TO BE ABLE TO BALLAST \/ DEBALLAST\n   SIMULTANEOUSLY WITH LOADING \/ DISCHARGING.\n   OWNERS ADDITIONALLY WARRANTS THE VESSEL WILL COMPLY WITH ALL\n   MANDATORY BALLAST WATER REQUIREMENTS. THE OWNERS SHALL ASSUME\n   LIABILITY FOR AND SHALL INDEMNIFY, DEFEND AND HOLD HARMLESS THE\n   CHARTERERS AGAINST ANY LOSS AND\/OR DAMAGE (EXCLUDING CONSEQUENTIAL\n   LOSS AND\/OR DAMAGE) AND ANY EXPENSES, FINES, PENALTIES AND ANY OTHER\n   CLAIMS, INCLUDING BUT NOT LIMITED TO LEGAL COSTS, ARISING FROM THE\n   OWNERS\' FAILURE TO COMPLY WITH ANY SUCH PROVISIONS. SHOULD SUCH\n   FAILURE RESULT IN ANY DELAY THEN, NOTWITHSTANDING ANY PROVISION IN\n   THIS CHARTER PARTY TO THE CONTRARY, THE PERIOD OF SUCH DELAY SHALL\n   NOT COUNT AS LAYTIME OR, IF THE VESSEL IS ON DEMURRAGE, AS DEMURRAGE.\n \n8. BP TOPIA 2006 CLAUSE (ISSUED NOVEMBER 2006)\n   OWNERS WARRANT THAT THEY ARE A PARTICIPATING OWNER (AS DEFINED IN THE\n   TANKER OIL POLLUTION INDEMNIFICATION AGREEMENT 2006 (TOPIA 2006)) AND\n   THAT THE VESSEL IS ENTERED IN TOPIA 2006 AND SHALL SO REMAIN\n   THROUGHOUT THE PERIOD OF THIS CHARTER, PROVIDED ALWAYS THAT:-\n   I) THE VESSEL IS AND REMAINS A RELEVANT SHIP AS DEFINED IN CL.III OF\n   TOPIA 2006; AND\n   II) TOPIA 2006 IS NOT TERMINATED IN ACCORDANCE WITH CL.IX OF\n   THAT AGREEMENT.\n \n9. BP STOPIA 2006 CLAUSE (ISSUED NOVEMBER 2006)\n   IF THE VESSEL HAS A GROSS REGISTERED TONNAGE OF 29,548 OR LESS OWNERS\n   WARRANT THAT THEY ARE A PARTICIPATING OWNER (AS DEFINED IN THE SMALL\n   TANKER OIL POLLUTION INDEMNIFICATION AGREEMENT 2006 (STOPIA 2006))\n   AND THAT THE VESSEL IS ENTERED IN STOPIA 2006 AND SHALL SO REMAIN\n   THROUGHOUT THE PERIOD OF THIS CHARTER, PROVIDED ALWAYS THAT:-\n   I) THE VESSEL IS AND REMAINS A RELEVANT SHIP AS DEFINED IN CL. III OF\n   STOPIA 2006; AND\n   II) STOPIA 2006 IS NOT TERMINATED IN ACCORDANCE WITH CL. IX OF THAT\n   AGREEMENT.\n \n10.FUEL SULPHUR CONTENT CLAUSE\n   OWNERS CONFIRM THEY ARE AWARE OF THE MAXIMUM SULPHUR CONTENT\n   REQUIREMENTS OF ANY EMISSION CONTROL ZONE THE VESSEL MAY BE REQUIRED\n   TO ENTER DURING THE PERFORMANCE OF THIS CHARTER. OWNERS WARRANT THAT\n   OWNERS AND THE VESSEL SHALL COMPLY WITH ALL APPLICABLE REQUIREMENTS\n   OF ANY EMISSION CONTROL ZONE AND SHALL, WITHOUT LOSS OF TIME AND\/OR\n   DEVIATION, USE FUELS (WHICH TERM SHALL INCLUDE ALL HEAVY FUEL OILS,\n   MARINE GAS OILS AND MARINE DIESEL OILS AS APPLICABLE)\n   OF SUCH SPECIFICATIONS AND GRADES TO ENSURE COMPLIANCE WITH THESE\n   REQUIREMENTS.\n   FOR THE PURPOSE OF THIS CLAUSE, \'EMISSION CONTROL ZONE\' SHALL MEAN\n   AREAS AS STIPULATED IN MARPOL ANNEX VI INCLUDING EU DIRECTIVE\n   2005\/33\/EC AND\/OR ZONES AND\/OR AREAS REGULATED BY REGIONAL AND\/OR\n   NATIONAL AUTHORITIES SUCH AS, BUT NOT LIMITED TO, THE EU, THE US\n   ENVIRONMENTAL PROTECTION AGENCY AND THE CALIFORNIA ENVIRONMENTAL\n   PROTECTION AGENCY.\n   OWNERS SHALL INDEMNIFY, DEFEND AND HOLD CHARTERERS HARMLESS IN\n   RESPECT OF ANY DIRECT OR INDIRECT LOSS, LIABILITY, DELAY, FINES,\n   COSTS OR EXPENSES ARISING OR RESULTING FROM OWNERS\' FAILURE TO\n   COMPLY WITH THIS CLAUSE.\n \n11.INTERIM PORTS CLAUSE\n   PREVIOUS WORDING FULLY DELETED AND REPLACED BY:\n   TORM INTERIM PORT CLAUSE APPLICABLE FOR LUMPSUM FIXTURES\/LUMPSUM\n   FREIGHT :\n   CHARTERERS TO PAY FOR ADDITIONAL INTERIM LOAD PORT AT COST AS FOLL:\n   DEVIATION:\n   ACTUAL ADDITIONAL STEAMING TIME INCURRED AS PER MASTERS STATEMENT FOR\n   DEVIATION WHICH EXCEEDS DIRECT PASSAGE FROM FURTHEST LOADPORT TO\n   FINAL DISCHPORT AS PER BP\'S DISTANCE TABLE.\n   PORT TIME:\n   TIME TO COUNT IN FULL FROM ARRIVAL PILOT STATION INTERIM\n   LOAD\/DISCHARGE PORT UNTIL DROPPING LAST OUTWARD PILOT INTERIM\n   LOAD\/DISCHARGE PORT. NO DEDUCTION FOR SHIFTING EVEN FROM ANCHORAGE TO\n   FIRST BERTH AND NO DEDUCTION FOR TIME  LOST DUE TO TIDE, SEA AND\n   WEATHER CONDITIONS.\n   COST:\n   DEVIATION AND PORT TIME USED TO BE CALCULATED AT DEMURRAGE RATE PER\n   DAY PLUS COST FOR ALL BUNKERS CONSUMED DURING THE DEVIATION AS WELL\n   AS ALL BUNKERS USED IN PORT AS PER MASTERS TELEX\/E-MAIL STATEMENT.\n   PORT COSTS TO BE SETTLED DIRECTLY BY CHARTERERS UNLESS OTHERWISE\n   AGREED.\n   PAYMENT:\n   DEVIATION + TIME USED IN PORT (CHARTERERS TO HAVE THE BENEFIT OF ANY\n   UNUSED LAYTIME AT THE NON-INTERIM LOAD\/DISCHARGE PORTS AT THE INTERIM\n   LOAD\/DISCHARGE PORTS) + BUNKERS CONSUMED TO BE PAID TOGETHER WITH\n   FREIGHT IMMEDIATELY UPON COMPLETION OF DISCHARGE AS PER OWNERS\n   TELEXED\/E-MAILED INVOICE WITH SUPPORTING DOCUMENT, WHICH LATER TO BE\n   SUPPORTED BY HARD COPY DOCUMENTATION.\n \n12.UNSPECIFIED DELAY\n   ANY DELAYS FOR WHICH LAYTIME\/DEMURRAGE CONSEQUENCES ARE NOT\n   SPECIFICALLY ALLOCATED IN THIS OR ANY OTHER CLAUSE OF THIS CHARTER\n   AND WHICH ARE BEYOND THE REASONABLE CONTROL OF OWNER OR CHARTERER\n   SHALL COUNT AS LAYTIME OR, IF VESSEL IS ON DEMURRAGE, AS TIME ON\n   DEMURRAGE. IF DEMURRAGE IS INCURRED, ON ACCOUNT OF SUCH DELAYS, IT\n   SHALL BE PAID AT THE AGREED DEMURRAGE RATE.\n \n13.FORCE MAJEURE\n   NOTWITHSTANDING ANYTHING TO THE CONTRARY IN THIS CHARTERPARTY,\n   NEITHER THE OWNERS NOR THE CHARTERERS SHALL BE LIABLE FOR DAMAGES\n   FOR DELAY OR FOR ANY FAILURE TO PERFORM THEIR RESPECTIVE OBLIGATIONS\n   HEREUNDER IF THE DELAY OR FAILURE IS DUE TO FIRE, EXPLOSION,\n   LOCK-OUTS, STOPPAGE OR RESTRAINT OF LABOUR, FLOODS, ACT OF GOD, WAR,\n   TERRORIST ACTIVITY, CIVIL COMMOTION OR ANY OTHER CAUSE BEYOND THAT\n   PARTY\'S REASONABLE CONTROL. TIME LOST AS A RESULT OF ANY\n   OF THE AFOREMENTIONED CLAUSES SHALL COUNT AS HALF OF USED LAYTIME OR\n   HALF TIME ON DEMURRAGE.\n \n14.THIRD PARTY ARREST\n   IN THE EVENT OF ARREST OR OTHER SANCTION LEVIED AGAINST THE VESSEL OR\n   CHARTERER ARISING OUT OF OWNER\'S BREACH OR ANY FAULT OF OWNER, OWNER\n   SHALL INDEMNIFY CHARTERER FOR ANY DAMAGES, PENALTIES, COSTS AND\n   CONSEQUENCES AND ANY TIME VESSEL IS UNDER ARREST SHALL NOT COUNT AS\n   USED LAYTIME OR TIME ON DEMURRAGE.\n   IN THE EVENT OF ARREST\/DETENTION OR OTHER SANCTION LEVIED AGAINST THE\n   VESSEL THROUGH NO FAULT OF THE CHARTERERS, CHARTERER SHALL BE\n   ENTITLED, IN CHARTERERS OPTION, TO TERMINATE THE CHARTER.\n   TERMINATION OR FAILURE TO TERMINATE SHALL BE WITHOUT PREJUDICE TO\n   ANY CLAIM FOR DAMAGES CHARTERER MAY HAVE AGAINST OWNER.\n \n15.IN TRANSIT LOSS\n   IN ADDITION TO ANY OTHER RIGHTS WHICH CHARTERER MAY HAVE, OWNER WILL\n   BE RESPONSIBLE FOR THE FULL AMOUNT OF ANY IN-TRANSIT LOSS IF THE\n   IN-TRANSIT LOSS EXCEEDS 0.3% AND CHARTERER SHALL HAVE THE RIGHT TO\n   CLAIM FROM FREIGHT AN AMOUNT EQUAL TO THE FOB PORT OF LOADING VALUE\n   OF SUCH LOST CARGO PLUS FREIGHT AND INSURANCE DUE WITH RESPECT\n   THERETO. IN-TRANSIT LOSS IS DEFINED AS THE DIFFERENCE BETWEEN NET\n   VESSEL VOLUMES AFTER LOADING AT THE LOADING PORT AND BEFORE\n   UNLOADING AT THE DISCHARGE PORT, AS DETERMINED BY A MUTUALLY AGREED\n   INDEPENDENT INSPECTOR APPOINTED BY CHARTERERS OR RECEIVERS, WHOSE\n   DETERMINATION SHALL BE FINAL AND BINDING UPON BOTH PARTIES.\n \n16.DISCHARGE\/RELOAD CLAUSE\n   CHARTERER SHALL HAVE THE OPTION TO DISCHARGE AND\/OR COMINGLE AND\/OR\n   RELOAD AND\/OR TOP OFF ALL OR PART CARGO WITHIN THE LOAD\/DISCHARGE\n   RANGES.\n   IF EXERCISED, ANY ADDITIONAL COSTS IN CONNECTION WITH THE RELOAD\n   INCLUDING BUT NOT LIMITED TO CLEANING\/DEINERTING\/REINERTING IF ANY,\n   TO BE FOR CHARTERER\'S ACCOUNT AND ADDITIONAL TIME CONSUMED TO COUNT\n   AS USED LAYTIME. FOR WORLDSCALE PURPOSES, SAID DISCHARGE\/RELOAD PORT\n   TO COUNT AS A DISCHARGE PORT UNDER WORLDSCALE. ANY CREDITED LAYTIME\n   TO BE ADDED TO THIS CLAUSE.\n \n17.LOSS OF TURN AND DELAY\n   IF, AS A RESULT OF ANY BREACH OF THIS CHARTERPARTY OR ANY OTHER FAULT\n   ON THE PART OF THE OWNERS OR THE VESSEL, THE VESSEL LOSES ITS TURN TO\n   BERTH OR, BEING AT THE BERTH, HAS TO WAIT IDLE AT THE BERTH OR IS\n   SENT OFF THE BERTH  AND HAS TO WAIT FOR A FURTHER TURN, ALL TIME LOST\n  AS A RESULT OF HAVING TO WAIT FOR A BERTH SHALL BE FOR OWNERS ACCOUNT\n   AND SHALL NOT COUNT AS LAYTIME OR TIME ON DEMURRAGE.\n   ALL ADDITIONAL COSTS OF UNBERTHING AND REBERTHING AND ALL ADDITIONAL\n   BERTH FEES AND ANY OTHER EXTRA PROVEN EXPENSES SHALL LIKEWISE BE FOR\n   OWNERS\' ACCOUNT.\n   ALL OTHER TIME LOST BY REASON OF OWNERS\' BREACH OF ANY TERM OF THIS\n   CHARTERPARTY OR ANY OTHER FAULT ON THE PART OF THE OWNERS OF THE\n   VESSEL, SHALL NOT COUNT AS LAYTIME OR TIME ON DEMURRAGE. LAYTIME TO\n   RESUME ONCE VESSEL COMMENCES CARGO OPERATIONS PROVIDED THAT NOTHING\n   IN THIS CLAUSE WILL RENDER VALID ANY NOR THAT WOULD OTHERWISE HAVE\n   BEEN INVALID.\n \n18.PRIVATE AND CONFIDENTIAL CLAUSE\n   THE TERMS AND CONDITIONS OF THIS CHARTER PARTY AND ITS NEGOTIATIONS\n   TO BE KEPT STRICTLY PRIVATE AND CONFIDENTIAL AND SHALL NOT BE REPORTED.\n \n19.CHARTER PARTY ADMINISTRATION CLAUSE\n   CHARTER PARTY TERMS AND CONDITIONS ARE EVIDENCE BY THE FIXING\n   CONFIRMATION SENT BY THE BROKER. OWNER AND CHARTERER SHALL EACH\n   CONFIRM THEIR APPROVAL OF THE FIXING CONFIRMATION BY RETURN TO THE\n   BROKER AFTER LIFTING SUBJECTS. THE BROKER SHALL THEN CONFIRM RECEIPT\n   OF SAID CONFIRMATION TO BOTH PARTIES. EXCEPT AS REQUESTED IN WRITING\n   BY EITHER OWNERS OR CHARTERER, THERE SHALL BE NO FORMAL WRITTEN AND\n   SIGNED CHARTER PARTY.\n \n20.ADDITIVATION CLAUSE\n   CHARTERERS HAVE THE RIGHT TO ADD CARGO ADDITIVES (INCLUDING BUT NOT\n   LIMITED TO POUR POINT DEPRESSANT, ANTI-STATIC ADDITIVES, METALS\n   DEACTIVATORS AND H2 SCAVENGERS) AND MASTER TO EXECUTE THIS OPERATION\n   (THESE OPERATIONS) AS PER CHARTERERS INSTRCUTIONS SUBJECT TO SHIP\'S\n   SAFETY. HOWEVER OWNERS ARE NOT TO CARRY OUT REQUESTED OPERATION PRIOR\n   CHARTERES HAVE PROVIDED THEM WITH MSDS FOR HEADOWNERS ACCEPTANCE FOR\n   THE ADDITIVE AS WELL AS LOI AS PER OWNERS P&I CLUB WORDING.\n \nADDITIONAL CLAUSES\n------------------\n\netc.\netc.\netc.\n \nCOMMISSION: BLA-BLA-BLA PCT ADDCOMM, DEDUCTABLE + \n            BLA-BLA-BLA PCT TO BLA-BLA-BLA ON F\/DF\/DEM.\n\n--- END RECAP ---\n\nBEST REGARDS\nJOHN APPLESEED";
    
    _.myVarRecap = [ 'THIS IS AN EXAMPLE ONLY. TO RESET THIS TEXT BOX PRESS \'THIS IS RECAPULATR ==>\'\n\n\nPaste your recap here, it will highlight some important words like \'deduct\', \'risk\', \'freight\', \'chrtrs\', \'insert\', \'delete\', USD 1 000 000 PMT etc. etc. for a quick glance and brief reading.\n\nIf colors are distructing - you can switch it on\/off. Also you can switch between a few dark and bright themes and choose font size.\n\nLine numbering is added for easier ref.\n\nDISCLAIMER: ALL YOUR TEXT IS NOT SENT ANYWHERE, ALL TEXT ANALYSIS, A\/E COUNTERS ETC. ARE BEING DONE ON CLIENT SIDE - I.E. BY YOUR OWN PC IN YOUR OWN WEB-BROUSER WITHOUT SENDING ANYWGERE. AFTER THIS PAGE LOADING YOU CAN EVEN CUT YOUR INTERNET CABLE AND IT WILL KEEP WORKING.\n\n\n\n\n=======\nSTART::\n=======\n\nPLSD TO RECAP FOLL SUBFIXTURE\n\nSUBS STEM\/SHIPPERS\/RECIEVERS\/CHARTERERS TOP MANAGEMENT APPROVAL TO BE LIFTED LATEST BY TODAY BLA-BLA-BLA 2013 18:00 HRS GENEVA TIME\n\n==============================================================\nS T R I C T L Y  P R I V A T E  A N D  C O N F I D E N T I A L\n==============================================================\n                        (TITLE)\n \nCHARTERER: \nBLA-BLA-BLA\n\nREGISTERED OWNERS: \nBLA-BLA-BLA\n\nTECHNICAL OPERATOR: \nBLA-BLA-BLA\n\nDPA OWNERS SIDE: REVERTING\n\nCOMMERCIAL OPERATOR: \nBLA-BLA-BLA\n\nBROKER : \nBLA-BLA-BLA\n\nCP FORM: \nBP VOY 4\n \nCP DATE: \nON SUBS\n \n------------------------------------------------------------------\n                        (VESSEL)\n \nVESSEL              : BLA-BLA-BLA\nSDWT                : BLA-BLA-BLA\nSDRAFT              : BLA-BLA-BLA\nLOA                  : BLA-BLA-BLA\nBEAM                 : BLA-BLA-BLA\n\nLAST THREE CARGOES   : GASOIL \/ GASOIL \/ FUEL OIL\nLAST SIRE            : BLA-BLA-BLA\nTTBOOK               : BLA-BLA-BLA\n\nITINERARY            : BLA-BLA-BLA\n \n--------------------------------------------------------------------\n                           (CARGO)\n \nCARGO QUANTITY: CHOPT FULL CARGO \nGRADE(S): 1-2 GRADES GASOIL \/ ULSD UND 2.5 NPA \nHEAT: N\/A\nINTAKES: OWNERS WARRANT VESSELS\' MIN INTAKE IS BLA-BLA-BLA MTS GASOIL BASIS MIN SG 0.84 AT 15 DEG C.\n \n------------------------------------------------------------------------\n                          (GEOGRAPHICAL)\n \nLOADING  : 1 SPB BSEA\n \nDISCHARGE: 1 SPB USAC\/USG, OR IN CHOPT \n           1 SPB MED\n \n------------------------------------------------------------------------\n                          (FINANCIAL)\n \nFREIGHT:   USD BIZILLION LUMPSUM 1-1\n \nLAYCAN:    BLA-BLA-BLA 2013 00:01-23:59 \n \nLAYTIME:   72HRS TOTAL SHINC \n \nDEMURRAGE: USD BLA-BLA-BLA PDPR\n \nAGENTS:    CHARTERERS AGENTS BOTH ENDS PROVIDED COMPETITIVE\n \nSAMPLING CLAUSE\n---------------\nCHARTERERS HAVE THE OPTION TO PERFORM OPEN HATCH SAMPLING IF REQUIRED\nBUT ALWAYS SUBJECT TO HEAD OWNERS APPROVAL ON A CASE BY BASE BASIS.\nOPEN HATCH SAMPLING IS OK PROVIDED THAT PORT AUTHORITIES\/CHARTERERS\nAND LOAD\/DISCHARGE INSTALLATION ACCEPT SAME.\n \nSTS CLAUSE\n----------\nCHARTERERS HAVE THE OPTION TO DISCHARGE\/LOAD ALL CARGO VIA S-T-S AT A SAFE\nANCHORAGE\/PLACE. SUCH OPERATION TO BE ALWAYS SUBJECT\nTO MASTER\'S APPROVAL, WHICH NOT TO BE UNREASONABLY WITHHELD.\nCHARTERERS TO SUPPLY AT THEIR TIME AND EXPENSE ALL NECESSARY\nEQUIPMENT\/PERSONNEL\/PERMISSIONS FOR THE OPERATION WHICH TO BE\nCONDUCTED STRICTLY ACCORDING TO OCIMF S-T-S TRANSFER GUIDE\n(PETROLEUM). S-T-S OPERATION TO BE COMPLETELY FREE OF ANY EXPENSES\nFOR THE OWNERS\/VESSEL INCLUDING BUT NOT LIMITED TO D\/A\'S, AGENCY FEES, ETC.\nUPON VESSELS ARRIVAL AT STS POSITION TIME WILL COUNT IN FULL,\nUNINTERRUPTEDLY, UNTILL COMPLETION OF THE OPERATION OF THE CARGO\nAND THE 2 VSLS SEPERATED. NO ALLOWANCE FOR 6 HOURS FREETIME.\nTIME LOST THERE OWING TO BAD WEATHER\/SEA CONDITIONS TO COUNT IN FULL\nAGAINST LAYTIME OR FULL DEMURRAGE IF ON DEMURRAGE.\n \n                        (T E R M S) – SUB OWNERS REVIEW\n \nAMENDMENTS TO BPVOY 4\n---------------------\nIN THE EVENT OF CONFLICT BETWEEN THE PROVISIONS SET OUT HEREIN AND ANY\nPRINTED TERMS OF THE CHARTER PARTY FORM, THE PROVISIONS SET OUT HEREIN\nWILL PREVAIL:\n \nGENERAL AMENDMENTS:\nDELETE ALL REFERENCES TO \'BP SHIPPING QUESTIONNAIRE\' AND REPLACE WITH\n\'Q88 QUESTIONNAIRE FORM VERSION 3 OR ANY SUBSEQUENT MODIFICATION\'\nANY REFERENCE TO TELEX (ES) TO BE DEEMED TO ALSO BE A REFERENCE TO\nEMAIL(S) ALL DISTANCES AND ANY REFERENCE TO ADDITIONAL DISTANCES TO BE\nASSESSED BY REFERENCE TO ONLINE WEB-BASED \'BP SHIPPING MARINE DISTANCE\nTABLES\' PRODUCED BY ATOBVIAC.\n \nPART 1\n------\nLINE 75: DELETE 1600 INSERT 2359\n \nLINE 85: INSERT \'48 HRS\'\n \nDELETE FOLLOWING PARA: \nLINE 98.1: N. POSITION OWNERS WARRANT VESSEL\'S POSITION AT TIME OF\n           FIXTURE IS ___________ AND VESSEL IS PROCEEDING AT______\n           KNOTS, AND IS EXPECTED TO ARRIVE AND BE READY TO LOAD\n           _______________ AT LOAD PORT OF ___________________\n \nPART 2\n------\nCLAUSE 1 CONDITION OF VESSEL\nLINE 110: RECOMMENDATIONS SET OUT IN THE 1996 MOST RECENT EDITION OF\nISGOTT,\n \nCLAUSE 2 CHARTERING QUESTIONNAIRE\n         LINE 125: INSERT \'SIGNIFICANTLY\' AFTER \'TO BE\'\n \nCLAUSE 4 ESTIMATED TIME OF ARRIVAL\n         LINE 186: INSERT \'PROVEN\' BEFORE \'LOSS\'\n         LINE 195: AFTER \'PORT\' INSERT \'WHEN\/WHERE APPLICABLE\'\n         LINE 199: AS ABOVE\n         LINE 212: AFTER \'TELEX\' INSERT \'EMAIL\'\nCLAUSE 5 LOADING AND DISCHARGE PORT\/SHIFTING\n         LINE 219: AFTER \'ALWAYS\' INSERT \'PROCEED THERETO\'\n         LINE 234: DELETE \'ALL\' BEFORE \'SUPPORTING\'\n \nCLAUSE 6 NOTICE OF READINESS\n         LINE 254: AFTER \'REPRESENTATIVE\' INSERT \'IF SUCH SIGNATURE IS\n         OBTAINABLE\'\n         PART 6.3.3- DELETE CLAUSE IN ITS ENTIRETY AND INSERT THE\n         FOLLOWING: FREE PRATIQUE HAS BEEN GRANTED OR IS GRANTED WITHIN\n         SIX (6) HOURS OF THE MASTER TENDERING NOR. IF FREE PRATIQUE IS\n         NOT GRANTED WITHIN SIX (6) HOURS OF THE MASTER TENDERING NOR,\n         THROUGH NO FAULT OF OWNERS, AGENTS, OR THOSE ON BOARD THE\n         VESSEL, THE MASTER SHALL ISSUE A PROTEST IN WRITING (\'NOP\')\n         TO THE PORT AUTHORITY AND THE FACILITY AT THE PORT (\'TERMINAL\')\n         FAILING WHICH LAYTIME OR, IF THE VESSEL IS ON DEMURRAGE,\n         DEMURRAGE SHALL ONLY COMMENCE SIX (6) HOURS AFTER FREE PRATIQUE\n         HAS BEEN GRANTED OR VESSEL COMMENCES LOADING OR DISCHARGING\n         OPERATIONS, WHICHEVER IS THE EARLIEST; AND\n \n         PART 6.3.4- DELETE IN ITS ENTIRETY\n \nCLAUSE 7 LAYTIME\/DEMURRAGE\n         LINE 288: DELETE AS FROM \'UNLESS\' TILL END OF PARAGRAPH 7.2\n         LINE 294-299-300: DELETE \'0600\' INSERT \'0001 BUT CHARTERERS\n         ALWAYS ENTITLED TO 6 HOURS NOR EACH PORT\'\n         LINE 301: ADD AT THE END \'EXCEPT UNDER THE INTERIM PORT CLAUSE,\n         CHARTERERS ALWAYS TO BE ENTITLED TO 6 HOURS NOR AT FIRST PORT\n         AND FIRST DISPORT, UNLESS VESSEL BEING ALL FAST PRIOR, WHERE\n         TIME TO COUNT FROM BEING ALL FAST.\'\n         LINE 314-315: DELETE \'UPON THE COMPLETION OF CARGO\n         DOCUMENTATION\' AND REPLACE WITH \' ONCE CARGO DOCUMENTS ARE\n         DELIVERED ON BOARD.\'\n \nCLAUSE 8 CARGO TRANSFERS\n         LINE 342: AFTER \'THERETO\' INSERT \'ALWAYS SUBJECT TO\n         OWNERS\/MASTER ACCEPTANCE WHICH NOT TO BE UNREASONABLY WITHHELD\'\n         LINE 355: BEFORE \'OWNERS\' INSERT \'HOWEVER ALL TRANSFER ARE\n         ALWAYS SUBJECT TO OWNERS\/MASTER ACCEPTANCE WHICH SHALL NOT BE\n         UNREASONABLY WITHHELD\'\n         LINE 359: AFTER \'INCLUDING\' INSERT \'BUT NOT LIMITED TO\'\n         LINE 362: ADD AT THE END OF PARAGRAPH \'FOR STS OPERATIONS WITH\n         DPP PRODUCTS AND FOR ALL STS OPERATIONS IN DANISH WATERS STS\n         VESSELS MUST BE DOUBLE HULL. IN EVENT OF STS OFF THE COAST OF\n         USA, CHARTERERS WARRANT TO EMPLOY ONLY LIGHTERS\/BARGES OR MEANS\n         OF TRANSPORTATION FULFILLING ALL REQUIREMENTS UNDER OPA 90.\'\n         LINE 375: AFTER \'AS DEMURRAGE\' INSERT \'HOWEVER IF ADVERSE\n         WEATHER AND\/OR ADVERSE SEA STATE CONDITIONS AFFECT THE IN-PORT\n         TRANSFER THEN TIME TO COUNT IN FULL AS LAYTIME OR DEMURRAGE IN\n         ON DEMURRAGE\'\n         LINE 387: AFTER \'CLAUSE 18.1\' INSERT \'AND THE REFERENCE TO\n         ADVERSE WEATHER IN CLAUSE 17\'\n         LINE 416: AFTER \'UNDER\' INSERT \'CLAUSE 17 AND\' AND INSERT\n         \'CLAUSE\'\n         LINE 419: INSERT AT THE END \'TIME TO COUNT IN FULL WEATHER\n         AND\/OR CONDITIONS PERMITTING OR NOT\'\n \nCLAUSE 9 DOCUMENTATION\n         LINE 426: BEFORE \'LOSS\' INSERT \'PROVEN\'\n \nCLAUSE 12 INERT GAS SYSTEM (\'IGS\')\n         LINE 480: AFTER \'DEMURRAGE\' INSERT \'CHARTERERS SHALL REIMBURSE\n         OWNERS FOR ANY BUNKERS USED IN CONNECTION WITH THIS OPERATION\n         UPON RECEIPT OF OWNERS INVOICE WITH FULL SUPPORTING DOCUMENTATION\'\n \nCLAUSE 14 OILY RESIDUES\/CLEAN BALLAST\n         LINE 511: ADD AT THE END \'IF OBTAINABLE\'\n         LINE 523: DELETE \'CHARTERERS INSTRUCT\'\n         LINE 524: DELETE \'TO\'\n \nCLAUSE 15 AGENCY\n         LINE 540: AFTER \'DISCHARGE PORTS\' INSERT \'ALWAYS PROVIDED COMPETITIVE\'\n \nCLAUSE 16 CANCELLATION\n         LINE 562: EXERCISABLE WITHIN TWENTY-FOUR (24) HOURS (SATURDAYS,\n         SUNDAYS AND HOLIDAYS EXCEPTED) ALWAYS INCLUDING ONE LONDON\n         WORKING DAY OF\n         LINE 569: DELETE \'TIMEOUSLY\' INSERT \'WITHIN ONE LONDON WORKING DAY\'\n         LINE 572: HOURS (SATURDAYS, SUNDAYS AND HOLIDAYS EXCEPTED)\n         AFTER THE PERIOD ALLOWED FOR OWNERS\'\n         LINE 578: ADD AT THE END \'ABOVE PROVIDED IS DUE TO OWNERS\n         PROVEN NEGLIGENCE\'\n         LINE 579-586: DELETE IN FULL\n \nCLAUSE 17 HALF LAYTIME\/HALF DEMURRAGE\/FORCE MAJEURE\n         LINE 589: AFTER \'SEA-STATE CONDITIONS\' INSERT \'EXCEPT OTHERWISE\n         SPECIFIED IN THE WEATHER CLAUSE\'\n \nCLAUSE 18 SUSPENSION OF LAYTIME\/DEMURRAGE\n         LINE 600: DELETE \'INCLUDING DAYLIGHT, TIDE\' AND INSERT IT IN CLAUSE,\n         LINE 588 AFTER \'ARISING FROM\'\n         LINE 613: DELETE \'AS A RESULT, WHETHER DIRECTLY OR INDIRECTLY,\'\n         AND INSERT \'AS A DIRECT RESULT\'\n         LINE 621: IN, OR IN CONNECTION WITH, THE BUNKERING AND\/OR THE\n         DISCHARGING OF SLOPS, UNLESS BUNKERING AND\/OR THE\n \nCLAUSE 19 LOADING AND DISCHARGE OF CARGO\n         LINE 649-650: DELETE AS FROM \'MASTER MAY REQUIRE\' TILL END OF\n         SENTENCE AND INSERT \'THE CONNECTION\/DISCONNECTION MAY BE DONE\n         WITH THE ASSISTANCE OF THE CREW BUT ALWAYS UNDER THE\n         SUPERVISION AND APPROVAL OF THE SHORE PERSONNEL ONLY\'\n         LINE 652: INSERT \'BE CAPABLE OF\' AFTER \'VESSEL SHALL\'; CHANGE\n         \'LOAD\' TO \'LOADING\' ; INSERT \'HOMOGENEOUS\' AFTER \'LOADING\'\n         LINE 654: (24) HOURS OR 1\/3 OF TOTAL LAYTIME WHICHEVER IS LESS,\n         PRORATA\n         LINE 659: DELETE \'GRADES\/PARCELS DISCHARGED CONCURRENTLY OR\n         CONSECUTIVELY\'\n         LINE 660: (24) HOURS OR 1\/3 OF TOTAL LAYTIME WHICHEVER IS LESS,\n         PRO RATA ; AFTER \'FULL\' INSERT \'HOMOGENEOUS\'\n         LINE 661: DELETE \'A MINIMUM\' INSERT \'AN AVERAGE\'\n         LINE 673: DELETE \'A MINIMUM\' INSERT \'AN AVERAGE\'\n         LINE 674: AFTER \'MANIFOLD\' INSERT \'EXCLUDING STRIPPING OPERATIONS\'\n         LINE 720: AFTER \'REPRESENTATIVE\' INSERT \'PROVIDED SAME IS OBTAINABLE\'\n \nCLAUSE 20 CLAIMS TIME BAR\n         ADD ON TOP OF CLAUSE: \'THIS CLAUSE DOES NOT APPLY TO CLAIMS\n         UNDER BILLS OF LADING\' AT END OF CLAUSE, INSERT 20.3: CLAIMS\n         ARISING UNDER CLAUSE\n         20.1 AND\/OR 20.2 AND ANY OTHER CLAIM AGAINST CHARTERERS SHALL BE\n         EXTINGUISHED AND CHARTERERS SHALL BE DISCHARGED FROM ALL\n         LIABILITY WHATSOEVER IRRESPECT THEREOF UNLESS PROCEEDINGS HAVE\n         BEEN COMMENCED IN RESPECT OF SUCH CLAIM IN THE RELEVANT FORUM\n         WITHIN EIGHTEEN (18) MONTHS OF THE DATE OF ACCRUAL OF THE CAUSE\n         OF ACTION.\n \nCLAUSE 23 VESSEL\/CARGO INSPECTIONS\/BUNKER SURVEYS\n         LINE 873: AFTER \'COMPENSATED\' INSERT \'AT DEMURRAGE RATE\'\n \nCLAUSE 24 MAINTENANCE OF CARGO TEMPERATURE\n         LINE 880: OF THE CARGO UP TO A MAXIMUM OF 135°F 60°C. OWNERS\n         UNDERTAKE THAT THE VESSEL IS CAPABLE\n         LINE 881: OF MAINTAINING THE CARGO TEMPERATURE UP TO 135°F 60°C\n         THROUGHOUT THE LADEN VOYAGE AND\n \nCLAUSE 25 CARGO HEATING\n         DELETE LINES 895 TO 907\n \nCLAUSE 26 LIBERTY\n         LINE 918: INSERT AT THE END \'SUCH AGREEMENT NOT TO BE\n         UNREASONABLY WITHHELD BY CHARTERERS\'\n \nCLAUSE 28\n         DELETE IN FULL\n \nCLAUSE 30.3 BP INDEMNITY CLAUSE\n         DELETE ORIGINAL\/INSERT:\n         IF AN ORIGINAL BILL OF LADING IS NOT AVAILABLE AT ANY DISCHARGE\n         PORT TO WHICH THE VESSEL MAY BE ORDERED BY CHARTERERS UNDER\n         THIS CHARTER, OR IF CHARTERERS REQUIRE OWNERS TO DELIVER CARGO\n         TO A PARTY OR AT A PORT OTHER THAN AS SET OUT IN THE BILL OF\n         LADING, THEN OWNERS SHALL NEVERTHELESS DISCHARGE SUCH CARGO IN\n         COMPLIANCE WITH CHARTERERS\' INSTRUCTIONS, UPON PRESENTATION BY\n         THE CONSIGNEE NOMINATED BY CHARTERERS (\'THE RECEIVER\') OF\n         REASONABLE IDENTIFICATION TO THE MASTER AND IN CONSIDERATION OF\n         CHARTERERS INDEMNIFYING OWNERS AS PER OWNERS P&I CLUB WORDING\n         WHICH ARE HERE BELOW PRINTED IN APPENDIX TWO.\n \nCLAUSE 31 FREIGHT RATE\n         LINE 1077: 31.4 FREIGHT SHALL BE PAYABLE LATEST THE FIRST\n         WORKING DAY AFTER COMPLETION OF DISCHARGE, ON THE\n \nFOLLOWING PARAGRAPH N\/A THIS VOYAGE: \nLINE 1086: THEREOF, TO THE VOYAGE TO BE PERFORMED UNDER THIS CHARTER. OWNERS \nARE TO PROVIDE AN ROB CERTIFICATE, EVIDENCE OF PRICE PAID FOR BUNKERS AND \nMASTER\'S CALCULATION OF ADDITIONAL BUNKERS USED WITH FREIGHT INVOICES.\n \n         LINE 1088: 31.6 IF OWNERS INCREASE THE SPEED OF THE VESSEL IN\n         ACCORDANCE WITH CHARTERER\'S VOYAGE ORDERS, CHARTERERS SHALL\n         REIMBURSE OWNERS FOR ADDITIONAL BUNKERS CONSUMED AT ACTUAL\n         COSTS WITH PROPER SUPPORTING DOCUMENTS.\n \nCLAUSE 32 ADDRESS COMMISSION\n         LINE 1090: CHARTERERS SHALL DEDUCT 2.5% ADDRESS COMMISSION FROM\n         FREIGHT (INCLUDING FIXED AND\n         LINE 1091: VARIABLE FREIGHT DIFFERENTIALS), AND ANY DEAD\n         FREIGHT, DEMURRAGE, HIRE (STORAGE\/DEVIATION EXCEPT ON BUNKERS\n         REIMBURSEMENT)\n \nCLAUSE 33 CARGO RETENTION\n         LINE 1096: AFTER \'LIQUID\' INSERT \'PUMPABLE AND REACHABLE BY\n         VESSEL FIXED PUMPS\'\n         LINE 1097: AS ABOVE\n         LINE 1099: DELETE \'DEDUCT\' INSERT \'CLAIM\'\n         LINE 1119: DELETE \'DEDUCTED\' INSERT \'CLAIMED\'\n         LINE 1124: AS ABOVE\n \nCLAUSE 35 CARGO INSURANCE\n         DELETE IN FULL\n \nCLAUSE 36 BP UNIQUE IDENTIFIER AND US BUREAU OF CUSTOMS AND BORDER\n         PROTECTION DELETE ORIGINAL\/INSERT:\n         (A) IF THE VESSEL LOADS OR CARRIES CARGO DESTINED FOR THE US OR\n         PASSING THROUGH US PORTS IN TRANSIT, THE OWNERS SHALL COMPLY\n         WITH THE CURRENT US CUSTOMS REGULATIONS (19 CFR 4.7 AND 178) OR\n         ANY SUBSEQUENT AMENDMENTS THERETO AND SHALL (UNLESS CHARTERERS\n         REQUEST OTHERWISE) UNDERTAKE THE ROLE OF CARRIER FOR THE\n         PURPOSES OF SUCH REGULATIONS AND SHALL:\n \n         (I) HAVE IN PLACE A SCAC (STANDARD CARRIER ALPHA CODE) AND\n         INSERT THE SAME ON EACH BILL OF LADING;\n \n         (II) HAVE IN PLACE AN ICB (INTERNATIONAL CARRIER BOND);\n \n         (III) SUBMIT CARGO DECLARATIONS BY AMS (AUTOMATED MANIFEST\n         SYSTEM) TO THE US CUSTOMS; AND\n \n         (IV) PROVIDE CHARTERERS AND AGENTS ON REQUEST WITH DETAILS OF\n         THE UNIQUE IDENTIFIER IN RESPECT OF ALL CARGO CARRIED\n \n         (B) THE CHARTERERS SHALL PROVIDE ALL NECESSARY INFORMATION TO\n         THE OWNERS AND\/OR THEIR AGENTS TO ENABLE THE OWNERS TO SUBMIT A\n         TIMELY AND ACCURATE CARGO DECLARATION.\n \n         (C) OWNERS WARRANT THAT THEY ARE AWARE OF THE US BUREAU OF\n         CUSTOMS AND BORDER PROTECTION REGULATIONS FOR ENTERING US PORTS\n         (THE \'CBP REGULATIONS\'), INCLUDING BUT NOT LIMITED TO THOSE\n         REGULATIONS ISSUED ON DECEMBER 5TH UNDER FEDERAL REGISTER PART\n         II DEPARTMENT OF HOMELAND SECURITY 19 CFR PARTS 4, 103, ET AL,\n         AND OWNERS FURTHER WARRANT THAT THEY WILL COMPLY FULLY WITH THE\n         CBP REGULATIONS.\n \n         (D) THE OWNERS SHALL ASSUME LIABILITY FOR AND SHALL INDEMNIFY,\n         DEFEND AND HOLD HARMLESS THE CHARTERERS AGAINST ANY PROVEN LOSS\n         AND\/OR DAMAGE AND ANY PROVEN EXPENSES, FINES, PENALTIES AND ANY\n         OTHER CLAIMS, INCLUDING BUT NOT LIMITED TO LEGAL COSTS, ARISING\n         FROM THE OWNERS\' FAILURE TO COMPLY WITH ANY OF THE PROVISIONS\n         OF SUB-CLAUSE (A) OR FAILURE TO COMPLY WITH THE\n         CBP REGULATIONS, PROVIDED ALWAYS THAT CHARTERERS HAVE, WITHIN A\n         REASONABLE PERIOD AFTER BEING REQUESTED BY OWNERS, PROVIDED\n         THEM WITH SUCH INFORMATION AS IS REASONABLY REQUIRED TO ENABLE\n         THEM TO COMPLY WITH THE CBP REGULATIONS.\n         SHOULD SUCH FAILURE RESULT IN ANY DELAY THEN, NOTWITHSTANDING\n         ANY PROVISION IN THIS CHARTER PARTY TO THE CONTRARY, THE PERIOD\n         OF SUCH DELAY SHALL NOT COUNT AS LAYTIME OR, IF THE VESSEL IS\n         ON DEMURRAGE, AS DEMURRAGE.\n \n         (E) THE ASSUMPTION OF THE ROLE OF CARRIER BY THE OWNERS\n         PURSUANT TO THIS CLAUSE AND FOR THE PURPOSE OF THE US CUSTOMS\n         REGULATIONS (19 CFR 4.7) SHALL BE WITHOUT PREJUDICE TO THE\n         IDENTITY OF CARRIER UNDER ANY BILL OF LADING, OTHER CONTRACT,\n         LAW OR REGULATION.\n \nCLAUSE 38 EXCEPTIONS\n         LINE 1183: INSERT \'NEITHER OWNERS NOR\' BEFORE \'CHARTERERS;\n         DELETE \'NOT\' LINE 1188: DELETE AT THE END \'.\' AND INSERT\n         \', REQUISITION, PERIL OF THE SEA, ACT OF PUBLIC ENEMY\'S OR\n         ASSAILING THIEVES.\'\n \nCLAUSE 39 WAR RISKS\n         LINE 1296: ADD AT THE END OF CLAUSE \'ANY ADDITIONAL WAR RISK\n         PREMIUMS AND\/OR CREW WAR BONUSES TO BE FOR CHARTERERS ACCOUNT\n         BUT QUOTATION SHALL BE SUBMITTED BY OWNERS TO CHARTERERS BEFORE\n         INVOICING.\'\n \nCLAUSE 44 OIL POLLUTION INSURANCE\n         DELETE ORIGINAL\/INSERT:\n         OWNERS WARRANT THAT THEY HAVE, AND SHALL MAINTAIN IN FORCE\n         THROUGHOUT THE PERIOD OF THIS CHARTER, THE STANDARD OIL\n         POLLUTION INSURANCE COVER (CURRENTLY US$1,000 MILLION)\n         AVAILABLE, FROM TIME TO TIME, FROM THEIR PROTECTION AND\n         INDEMNITY CLUB.\n \nCLAUSE 45.1.2 OIL POLLUTION PREVENTION\n         DELETE ORIGINAL PART 45.1.2\/INSERT:\n         IS ENTERED IN THE P & I CLUB STATED IN THE Q88 LAST COMPLETED\n         BY OR ON BEHALF OF OWNERS AND WILL SO REMAIN UNLESS OWNERS HAVE\n         GIVEN CHARTERERS PRIOR WRITTEN NOTICE OF THEIR INTENTION TO\n         CHANGE. OWNERS WARRANT THAT THE VESSEL WILL ONLY BE ENTERED IN\n         A P & I CLUB WITHIN THE INTERNATIONAL GROUP OF P & I CLUBS.\n \nCLAUSE 47 SUB-LETTING\n         LINE 1419: AT THE END INSERT \'ALWAYS WITH OWNERS PRIOR CONSENT\n         WHICH SHALL NOT BE UNREASONABLY WITHHELD\'\n \nCLAUSE 49 LAW\n         LINE 1440: DISPUTE WHICH MAY ARISE OUT OF THIS CHARTER, SAVE AS\n         HEREINAFTER PROVIDED. ANY DISPUTE ARISING OUT OF THIS CHARTER\n         OF LESS THAN USD ,000 SHALL BE REFERRED TO A SINGLE ARBITRATOR\n         IN LONDON, SUBJECT TO THE LMAA SMALL CLAIMS PROCEDURE.\n \n \nBLA-BLA-BLA\'S VOYAGE CHARTERING TERMS EFFECTIVE BLA-BLA-BLA, 2001\n=============================================\n \nADDITIONAL CLAUSES TO BPVOY 4\n-----------------------------\n1. BP ISPS CLAUSE FOR VOYAGE CHARTER PARTIES\n   (A) (I) THE OWNERS SHALL PROCURE THAT BOTH THE VESSEL AND \'THE\n    COMPANY\' (AS DEFINED BY THE INTERNATIONAL CODE FOR THE SECURITY OF\n    SHIPS AND OF PORT FACILITIES AND THE RELEVANT AMENDMENTS TO CHAPTER\n    XI OF SOLAS (ISPS CODE)) AND THE \'OWNER\' (AS DEFINED BY THE US\n    MARITIME TRANSPORTATION SECURITY ACT 2002 (MTSA)) SHALL COMPLY WITH\n    THE REQUIREMENTS OF THE ISPS CODE RELATING TO THE VESSEL AND \'THE\n    COMPANY\' AND THE REQUIREMENTS OF THE MTSA, IF APPLICABLE,\n    RELATING TO THE VESSEL AND THE \'OWNER\'. UPON REQUEST THE OWNERS\n    SHALL PROVIDE A COPY OF THE RELEVANT INTERNATIONAL SHIP SECURITY\n    CERTIFICATE (OR THE INTERIM INTERNATIONAL SHIP SECURITY\n    CERTIFICATE) TO THE CHARTERERS. THE OWNERS SHALL PROVIDE THE\n    CHARTERERS WITH THE FULL STYLE CONTACT DETAILS OF THE COMPANY\n    SECURITY OFFICER (CSO). (II) EXCEPT AS OTHERWISE PROVIDED IN THIS\n    CHARTER PARTY, LOSS, DAMAGE, EXPENSE OR DELAY, EXCLUDING\n    CONSEQUENTIAL LOSS, CAUSED BY FAILURE ON THE PART OF THE OWNERS\n    OR \'THE COMPANY\' TO COMPLY WITH THE REQUIREMENTS OF THE ISPS CODE\n    OR THE MTSA, IF APPLICABLE, OR THIS CLAUSE SHALL BE FOR THE OWNERS\'\n    ACCOUNT.\n \n   (B) (I) THE CHARTERERS SHALL PROVIDE THE OWNER WITH THEIR FULL STYLE\n   CONTACT DETAILS AND ANY OTHER INFORMATION THE OWNERS REQUIRE TO\n   COMPLY WITH THE ISPS CODE AND THE MTSA, IF APPLICABLE. ADDITIONALLY,\n   CHARTERERS SHALL ENSURE THAT THE CONTACT DETAILS OF ANY\n   SUB-CHARTERERS ARE LIKEWISE PROVIDED AND THAT ALL SUB-CHARTERS THEY\n   ENTER INTO CONTAIN THE FOLLOWING PROVISION:\n   \'THE CHARTERERS SHALL PROVIDE OWNERS WITH THEIR FULL STYLE CONTACT\n   DETAILS AND, WHERE SUB-CHARTERING IS PERMITTED UNDER THE TERMS OF THE\n   CHARTER PARTY, SHALL ENSURE THAT CONTACT DETAILS OF ALL\n   SUB-CHARTERERS ARE LIKEWISE PROVIDED TO OWNERS.\'\n   (II) EXCEPT AS OTHERWISE PROVIDED IN THIS CHARTER PARTY, LOSS,\n   DAMAGE, EXPENSE, EXCLUDING CONSEQUENTIAL LOSS, CAUSED BY FAILURE ON\n   THE PART OF THE CHARTERERS TO COMPLY WITH THIS SUB-CLAUSE (B) SHALL\n   BE FOR THE CHARTERERS\' ACCOUNT AND ANY DELAY CAUSED BY SUCH FAILURE\n   SHALL BE COMPENSATED AT THE DEMURRAGE RATE.\n \n   (C) (I) WITHOUT PREJUDICE TO THE FOREGOING, OWNERS\' RIGHT TO TENDER\n   NOTICE OF READINESS AND CHARTERERS\' LIABILITY FOR DEMURRAGE IN\n   RESPECT OF ANY TIME DELAYS CAUSED BY BREACHES OF THIS CLAUSE SHALL\n   BE DEALT WITH IN ACCORDANCE WITH CLAUSES 6 (NOTICE OF READINESS), 7\n   (LAYTIME\/DEMURRAGE) AND 18 (SUSPENSION OF LAYTIME\/DEMURRAGE), OF THE\n   CHARTER.\n   (II) EXCEPT WHERE THE DELAY IS CAUSED BY OWNERS\' AND\/OR CHARTERERS\'\n   FAILURE TO COMPLY WITH SUB-CLAUSES (A) AND (B) RESPECTIVELY OF THIS\n   CLAUSE, THEN ANY DELAY ARISING OR RESULTING FROM MEASURES IMPOSED BY\n   A PORT FACILITY OR BY ANY RELEVANT AUTHORITY, UNDER THE ISPS\n   CODE\/MTSA, SHALL COUNT AS HALF LAYTIME, OR, IF THE VESSEL IS ON\n   DEMURRAGE, HALF RATE DEMURRAGE.\n \n   (D) ANY COSTS OR EXPENSES RELATED TO SECURITY REGULATIONS OR MEASURES\n   REQUIRED BY THE PORT FACILITY OR ANY RELEVANT AUTHORITY IN ACCORDANCE\n   WITH THE ISPS CODE\/MTSA INCLUDING, BUT NOT LIMITED TO, SECURITY\n   GUARDS, LAUNCH SERVICES, TUG ESCORTS, PORT SECURITY FEES OR TAXES AND\n   INSPECTIONS, SHALL BE SHARED EQUALLY BETWEEN OWNERS AND CHARTERERS,\n   EXCEPT WHERE:-\n   SUCH COSTS OR EXPENSES ARE IMPOSED AS A RESULT OF OWNERS\' OR\n   CHARTERERS\' FAILURE TO COMPLY WITH SUB-CLAUSES (A) AND (B)\n   RESPECTIVELY OF THIS CLAUSE; OR IF FREIGHT FOR THE VOYAGE IS BASED ON\n   WORDSCALE, SUCH COSTS OR EXPENSES ARE INCLUDED BY WORLDSCALE IN\n   THEIR FREIGHT CALCULATION (IN WHICH CASE SUCH COSTS OR EXPENSES SHALL\n   BE FOR OWNERS\' ACCOUNT).\n   ALL MEASURES REQUIRED BY THE OWNERS TO COMPLY WITH THE SHIP SECURITY\n   PLAN SHALL BE FOR OWNERS\' ACCOUNT.\n \n   (E) IF EITHER PARTY MAKES ANY PAYMENT WHICH IS FOR THE OTHER PARTY\'S\n   ACCOUNT ACCORDING TO THIS CLAUSE, THE OTHER PARTY SHALL INDEMNIFY THE\n   PAYING PARTY.\n \n   (F) (I) [OTHER THAN CALLING AT ON ] OWNERS WARRANT THAT ALL OF THE\n   PREVIOUS  TEN PORTS AT WHICH THE VESSEL HAS CALLED, OR WILL HAVE\n   CALLED, PRIOR TO TENDERING NOTICE OF READINESS AT THE FIRST LOAD PORT\n   HEREUNDER:\n   (AA) HAD AN APPROVED SECURITY PLAN; AND\n   (BB) WERE (AND REMAIN) REGISTERED WITH THE IMO AS ISPS COMPLIANT\n        PORTS; AND\n   (CC) HAD A SECURITY LEVEL NO HIGHER THAN LEVEL 1 (NORMAL) OR\n   MARSECLEVEL 1; AND\n   (DD) WERE NOT, NOR HAVE SUBSEQUENTLY BEEN, DEEMED UNACCEPTABLE BY THE\n    US AUTHORITIES UNDER THEIR SECURITY REGIME.\n   (II) OWNERS FURTHER WARRANT THAT, OTHER THAN AS EXPRESSLY DISCLOSED\n   TO CHARTERERS IN WRITING, THE VESSEL HAS NOT LOADED GOODS OR SUPPLIES\n   (NOR EMBARKED ANY INDIVIDUALS) FROM, NOR ENGAGED IN ANY SHIP TO SHIP\n   TRANSFER OF CARGO WITH, ANOTHER VESSEL.\n   (III) EXCEPT AS OTHERWISE PROVIDED IN THIS CHARTER PARTY, LOSS,\n   DAMAGE, EXPENSE OR DELAY CAUSED BY BREACH BY OWNERS OF THE WARRANTIES\n   CONTAINED IN THIS SUB-CLAUSE (F) SHALL BE FOR THE OWNERS\' ACCOUNT.\n \n2. BP ISM CLAUSE\n   (A) OWNERS UNDERTAKE THAT FOR THE DURATION OF THIS CHARTER, THE\n   VESSEL AND \'THE COMPANY\' (AS DEFINED IN THE INTERNATIONAL MANAGEMENT\n   CODE FOR THE SAFE OPERATION OF SHIPS AND FOR POLLUTION PREVENTION\n   (THE INTERNATIONAL SAFETY MANAGEMENT (ISM) CODE) (THE \'ISM CODE\'))\n   SHALL COMPLY WITH THE REQUIREMENTS OF THE ISM CODE. CHARTERERS MAY AT\n   ANY TIME REQUEST AN INSPECTION OF THE RELEVANT DOCUMENT OF COMPLIANCE\n   AND\/OR SAFETY MANAGEMENT CERTIFICATE, AND UPON RECEIPT OF SUCH A\n   REQUEST OWNERS SHALL FORTHWITH PROVIDE THE SAME.\n   (B) WITHOUT PREJUDICE TO ANY RIGHTS OR REMEDIES AVAILABLE TO\n   CHARTERERS UNDER THE TERMS OF THIS CHARTER OR UNDER THE LAW\n   APPLICABLE HERETO, IN THE EVENT OF A BREACH OF THE ABOVE UNDERTAKING\n   ANY LOSS, DAMAGE, EXPENSE OR DELAY FOLLOWING THEREFROM SHALL BE FOR\n   OWNERS\' ACCOUNT.\n \n3. BP REGULATORY AND GUIDELINE COMPLIANCE CLAUSE\n   THROUGHOUT THE PERIOD OF THIS CHARTER, THE OWNERS AND THE VESSEL\n   SHALL COMPLY WITH ALL RELEVANT REGULATIONS AND GUIDELINES ISSUED BY\n   THE IMO AND OCIMF AND, IN THE CASE OF A VESSEL CARRYING LPG OR LNG,\n   WITH THE RECOMMENDATIONS AND GUIDELINES ISSUED FROM TIME TO TIME BY\n   SIGTTO. IN ADDITION, ALL OPERATIONS SHALL BE CARRIED OUT IN\n   ACCORDANCE WITH THE LATEST EDITION OF ISGOTT, AND ANY AMENDMENTS OR\n   UPDATES THERETO WHICH MAY BE ISSUED FROM TIME TO TIME.\n \n4. ELIGIBILITY\n   OWNER WARRANTS THAT THE VESSEL IS IN ALL RESPECTS ELIGIBLE EXCEPT FOR\n   HER PHYSICAL CHARACTERISTICS FOR TRADING WITHIN, TO AND FROM RANGES\n   AND AREAS SPECIFIED IN CHARTER PARTY, AND THAT AT ALL TIMES SHE SHALL\n   HAVE ON BOARD ALL CERTIFICATES, RECORDS AND OTHER DOCUMENTS REQUIRED\n   FOR SUCH SERVICE.\n \n   IN THE EVENT THAT THE VESSEL IS FOUND, AT ANY TIME, NOT TO BE\n   ELIGIBLE AS WARRANTED, CHARTERERS SHALL HAVE THE RIGHT TO CANCEL\n   SUBJECT CHARTER PARTY AS WELL AS TO HAVE RECOURSE TO OWNERS FOR ANY\n   AND ALL DAMAGES, DEMURRAGE, EXPENSES AND LOSSES RELATED TO SUCH\n   CANCELLATION.\n \n5. BP OIL POLLUTION INSURANCE CERTIFICATION AND COFR\'S CLAUSE\n   THE VESSEL SHALL HAVE ON BOARD ALL CERTIFICATES OF FINANCIAL\n   RESPONSIBILITY (\'COFRS\') IN RESPECT TO OIL POLLUTION NECESSARY FOR\n   THE REQUIRED TRADE WITHIN THE AGREED TRADING LIMITS, INCLUDING BUT\n   NOT LIMITED TO:\n   (A) THE CERTIFICATE OF INSURANCE REQUIRED UNDER THE INTERNATIONAL\n   CONVENTION ON CIVIL LIABILITY FOR OIL POLLUTION DAMAGE AND THE\n   PROTOCOLS THERETO; AND\n   (B) THE CERTIFICATE OF INSURANCE REQUIRED UNDER THE INTERNATIONAL\n   CONVENTION ON CIVIL LIABILITY FOR BUNKER OIL POLLUTION 2001;\n   AND\n   (C) UNITED STATES COAST GUARD CERTIFICATE OF FINANCIAL RESPONSIBILITY\n   MEETING  THE REQUIREMENTS OF THE UNITED STATES FEDERAL OIL POLLUTION\n   ACT 1990 (\'OPA 90\').\n \n6. BP ITWF CLAUSE\n   OWNERS UNDERTAKE TO ENSURE THAT THE TERMS OF EMPLOYMENT OF THE\n   VESSEL\'S MASTER,  OFFICERS AND CREW SHALL ALWAYS REMAIN ACCEPTABLE TO\n   THE INTERNATIONAL TRANSPORT WORKER\'S FEDERATION (\'ITWF\')AND THE\n   VESSEL WILL AT ALL TIMES CARRY AN ITWF BLUE CARD OR EQUIVALENT\n   CERTIFICATION ACCEPTABLE TO ITWF.\n \n7. BALLAST WATER MANAGEMENT CLAUSE\n   VESSEL TO ARRIVE AT EACH LOADING PORT WITH CLEAN BALLAST, FREE OF\n   SLOPS AND TANK WASHINGS. VESSEL IS TO BE ABLE TO BALLAST \/ DEBALLAST\n   SIMULTANEOUSLY WITH LOADING \/ DISCHARGING.\n   OWNERS ADDITIONALLY WARRANTS THE VESSEL WILL COMPLY WITH ALL\n   MANDATORY BALLAST WATER REQUIREMENTS. THE OWNERS SHALL ASSUME\n   LIABILITY FOR AND SHALL INDEMNIFY, DEFEND AND HOLD HARMLESS THE\n   CHARTERERS AGAINST ANY LOSS AND\/OR DAMAGE (EXCLUDING CONSEQUENTIAL\n   LOSS AND\/OR DAMAGE) AND ANY EXPENSES, FINES, PENALTIES AND ANY OTHER\n   CLAIMS, INCLUDING BUT NOT LIMITED TO LEGAL COSTS, ARISING FROM THE\n   OWNERS\' FAILURE TO COMPLY WITH ANY SUCH PROVISIONS. SHOULD SUCH\n   FAILURE RESULT IN ANY DELAY THEN, NOTWITHSTANDING ANY PROVISION IN\n   THIS CHARTER PARTY TO THE CONTRARY, THE PERIOD OF SUCH DELAY SHALL\n   NOT COUNT AS LAYTIME OR, IF THE VESSEL IS ON DEMURRAGE, AS DEMURRAGE.\n \n8. BP TOPIA 2006 CLAUSE (ISSUED NOVEMBER 2006)\n   OWNERS WARRANT THAT THEY ARE A PARTICIPATING OWNER (AS DEFINED IN THE\n   TANKER OIL POLLUTION INDEMNIFICATION AGREEMENT 2006 (TOPIA 2006)) AND\n   THAT THE VESSEL IS ENTERED IN TOPIA 2006 AND SHALL SO REMAIN\n   THROUGHOUT THE PERIOD OF THIS CHARTER, PROVIDED ALWAYS THAT:-\n   I) THE VESSEL IS AND REMAINS A RELEVANT SHIP AS DEFINED IN CL.III OF\n   TOPIA 2006; AND\n   II) TOPIA 2006 IS NOT TERMINATED IN ACCORDANCE WITH CL.IX OF\n   THAT AGREEMENT.\n \n9. BP STOPIA 2006 CLAUSE (ISSUED NOVEMBER 2006)\n   IF THE VESSEL HAS A GROSS REGISTERED TONNAGE OF 29,548 OR LESS OWNERS\n   WARRANT THAT THEY ARE A PARTICIPATING OWNER (AS DEFINED IN THE SMALL\n   TANKER OIL POLLUTION INDEMNIFICATION AGREEMENT 2006 (STOPIA 2006))\n   AND THAT THE VESSEL IS ENTERED IN STOPIA 2006 AND SHALL SO REMAIN\n   THROUGHOUT THE PERIOD OF THIS CHARTER, PROVIDED ALWAYS THAT:-\n   I) THE VESSEL IS AND REMAINS A RELEVANT SHIP AS DEFINED IN CL. III OF\n   STOPIA 2006; AND\n   II) STOPIA 2006 IS NOT TERMINATED IN ACCORDANCE WITH CL. IX OF THAT\n   AGREEMENT.\n \n10.FUEL SULPHUR CONTENT CLAUSE\n   OWNERS CONFIRM THEY ARE AWARE OF THE MAXIMUM SULPHUR CONTENT\n   REQUIREMENTS OF ANY EMISSION CONTROL ZONE THE VESSEL MAY BE REQUIRED\n   TO ENTER DURING THE PERFORMANCE OF THIS CHARTER. OWNERS WARRANT THAT\n   OWNERS AND THE VESSEL SHALL COMPLY WITH ALL APPLICABLE REQUIREMENTS\n   OF ANY EMISSION CONTROL ZONE AND SHALL, WITHOUT LOSS OF TIME AND\/OR\n   DEVIATION, USE FUELS (WHICH TERM SHALL INCLUDE ALL HEAVY FUEL OILS,\n   MARINE GAS OILS AND MARINE DIESEL OILS AS APPLICABLE)\n   OF SUCH SPECIFICATIONS AND GRADES TO ENSURE COMPLIANCE WITH THESE\n   REQUIREMENTS.\n   FOR THE PURPOSE OF THIS CLAUSE, \'EMISSION CONTROL ZONE\' SHALL MEAN\n   AREAS AS STIPULATED IN MARPOL ANNEX VI INCLUDING EU DIRECTIVE\n   2005\/33\/EC AND\/OR ZONES AND\/OR AREAS REGULATED BY REGIONAL AND\/OR\n   NATIONAL AUTHORITIES SUCH AS, BUT NOT LIMITED TO, THE EU, THE US\n   ENVIRONMENTAL PROTECTION AGENCY AND THE CALIFORNIA ENVIRONMENTAL\n   PROTECTION AGENCY.\n   OWNERS SHALL INDEMNIFY, DEFEND AND HOLD CHARTERERS HARMLESS IN\n   RESPECT OF ANY DIRECT OR INDIRECT LOSS, LIABILITY, DELAY, FINES,\n   COSTS OR EXPENSES ARISING OR RESULTING FROM OWNERS\' FAILURE TO\n   COMPLY WITH THIS CLAUSE.\n \n11.INTERIM PORTS CLAUSE\n   PREVIOUS WORDING FULLY DELETED AND REPLACED BY:\n   TORM INTERIM PORT CLAUSE APPLICABLE FOR LUMPSUM FIXTURES\/LUMPSUM\n   FREIGHT :\n   CHARTERERS TO PAY FOR ADDITIONAL INTERIM LOAD PORT AT COST AS FOLL:\n   DEVIATION:\n   ACTUAL ADDITIONAL STEAMING TIME INCURRED AS PER MASTERS STATEMENT FOR\n   DEVIATION WHICH EXCEEDS DIRECT PASSAGE FROM FURTHEST LOADPORT TO\n   FINAL DISCHPORT AS PER BP\'S DISTANCE TABLE.\n   PORT TIME:\n   TIME TO COUNT IN FULL FROM ARRIVAL PILOT STATION INTERIM\n   LOAD\/DISCHARGE PORT UNTIL DROPPING LAST OUTWARD PILOT INTERIM\n   LOAD\/DISCHARGE PORT. NO DEDUCTION FOR SHIFTING EVEN FROM ANCHORAGE TO\n   FIRST BERTH AND NO DEDUCTION FOR TIME  LOST DUE TO TIDE, SEA AND\n   WEATHER CONDITIONS.\n   COST:\n   DEVIATION AND PORT TIME USED TO BE CALCULATED AT DEMURRAGE RATE PER\n   DAY PLUS COST FOR ALL BUNKERS CONSUMED DURING THE DEVIATION AS WELL\n   AS ALL BUNKERS USED IN PORT AS PER MASTERS TELEX\/E-MAIL STATEMENT.\n   PORT COSTS TO BE SETTLED DIRECTLY BY CHARTERERS UNLESS OTHERWISE\n   AGREED.\n   PAYMENT:\n   DEVIATION + TIME USED IN PORT (CHARTERERS TO HAVE THE BENEFIT OF ANY\n   UNUSED LAYTIME AT THE NON-INTERIM LOAD\/DISCHARGE PORTS AT THE INTERIM\n   LOAD\/DISCHARGE PORTS) + BUNKERS CONSUMED TO BE PAID TOGETHER WITH\n   FREIGHT IMMEDIATELY UPON COMPLETION OF DISCHARGE AS PER OWNERS\n   TELEXED\/E-MAILED INVOICE WITH SUPPORTING DOCUMENT, WHICH LATER TO BE\n   SUPPORTED BY HARD COPY DOCUMENTATION.\n \n12.UNSPECIFIED DELAY\n   ANY DELAYS FOR WHICH LAYTIME\/DEMURRAGE CONSEQUENCES ARE NOT\n   SPECIFICALLY ALLOCATED IN THIS OR ANY OTHER CLAUSE OF THIS CHARTER\n   AND WHICH ARE BEYOND THE REASONABLE CONTROL OF OWNER OR CHARTERER\n   SHALL COUNT AS LAYTIME OR, IF VESSEL IS ON DEMURRAGE, AS TIME ON\n   DEMURRAGE. IF DEMURRAGE IS INCURRED, ON ACCOUNT OF SUCH DELAYS, IT\n   SHALL BE PAID AT THE AGREED DEMURRAGE RATE.\n \n13.FORCE MAJEURE\n   NOTWITHSTANDING ANYTHING TO THE CONTRARY IN THIS CHARTERPARTY,\n   NEITHER THE OWNERS NOR THE CHARTERERS SHALL BE LIABLE FOR DAMAGES\n   FOR DELAY OR FOR ANY FAILURE TO PERFORM THEIR RESPECTIVE OBLIGATIONS\n   HEREUNDER IF THE DELAY OR FAILURE IS DUE TO FIRE, EXPLOSION,\n   LOCK-OUTS, STOPPAGE OR RESTRAINT OF LABOUR, FLOODS, ACT OF GOD, WAR,\n   TERRORIST ACTIVITY, CIVIL COMMOTION OR ANY OTHER CAUSE BEYOND THAT\n   PARTY\'S REASONABLE CONTROL. TIME LOST AS A RESULT OF ANY\n   OF THE AFOREMENTIONED CLAUSES SHALL COUNT AS HALF OF USED LAYTIME OR\n   HALF TIME ON DEMURRAGE.\n \n14.THIRD PARTY ARREST\n   IN THE EVENT OF ARREST OR OTHER SANCTION LEVIED AGAINST THE VESSEL OR\n   CHARTERER ARISING OUT OF OWNER\'S BREACH OR ANY FAULT OF OWNER, OWNER\n   SHALL INDEMNIFY CHARTERER FOR ANY DAMAGES, PENALTIES, COSTS AND\n   CONSEQUENCES AND ANY TIME VESSEL IS UNDER ARREST SHALL NOT COUNT AS\n   USED LAYTIME OR TIME ON DEMURRAGE.\n   IN THE EVENT OF ARREST\/DETENTION OR OTHER SANCTION LEVIED AGAINST THE\n   VESSEL THROUGH NO FAULT OF THE CHARTERERS, CHARTERER SHALL BE\n   ENTITLED, IN CHARTERERS OPTION, TO TERMINATE THE CHARTER.\n   TERMINATION OR FAILURE TO TERMINATE SHALL BE WITHOUT PREJUDICE TO\n   ANY CLAIM FOR DAMAGES CHARTERER MAY HAVE AGAINST OWNER.\n \n15.IN TRANSIT LOSS\n   IN ADDITION TO ANY OTHER RIGHTS WHICH CHARTERER MAY HAVE, OWNER WILL\n   BE RESPONSIBLE FOR THE FULL AMOUNT OF ANY IN-TRANSIT LOSS IF THE\n   IN-TRANSIT LOSS EXCEEDS 0.3% AND CHARTERER SHALL HAVE THE RIGHT TO\n   CLAIM FROM FREIGHT AN AMOUNT EQUAL TO THE FOB PORT OF LOADING VALUE\n   OF SUCH LOST CARGO PLUS FREIGHT AND INSURANCE DUE WITH RESPECT\n   THERETO. IN-TRANSIT LOSS IS DEFINED AS THE DIFFERENCE BETWEEN NET\n   VESSEL VOLUMES AFTER LOADING AT THE LOADING PORT AND BEFORE\n   UNLOADING AT THE DISCHARGE PORT, AS DETERMINED BY A MUTUALLY AGREED\n   INDEPENDENT INSPECTOR APPOINTED BY CHARTERERS OR RECEIVERS, WHOSE\n   DETERMINATION SHALL BE FINAL AND BINDING UPON BOTH PARTIES.\n \n16.DISCHARGE\/RELOAD CLAUSE\n   CHARTERER SHALL HAVE THE OPTION TO DISCHARGE AND\/OR COMINGLE AND\/OR\n   RELOAD AND\/OR TOP OFF ALL OR PART CARGO WITHIN THE LOAD\/DISCHARGE\n   RANGES.\n   IF EXERCISED, ANY ADDITIONAL COSTS IN CONNECTION WITH THE RELOAD\n   INCLUDING BUT NOT LIMITED TO CLEANING\/DEINERTING\/REINERTING IF ANY,\n   TO BE FOR CHARTERER\'S ACCOUNT AND ADDITIONAL TIME CONSUMED TO COUNT\n   AS USED LAYTIME. FOR WORLDSCALE PURPOSES, SAID DISCHARGE\/RELOAD PORT\n   TO COUNT AS A DISCHARGE PORT UNDER WORLDSCALE. ANY CREDITED LAYTIME\n   TO BE ADDED TO THIS CLAUSE.\n \n17.LOSS OF TURN AND DELAY\n   IF, AS A RESULT OF ANY BREACH OF THIS CHARTERPARTY OR ANY OTHER FAULT\n   ON THE PART OF THE OWNERS OR THE VESSEL, THE VESSEL LOSES ITS TURN TO\n   BERTH OR, BEING AT THE BERTH, HAS TO WAIT IDLE AT THE BERTH OR IS\n   SENT OFF THE BERTH  AND HAS TO WAIT FOR A FURTHER TURN, ALL TIME LOST\n  AS A RESULT OF HAVING TO WAIT FOR A BERTH SHALL BE FOR OWNERS ACCOUNT\n   AND SHALL NOT COUNT AS LAYTIME OR TIME ON DEMURRAGE.\n   ALL ADDITIONAL COSTS OF UNBERTHING AND REBERTHING AND ALL ADDITIONAL\n   BERTH FEES AND ANY OTHER EXTRA PROVEN EXPENSES SHALL LIKEWISE BE FOR\n   OWNERS\' ACCOUNT.\n   ALL OTHER TIME LOST BY REASON OF OWNERS\' BREACH OF ANY TERM OF THIS\n   CHARTERPARTY OR ANY OTHER FAULT ON THE PART OF THE OWNERS OF THE\n   VESSEL, SHALL NOT COUNT AS LAYTIME OR TIME ON DEMURRAGE. LAYTIME TO\n   RESUME ONCE VESSEL COMMENCES CARGO OPERATIONS PROVIDED THAT NOTHING\n   IN THIS CLAUSE WILL RENDER VALID ANY NOR THAT WOULD OTHERWISE HAVE\n   BEEN INVALID.\n \n18.PRIVATE AND CONFIDENTIAL CLAUSE\n   THE TERMS AND CONDITIONS OF THIS CHARTER PARTY AND ITS NEGOTIATIONS\n   TO BE KEPT STRICTLY PRIVATE AND CONFIDENTIAL AND SHALL NOT BE REPORTED.\n \n19.CHARTER PARTY ADMINISTRATION CLAUSE\n   CHARTER PARTY TERMS AND CONDITIONS ARE EVIDENCE BY THE FIXING\n   CONFIRMATION SENT BY THE BROKER. OWNER AND CHARTERER SHALL EACH\n   CONFIRM THEIR APPROVAL OF THE FIXING CONFIRMATION BY RETURN TO THE\n   BROKER AFTER LIFTING SUBJECTS. THE BROKER SHALL THEN CONFIRM RECEIPT\n   OF SAID CONFIRMATION TO BOTH PARTIES. EXCEPT AS REQUESTED IN WRITING\n   BY EITHER OWNERS OR CHARTERER, THERE SHALL BE NO FORMAL WRITTEN AND\n   SIGNED CHARTER PARTY.\n \n20.ADDITIVATION CLAUSE\n   CHARTERERS HAVE THE RIGHT TO ADD CARGO ADDITIVES (INCLUDING BUT NOT\n   LIMITED TO POUR POINT DEPRESSANT, ANTI-STATIC ADDITIVES, METALS\n   DEACTIVATORS AND H2 SCAVENGERS) AND MASTER TO EXECUTE THIS OPERATION\n   (THESE OPERATIONS) AS PER CHARTERERS INSTRCUTIONS SUBJECT TO SHIP\'S\n   SAFETY. HOWEVER OWNERS ARE NOT TO CARRY OUT REQUESTED OPERATION PRIOR\n   CHARTERES HAVE PROVIDED THEM WITH MSDS FOR HEADOWNERS ACCEPTANCE FOR\n   THE ADDITIVE AS WELL AS LOI AS PER OWNERS P&I CLUB WORDING.\n \nADDITIONAL CLAUSES\n------------------\n\netc.\netc.\netc.\n \nCOMMISSION: BLA-BLA-BLA PCT ADDCOMM, DEDUCTABLE + \n            BLA-BLA-BLA PCT TO BLA-BLA-BLA ON F\/DF\/DEM.\n\n--- END RECAP ---\n\nBEST REGARDS\nJOHN APPLESEED', { row: 0, column: 0 } ];
    _.recap_array = new _.SubArray();
    _.roundTotal = null;
    _.roundCurrent = 0;

    _.statusMenu = 'VIEWER';

    _.clean_recap = [];
    _.counter_array = [];
    _.insertLines = [];
    _.HARD_DELETE = '---';
    _.SOFT_DELETE = '[MARK AS DELETED]';


    //??????????? WTF ??????????
    _.counter_labels = [];
    _.offer_labels = [];
    _.tempa = '';

    window["_"]['onselectChangedTheme'] = _.onselectChangedTheme;
    window["_"]['onselectChangedFontSize'] = _.onselectChangedFontSize;
    window["_"]['onclickRECAPULATR'] = _.onclickRECAPULATR;
    window["_"]['onclickAE'] = _.onclickAE;
    window["_"]['onclickVIEWER'] = _.onclickVIEWER;
    window["_"]['onclickABOUT'] = _.onclickABOUT;
    window["_"]['onclickCONTACT'] = _.onclickCONTACT;
    window["_"]['exampleRecap'] = _.exampleRecap;
    window["_"]['exampleRecapEnd'] = _.exampleRecapEnd;
    window["_"]['submitRecap'] = _.submitRecap;
    window["_"]['redrawRecap'] = _.redrawRecap;
    window["_"]['myVarRecap'] = _.myVarRecap;
    window["_"]['recap_array'] = _.recap_array;



    //window['_'] = {};
    




    //_.tempafull = '';

    //var _.myVarAE = '%%%OFFER%%%\n  Paste your recap here, it will highlight some important words like \'deduct\', \'risk\', \'freight\', \'chrtrs\', \'insert\', \'delete\', USD 1 000 000 PMT etc. etc. for your convenience and quicker reading. You can use it for a very quick glance on your CP\/recap (pls feel free to send me email if want to add more keywords to the highlighing dictionary).\n\nExample below, to delete all this text: click on \&quot;RECAPULATR ==&gt;\&quot; in the upper left corner.\n                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n\nIf colors are distructing - you can switch it on\/off. Also you can switch between a few dark and bright themes.\n\nLine numbering is added for easy ref.\n\nALL YOUR TEXT IS NOT SENT ANYWHERE, ALL THE HIGHLIGHTING IS BEING DONE ON CLIENT SIDE - I.E. BY YOUR OWN PC IN YOUR OWN WEB-BROUSER WITHOUT SENDING. \n\n\nCARGO QUANTITY: CHOPT FULL CARGO \nGRADE(S): 1-2 GRADES GASOIL \/ ULSD UND 2.5 NPA \nHEAT: N\/A\nINTAKES: OWNERS WARRANT VESSELS\' MIN INTAKE IS BLA-BLA-BLA MTS GASOIL BASIS MIN SG 0.84 AT 15 DEG C.\n\nLOADING  : 1 SPB BSEA\n%%%COUNTER%%%\nDISCHARGE: 1 SPB USAC\/USG, OR IN CHOPT \n           1 SPB MED\n \nFREIGHT:   USD BIZILLION LUMPSUM 1-1\n \nLAYCAN:    BLA-BLA-BLA 2013 00:01-23:59 \n \nLAYTIME:   72HRS TOTAL SHINC \n \nDEMURRAGE: USD BLA-BLA-BLA PDPR\n \nAGENTS:    CHARTERERS AGENTS BOTH ENDS PROVIDED COMPETITIVE';

    /*

        _.myVarAE = _.heredoc( function() {
    %%%OFFER%%%
      Paste your recap here, it will highlight some important words like 'deduct', 'risk', 'freight', 'chrtrs', 'insert', 'delete', USD 1 000 000 PMT etc. etc. for your convenience and quicker reading. You can use it for a very quick glance on your CP/recap (pls feel free to send me email if want to add more keywords to the highlighing dictionary).

    Example below, to delete all this text: click on &quot;RECAPULATR ==&gt;&quot; in the upper left corner.
                                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    If colors are distructing - you can switch it on/off. Also you can switch between a few dark and bright themes.

    Line numbering is added for easy ref.

    ALL YOUR TEXT IS NOT SENT ANYWHERE, ALL THE HIGHLIGHTING IS BEING DONE ON CLIENT SIDE - I.E. BY YOUR OWN PC IN YOUR OWN WEB-BROUSER WITHOUT SENDING. 


    CARGO QUANTITY: CHOPT FULL CARGO 
    GRADE(S): 1-2 GRADES GASOIL / ULSD UND 2.5 NPA 
    HEAT: N/A
    INTAKES: OWNERS WARRANT VESSELS' MIN INTAKE IS BLA-BLA-BLA MTS GASOIL BASIS MIN SG 0.84 AT 15 DEG C.

    LOADING  : 1 SPB BSEA
    %%%COUNTER%%%
    DISCHARGE: 111111111111
    FREIGHT:   111111111
    LAYCAN:    11111111
    LAYTIME:   222222222
    DEMURRAGE: 222222222
    AGENTS:    222222222
    %%%COUNTER%%%
    DISCHARGE: YYYYYYYYYYYYY
    FREIGHT:   YYYYYYYYYYYY
    LAYCAN:    YYYYYYYYYYYY
    dfdsfsdf
    sdfdssdf
    %%%COUNTER%%%
    SDFDSDFSDFFDS
    DSFDSFDSFDSDFS
    DFSDFDFSSDF
    DSSDFDFSDFS
    %%%COUNTER%%%
    111112
    222222
    333333
    %%%COUNTER%%%
    444444
    555555
    %%%COUNTER%%%
    666666
            } );

    */

    //var ret_droppable;
    //var ret_sortable;
    //var _.roundCurrent = 0;


    /*var circa = (function() {
       var lastStatus = "info";
       return function() {
          return "danger";
       }
    })();*/

    /*
                                                                                                                                   
                                                                                                                                   
                                                                    tttt            iiii                                           
                                                                 ttt:::t           i::::i                                          
                                                                 t:::::t            iiii                                           
                                                                 t:::::t                                                           
    rrrrr   rrrrrrrrr   aaaaaaaaaaaaa      ccccccccccccccccttttttt:::::ttttttt    iiiiiiivvvvvvv           vvvvvvv eeeeeeeeeeee    
    r::::rrr:::::::::r  a::::::::::::a   cc:::::::::::::::ct:::::::::::::::::t    i:::::i v:::::v         v:::::vee::::::::::::ee  
    r:::::::::::::::::r aaaaaaaaa:::::a c:::::::::::::::::ct:::::::::::::::::t     i::::i  v:::::v       v:::::ve::::::eeeee:::::ee
    rr::::::rrrrr::::::r         a::::ac:::::::cccccc:::::ctttttt:::::::tttttt     i::::i   v:::::v     v:::::ve::::::e     e:::::e
     r:::::r     r:::::r  aaaaaaa:::::ac::::::c     ccccccc      t:::::t           i::::i    v:::::v   v:::::v e:::::::eeeee::::::e
     r:::::r     rrrrrrraa::::::::::::ac:::::c                   t:::::t           i::::i     v:::::v v:::::v  e:::::::::::::::::e 
     r:::::r           a::::aaaa::::::ac:::::c                   t:::::t           i::::i      v:::::v:::::v   e::::::eeeeeeeeeee  
     r:::::r          a::::a    a:::::ac::::::c     ccccccc      t:::::t    tttttt i::::i       v:::::::::v    e:::::::e           
     r:::::r          a::::a    a:::::ac:::::::cccccc:::::c      t::::::tttt:::::ti::::::i       v:::::::v     e::::::::e          
     r:::::r          a:::::aaaa::::::a c:::::::::::::::::c      tt::::::::::::::ti::::::i        v:::::v       e::::::::eeeeeeee  
     r:::::r           a::::::::::aa:::a cc:::::::::::::::c        tt:::::::::::tti::::::i         v:::v         ee:::::::::::::e  
     rrrrrrr            aaaaaaaaaa  aaaa   cccccccccccccccc          ttttttttttt  iiiiiiii          vvv            eeeeeeeeeeeeee  
                                                                                                                                   
                                                                                                                                   
                                                                                                                                   
                                                                                                                                   
                                                                                                                                   
                                                                                                                                   
                                                                                                                                   

    */

    /*var jsButtons = new Ractive({
          el: '#htmlButtons',
          template: '#templateButtons',
          data: { status: 'VIEWER' }
        });*/

    _.jsBody = new Ractive( {
        el: '#htmlBody',
        template: '#templateBody',
        data: {
            status: 'VIEWER',
            counterLines: _.counter_array[ _.roundCurrent ],
            counterLabels: function( i ) {
                i = i
                    .replace( /<span hidden>/, "" )
                    .replace( /<\/span>/, "" );
                return _.counter_array[ _.roundCurrent ]
                        .show_label( _.counter_array[ _.roundCurrent ]
                        .find_line( i ) )
            },
            recapLines: _.recap_array,
            recapLabels: function( i ) {
                if ( !( i instanceof Array ) ) {
                    i = i
                        .replace( /<span hidden>/, "" )
                        .replace( /<\/span>/, "" );
                    var no = _.recap_array.find_line( i );
                    return _.recap_array.show_label( no )
                } else {
                    i = i[ 0 ]
                        .replace( /<span hidden>/, "" )
                        .replace( /<\/span>/, "" );
                    var no = _.recap_array.find_line( i );
                    return _.recap_array.show_label( no )
                }
            },
            addColor: ( function() {
                var lastStatus = "info"
                return function() {
                    if ( lastStatus === "info" ) {
                        lastStatus = "danger";
                        return lastStatus
                    }
                    if ( lastStatus === "danger" ) {
                        lastStatus = "success";
                        return lastStatus
                    }
                    if ( lastStatus === "success" ) {
                        lastStatus = "warning";
                        return lastStatus
                    }
                    if ( lastStatus === "warning" ) {
                        lastStatus = "info";
                        return lastStatus
                    }
                }
            } )()
        }
    } );

    /*
                                                                                                                                     
                dddddddd                                                                                                             
                d::::::d                                                        FFFFFFFFFFFFFFFFFFFFFF                               
                d::::::d                                                        F::::::::::::::::::::F                               
                d::::::d                                                        F::::::::::::::::::::F                               
                d:::::d                                                         FF::::::FFFFFFFFF::::F                               
        ddddddddd:::::drrrrr   rrrrrrrrr      ooooooooooo   ppppp   ppppppppp     F:::::F       FFFFFFnnnn  nnnnnnnn                 
      dd::::::::::::::dr::::rrr:::::::::r   oo:::::::::::oo p::::ppp:::::::::p    F:::::F             n:::nn::::::::nn        :::::: 
     d::::::::::::::::dr:::::::::::::::::r o:::::::::::::::op:::::::::::::::::p   F::::::FFFFFFFFFF   n::::::::::::::nn       :::::: 
    d:::::::ddddd:::::drr::::::rrrrr::::::ro:::::ooooo:::::opp::::::ppppp::::::p  F:::::::::::::::F   nn:::::::::::::::n      :::::: 
    d::::::d    d:::::d r:::::r     r:::::ro::::o     o::::o p:::::p     p:::::p  F:::::::::::::::F     n:::::nnnn:::::n             
    d:::::d     d:::::d r:::::r     rrrrrrro::::o     o::::o p:::::p     p:::::p  F::::::FFFFFFFFFF     n::::n    n::::n             
    d:::::d     d:::::d r:::::r            o::::o     o::::o p:::::p     p:::::p  F:::::F               n::::n    n::::n             
    d:::::d     d:::::d r:::::r            o::::o     o::::o p:::::p    p::::::p  F:::::F               n::::n    n::::n      :::::: 
    d::::::ddddd::::::ddr:::::r            o:::::ooooo:::::o p:::::ppppp:::::::pFF:::::::FF             n::::n    n::::n      :::::: 
     d:::::::::::::::::dr:::::r            o:::::::::::::::o p::::::::::::::::p F::::::::FF             n::::n    n::::n      :::::: 
      d:::::::::ddd::::dr:::::r             oo:::::::::::oo  p::::::::::::::pp  F::::::::FF             n::::n    n::::n             
       ddddddddd   dddddrrrrrrr               ooooooooooo    p::::::pppppppp    FFFFFFFFFFF             nnnnnn    nnnnnn             
                                                             p:::::p                                                                 
                                                             p:::::p                                                                 
                                                            p:::::::p                                                                
                                                            p:::::::p                                                                
                                                            p:::::::p                                                                
                                                            ppppppppp                                                                
                                                                                                                                     

    */

    //needed for jQuery draggable and droppable
    _.dropFn = {
        accept: '#sortable li',
        tolerance: 'pointer',
        greedy: true,
        //helper: 'clone',
        //hoverClass: 'ui-state-active',
        //addClasses: false,
        drop: function( e, ui ) {
            if ( !$( this ).parent( 'li' ).hasClass( 'disabled' ) 
                    && ( !$( '#sortable li' ).hasClass( 'ui-draggable-disabled' ) ) 
                    && !$( this ).hasClass( 'nodrop' ) ) {
                if ( _.recap_array.icounteredQ( ( _.recap_array.find_line( $( this ).text() ) ) ) ) {             //if after leaving to VIEWER and returning back to AE
                    toastr.error('Easy, tiger! You have already countered this line.');
                    return false
                }
                if ( ui.draggable.text().replace( /##\d+##$/, ' ' ).trim() === _.SOFT_DELETE 
                        || ui.draggable.text().replace( /##\d+##$/, ' ' ).trim() === _.HARD_DELETE.trim() )  {
                    ui.draggable.removeAttr( 'style' );
                    $( this ).replaceWith( ui.draggable.clone() );
                    //$( this )
                } else {
                    $( this ).replaceWith( ui.draggable )
                }
                _.recap_array.counterRecap( $( this ).text(), ui.draggable.text() )
            }
        },

        over: function( e, ui ) {
            if ( !$( this ).parent( 'li' ).hasClass( 'disabled' ) 
                    && ( !$( '#sortable li' ).hasClass( 'ui-draggable-disabled' ) ) 
                    && !$( this ).hasClass( 'nodrop' ) ) {
                $( this ).filter( 'ul li' ).css( { backgroundColor: '#CCFF99' } )
            }
        },

        out: function() {
            $( this ).filter( 'ul li' ).css( { backgroundColor: '' } );
        }
    }; //end of DropFn




    /*function submitRecap() {
        document.getElementById( '_.editor' ).setAttribute( 'hidden', 'true' );
        document.getElementById( 'menuRecap' ).style.display = "none";
        document.getElementById( 'menuAE' ).style.display = "inline-block"

        _.read_ace();
        redrawRecap();

    };*/



    //});


    /*
                                                                                                                                                                   
                                                                                                                                                                   
        ffffffffffffffff                                                                 tttt            iiii                                                      
       f::::::::::::::::f                                                             ttt:::t           i::::i                                                     
      f::::::::::::::::::f                                                            t:::::t            iiii                                                      
      f::::::fffffff:::::f                                                            t:::::t                                                                      
      f:::::f       ffffffuuuuuu    uuuuuunnnn  nnnnnnnn        ccccccccccccccccttttttt:::::ttttttt    iiiiiii    ooooooooooo   nnnn  nnnnnnnn        ssssssssss   
      f:::::f             u::::u    u::::un:::nn::::::::nn    cc:::::::::::::::ct:::::::::::::::::t    i:::::i  oo:::::::::::oo n:::nn::::::::nn    ss::::::::::s  
     f:::::::ffffff       u::::u    u::::un::::::::::::::nn  c:::::::::::::::::ct:::::::::::::::::t     i::::i o:::::::::::::::on::::::::::::::nn ss:::::::::::::s 
     f::::::::::::f       u::::u    u::::unn:::::::::::::::nc:::::::cccccc:::::ctttttt:::::::tttttt     i::::i o:::::ooooo:::::onn:::::::::::::::ns::::::ssss:::::s
     f::::::::::::f       u::::u    u::::u  n:::::nnnn:::::nc::::::c     ccccccc      t:::::t           i::::i o::::o     o::::o  n:::::nnnn:::::n s:::::s  ssssss 
     f:::::::ffffff       u::::u    u::::u  n::::n    n::::nc:::::c                   t:::::t           i::::i o::::o     o::::o  n::::n    n::::n   s::::::s      
      f:::::f             u::::u    u::::u  n::::n    n::::nc:::::c                   t:::::t           i::::i o::::o     o::::o  n::::n    n::::n      s::::::s   
      f:::::f             u:::::uuuu:::::u  n::::n    n::::nc::::::c     ccccccc      t:::::t    tttttt i::::i o::::o     o::::o  n::::n    n::::nssssss   s:::::s 
     f:::::::f            u:::::::::::::::uun::::n    n::::nc:::::::cccccc:::::c      t::::::tttt:::::ti::::::io:::::ooooo:::::o  n::::n    n::::ns:::::ssss::::::s
     f:::::::f             u:::::::::::::::un::::n    n::::n c:::::::::::::::::c      tt::::::::::::::ti::::::io:::::::::::::::o  n::::n    n::::ns::::::::::::::s 
     f:::::::f              uu::::::::uu:::un::::n    n::::n  cc:::::::::::::::c        tt:::::::::::tti::::::i oo:::::::::::oo   n::::n    n::::n s:::::::::::ss  
     fffffffff                uuuuuuuu  uuuunnnnnn    nnnnnn    cccccccccccccccc          ttttttttttt  iiiiiiii   ooooooooooo     nnnnnn    nnnnnn  sssssssssss    
                                                                                                                                                                   
                                                                                                                                                                   
                                                                                                                                                                   
                                                                                                                                                                   
                                                                                                                                                                   
                                                                                                                                                                   
                                                                                                                                                                   

    */



    /*function cleanArray(inArray){
      var newArray;
      for(var i = 0, len = actual.length; i < len; i++) {
          if (actual[i]) return newArray
      }
    }*/





    // //DONE: add_line: if NBR exist - shift all the array


   
  //});


    _.editor = ace.edit( "editor" );
    //window['_.editor'] = ace.edit( "_.editor" );
    _.theme = 'ace/theme/monokai';
    _.mode = 'ace/mode/myxa';
    _.fontsz = 14;

 // $( document ).ready( function() {

    SocialShareKit.init();

    _.editor.setTheme( _.theme );
    _.editor.getSession().setMode( _.mode );
    _.editor.getSession().setTabSize( 2 );
    _.editor.getSession().setUseWrapMode( true );
    _.editor.setOptions( { fontSize: _.fontsz } );
    _.editor.session.setValue( _.myVarRecap[ 0 ] );

   /* window['SocialShareKit'] = {};
    window['SocialShareKit']['init'] = SocialShareKit.init;

    //window['_.editor'] = {};
    //window['ace'] = {};
    //window['ace']['edit'] = ace.edit;
    window['_.editor']['setTheme'] = _.editor.setTheme;
    window['_.editor']['getSession'] = {};
    window['_.editor']['getSession']['setMode'] = _.editor.getSession.setMode;
    window['_.editor']['getSession']['setTabSize'] = _.editor.getSession.setTabSize;
    window['_.editor']['getSession']['setUseWrapMode'] = _.editor.getSession.setUseWrapMode;
    window['_.editor']['setOptions'] = _.editor.setOptions;
    window['_.editor']['session'] = {};
    window['_.editor']['session']['setValue'] = _.editor.session.setValue;
*/
/*    _.editor.getSession().setTabSize( 2 );
    _.editor.getSession().setUseWrapMode( true );
    _.editor.setOptions( { fontSize: fontsz } );
    _.editor.session.setValue( _.myVarRecap[ 0 ] );*/

    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-bottom-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "10000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    //window['toastr'] = {};
    //window['toastr']['options'] = toastr.options;
    //window['toastr']['success'] = toastr.success;

    
    _.onclickAE();

    $( "#highlightText" ).change( function() {
      var $input = $( this );
      if ( $input.is(":checked" ) ) {
        _.editor.getSession().setMode( 'ace/mode/myxa' );
      } else {
        _.editor.getSession().setMode( 'ace/mode/text' );
      }
    }).change();


    $( ".navbar-nav li" ).on('click',function() { 
      $( ".navbar-nav li" ).removeClass( 'active' );
      $( this ).addClass( 'active' );
    });

    toastr.success( 'press HAPPY FIXINGFRIDAY ==> to reset the text inside the text box' );
    setTimeout( function() { toastr.options.timeOut = 20000;toastr.success( 'after you insert the initial offer and all the next counters press "Submit" to start creating your recap' ) }, 4000 );
    


//} )();
