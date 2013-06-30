window.Netflix = window.Netflix || {}

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
        link.addClass('moviePageLink');

        // movie page instead of player
        var href = link.attr('href')
        href = href.replace('WiPlayer?movieid=', 'WiMovie/')
        href = href.substring(0, href.indexOf('&'))

        link.attr('href', href)
      })
    }
  },

  init: function()
  {
    Posters.replaceUrls()

    // watch dom
    $(document).bind('DOMSubtreeModified', Posters.replaceUrls)
  }
}

Netflix.Posters = Posters