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

    if (typeof msg == 'object') {
        alert ('onerror handled an error with message an Object')
    } else {
        handleAppError(msg, url, line);
    }
}



