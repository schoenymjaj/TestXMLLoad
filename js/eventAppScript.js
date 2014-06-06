/* Localstorage
localStorage["LBXMLDoc"] - Leaderboard XML Doc
localStorage["LBJSONDoc"] - Leaderboard JSON Doc
localStorage["TRNXMLDoc"] - Tournament XML Doc
localStorage["SCRDXMLDoc"] - Scorecards XML Doc
localStorage["PRNGXMLDoc"] - Pairing XML Doc
localStorage["CRSEXMLDoc"] - Course XML Doc
*/

/*
JavaScript object to support load data configuration
*/
DataConfigObj = function (LBXMLInd, LBJSONInd, TRNXMLInd, SCRDXMLInd, PRNGXMLInd) {
    this.LeaderXMLInd = LBXMLInd;
    this.LeaderJSONInd = LBJSONInd;
    this.TournXMLInd = TRNXMLInd;
    this.SCRDXMLInd = SCRDXMLInd;
    this.PRNGXMLInd = PRNGXMLInd;
}
/*
Converts XML text and returns an XML document
*/
StringtoXML = function (text) {
    console.log('func StringtoXML');
    if (window.ActiveXObject) {
        var doc = new ActiveXObject('Microsoft.XMLDOM');
        doc.async = 'false';
        doc.loadXML(text);
    } else {
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'text/xml');
    }
    return doc;
}

/*
Var to determine mobile device
*/
var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

/*
display error page
*/
function handleAppError(msg, url, line) {
    console.log('func handleAppError');
    console.log('msg:' + msg);
    console.log('url:' + url);
    console.log('line:' + line);
    page = '<section id="errorpage" data-role="page" data-title="Error Page" data-theme="h">\
              <div data-role="header">\
                  <h1>Error Page</h1>\
              </div>\
              <article data-role="content">\
                <h3>Error Message</h3>\
                MSG\
                <h3>URL of Script</h3>\
                URLL\
                <h3>Line</h3>\
                LINE\
              </article>\
           </section>';

    var newPage = $(page);
    newPage.html(function (index, old) {
        return old
                .replace(/MSG/g, msg)
                .replace(/URLL/g, url)
                .replace(/LINE/g, line)
    }).appendTo($.mobile.pageContainer);
    $.mobile.changePage(newPage);

} //function handleAppError(msg, url, line) {
/*
Windows handler of all errors
*/
window.onerror = function (msg, url, line) {
    console.log('func oneerror');
    handleAppError(msg, url, line);
}

/*
This function executes after the following events
pagebeforechange, pagebeforecreate, pagecreate, 
pageinit, pagebeforeshow, pageshow, pagechange
note: document ready occurs after all these.
*/
$(function () {

    /*
    document ready event
    Start the XMLHttpRequest (download xml and jason files) 
    when document ready event is triggered. Store documents in localStorage
    */
    $(document).on("ready", function (event) {  //jquery document ready event gets you jquery mobile styles, and data rendered
        console.log('event doc ready');

        //override the console.log if production (disable console)
        $(function () {
            if ($('body').data('env') == 'production') {
                console.log = function () { };
            }
        });

        $('#loadXML').tap(function () {
            event.preventDefault();
            loadAll();
        });

        loadAll();

    });


    loadAll = function () {
        //loadXML('./data/leaderboards.xml');

        loadXML('./data/tournament.xml');

        //loadXML('./data/scorecards.xml');

        //loadXML('./data/pairings.xml');

        //loadXML('./data/course.xml');
    };

    /*
    doesn't load leaderboard XML onto itself. It initiaties the loading
    Note: the request.onreadystatechange event loads into LocalStorage
    */
    loadXML = function (filepath) {
        console.log('func loadXML');

        $.get(filepath, {}, function (xml) {

            xmlText = (new XMLSerializer()).serializeToString(xml);
            console.log('loaded filepath:' + xmlText.substr(0, 50));

            switch (filepath) {
                case "./data/leaderboards.xml":
                    localStorage["LBXMLDoc"] = xmlText;
                    break;
                case "./data/tournament.xml":
                    localStorage["TRNXMLDoc"] = xmlText;

                    /*debug statements */
                    xmlAgain = appPropDoc("TRNXMLDoc");
                    console.log(xmlAgain.documentElement.childNodes[1]);
                    console.log('childNodes[1]:' + xmlAgain.documentElement.innerHTML);
                    console.log('childNodes[1]:' + xmlAgain.documentElement.childNodes[1].innerHTML);
                    console.log('Tag - Round:' + xmlAgain.getElementsByTagName("Round"));
                    console.log('Node List Length:' + xmlAgain.getElementsByTagName("Round").length);

                    break;
                case "./data/scorecards.xml":
                    localStorage["SCRDXMLDoc"] = xmlText;
                    break;
                case "./data/pairings.xml":
                    localStorage["PRNGXMLDoc"] = xmlText;
                    break;
                case "./data/course.xml":
                    localStorage["CRSEXMLDoc"] = xmlText;
                    break;
                default:
                    alert('Unexpected XML doc to load - Type: ' + filepath);
                    break;

            } //switch(filepath)
            console.log('loadXML:' + filepath);

        });

    }; //loadXML = function (filepath) {

    /*
    returns app property
    */
    appProp = function (propName) {
        console.log('func appProp:' + propName);

        var propDefault = {
            "Config-LB-XML-Ind": true, "Config-LB-JSON-Ind": true, "Config-TRN-XML-Ind": true,
            "Config-SCRD-XML-Ind": true, "Config-PRNG-XML-Ind": true, "Config-CRSE-XML-Ind": true,
            "Config-ThemeLetter": "h", "Config-MaxList-Nbr": 100,
            "Config-JQMGridStyle": "{'Leaderboard' : 'jqmList-small', 'Pairings' : 'jqmGrid', 'Scorecard' : 'jqmGrid', 'ScorecardDetail' : 'jqmGrid', 'Tournament' : 'jqmGrid'}",
            "Config-JQMGridHeaderStyle": "default",
            "Config-TextFont-Size": 100
        };

        if (localStorage[propName] != undefined && localStorage[propName] != "undefined") {

            if (localStorage[propName] == "true") { //if boolean true
                return true;
            } else if (localStorage[propName] == "false") { //if boolean false
                return false;
            } else {
                return localStorage[propName]; //if not boolean
            }

        } else { //if undefined
            return propDefault[propName];  //default value
        }
    }

    /*
    returns app document (xml or jason) property
    */
    appPropDoc = function (docName) {
        console.log('func appPropDoc:' + docName);

        var propDocDefault = {
            "LBXMLDoc": undefined, "LBJSONDoc": undefined, "TRNXMLDoc": undefined, "SCRDXMLDoc": undefined, "PRNGXMLDoc": undefined, "CRSEXMLDoc": undefined
        };

        if (localStorage[docName] != undefined) {
            if (docName.substring(docName.length - 7, docName.length) == "JSONDoc") {
                //JSON DOC
                return JSON.parse(localStorage[docName]);
            } else {
                //XML Doc
                return StringtoXML(localStorage[docName]);
            }
        } else {
            return propDocDefault[docName];
        }
    }

});


