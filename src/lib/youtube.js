window.Netflix = window.Netflix || {}

var Youtube = {
  init: function()
  {
    if(window.location.href.toLowerCase().indexOf('wimovie') !== -1)
    {
      // extract title
      var title = $('.title').html()
      if($('.origTitle').length)
      {
        // use original title if present
        title = $('.origTitle').html()
        title = title.substring(1, title.length-1)
      }

      // youtube query
      var query = title + ' trailer'
      var div = $('<div>', {
        html: '<a href="http://www.youtube.com/results?search_query=' + query + '" target="_blank">Youtube Trailer</a>'
      })

      // append to dom
      $('.actions').append(div)
    }
  }
}

Netflix.Youtube = Youtube