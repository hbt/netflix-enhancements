  window.Netflix = window.Netflix || {}

Netflix.callbacks = {

  /**
   * inserts mocha css during tests
   * @param sender
   * @param reply
   */
  'mocha_load_css': function(sender, reply)
  {
    chrome.tabs.insertCSS(sender.tab.id, {file: ('components/mocha/mocha.css')})
  },

  /**
   * sends ratings for filtering
   *
   * // Note(hbt) could be improved to send them whenever they are updated
   *
   * @param sender
   * @param reply
   */
  'filters.get_ratings': function(sender, reply)
  {
   var data = {}
    _.each(Netflix.Ratings.Importer.data, function(v, k)
    {
      data[k] = JSON.parse(localStorage[k])
    })

    reply(data)
  },


  /**
   * saves a rating -- used when clicking rating buttons
   * @param params
   * @param sender
   * @param reply
   */
  'ratings.add': function(params, sender, reply)
  {
    var ratings = JSON.parse(localStorage['ratings']) || {}
    ratings[params.id] = {rating: params.rating}
    localStorage['ratings'] = JSON.stringify(ratings)

    if(params.rating === -1)
    {
      var coll = JSON.parse(localStorage['not_interested_ids']) || {}
      coll.push(params.id)
      localStorage['not_interested_ids'] = JSON.stringify(_.unique(coll))
    }
    else
    {
      var coll = JSON.parse(localStorage['rated_ids']) || {}
      coll.push(params.id)
      localStorage['rated_ids'] = JSON.stringify(_.unique(coll))

    }
  }
}



chrome.runtime.onMessage.addListener(function(message, sender, reply)
{
  // handles strings and objects as valid messages
  var msg = message

  if(!_.isString(message) && _.isString(message.msg))
  {
    msg = message.msg
  }

  // execute callback
  if(_.has(Netflix.callbacks, msg))
  {
    if(message.params)
    {
      Netflix.callbacks[msg](message.params, sender, reply)
    }
    else
    {
      Netflix.callbacks[msg](sender, reply)
    }
  }
})


function main()
{
  // importer init
  Netflix.Ratings.Importer.init()
}


main()