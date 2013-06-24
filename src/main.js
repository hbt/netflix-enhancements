var Netflix = (function()
{
  /**
   * netflix stores a copy of the rendered page in the local storage and could interfere with plugin manipulating the
   * wrong data
   */
  var Cache = {

    cleared: false,

    clear: function()
    {
      if(Cache.cleared)
      {
        return;
      }

      _.each(localStorage, function(k, index)
      {
        var key = localStorage.key(index)
        if(key && key.indexOf('autoLoad') !== -1)
        {
          localStorage.removeItem(key)
          Cache.cleared = true
        }
      })
    }
  }

  var Posters = {

    // cached nb links for comparison
    nbLinks: 0,

    /**
     * replace urls of posters to point to movie page instead of player
     */
    replaceUrls: function()
    {
      var links = $('.playLink')

      // any new links?
      if(links.length > 0 && links.length !== Posters.nbLinks)
      {
        Posters.nbLinks = links.length

        _.each(links, function(link)
        {
          var link = $(link)
          link.removeClass('playLink')

          // movie page instead of player
          var href = link.attr('href')
          href = href.replace('WiPlayer?movieid=', 'WiMovie/')
          href = href.substring(0, href.indexOf('&'))

          link.attr('href', href)
        })
      }
    }
  }


  return {
    init: function()
    {
      // clear cache
      Cache.clear()

      // watch dom
      $(document).bind('DOMSubtreeModified',function(){
        Posters.replaceUrls()
      })
    }
  }
}())


$(document).ready(function()
{
  // init
  window.setTimeout(Netflix.init, 500)
})
