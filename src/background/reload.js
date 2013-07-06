// reload on changes
var Extension = {
    version: null,
    // switch to 'dev' to enable reload on file changes
  /**
   * modes:
   * - prod : production
   * - dev : reloads on changes
   * - test : executes tests based on which page you're on
   */
    mode: 'prod'
//    mode: 'test'
}

function reloadExtension()
{
    $.ajax('/version.txt?b=' + (+new Date())).done(function(txt) {
        if(Extension.version === null)
        {
            Extension.version = txt;
        }
        else if(Extension.version < txt)
        {
            chrome.runtime.reload()
        }
    })
}

if(_.contains(['dev', 'test'], Extension.mode) && window.isBackgroundPage)
{
    setInterval(reloadExtension, 500)
    chrome.tabs.reload()
}

