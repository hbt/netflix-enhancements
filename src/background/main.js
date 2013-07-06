chrome.runtime.onMessage.addListener(function(data, sender, reply)
{
  if(data === 'mocha_load_css')
  {
    chrome.tabs.insertCSS(sender.tab.id, {file: ('components/mocha/mocha.css')})
  }
})


function main()
{
  // importer init
  Netflix.Ratings.Importer.init()
}


main()