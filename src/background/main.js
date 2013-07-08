  window.Netflix = window.Netflix || {}

Netflix.callbacks = {
  'mocha_load_css': function(sender, reply)
  {
    chrome.tabs.insertCSS(sender.tab.id, {file: ('components/mocha/mocha.css')})
  },

  'filters.get_ratings': function(sender, reply)
  {
   var data = {}
    _.each(Netflix.Ratings.Importer.data, function(v, k)
    {
      data[k] = JSON.parse(localStorage[k])
    })

    reply(data)
  }
}



chrome.runtime.onMessage.addListener(function(msg, sender, reply)
{
  if(_.has(Netflix.callbacks, msg))
  {
    Netflix.callbacks[msg](sender, reply)
  }
})


function main()
{
  // importer init
  Netflix.Ratings.Importer.init()
}


main()