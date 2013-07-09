window.Netflix = window.Netflix || {}

Netflix.Filters = (function()
{
  var Filters = {
    // Note(hbt) ratings will update on reload -- could be improved by notifying all the tabs after a successful import is done
    // comes from /src/background/ratings.js:6
    data: {},

    toggle: function()
    {
      // checked filters
      var frated = $('.filter-rated').is(':checked')
      var fnotinterested = $('.filter-not-interested').is(':checked')

      // movie posters
      $('.agMovie').each(function(k, v)
      {
        var id = /\d+/.exec($(v).children().first().attr('id'))
        if(!id)
        {
          return;
        }
        id = parseInt(id[0])

        // filter out rated by hiding or displaying poster
        var rated = _.contains(Filters.data['rated_ids'], id)
        if(rated)
        {
          if(frated)
          {
            $(v).css('display', 'none')
          }
          else
          {
            $(v).css('display', '')
          }
        }


        // filter out not interested by hiding or displaying poster
        var notinterested = _.contains(Filters.data['not_interested_ids'], id)
        if(notinterested)
        {
          if(fnotinterested)
          {
            $(v).css('display', 'none')
          }
          else
          {
            $(v).css('display', '')
          }
        }
      })
    },

    boot: function()
    {
      // Note(hbt) extract this html code into a template file if it gets any complicated
      var html = '<div>'
      html += '<label for="filter-rated">Filter out Rated</label> <input name="filter-rated" type="checkbox" class="filters filter-rated" checked/>'
      html += '<label for="filter-not-interested">Filter out Not Interested</label> <input name="filter-not-interested" type="checkbox" class="filters filter-not-interested" checked/>'


      // append to dom
      var div = $('<div>', {html: html})
      $('.control').append(div)

      // listeners
      $('.filters').on('click', Filters.toggle)
      $(document).bind('DOMSubtreeModified', Filters.toggle)
    },

    init: function()
    {
      chrome.runtime.sendMessage('filters.get_ratings', function(data)
      {
        Filters.data = data

        Filters.boot()
      })
    }
  }

  return Filters

})()


