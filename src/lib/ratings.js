window.Netflix = window.Netflix || {}

Netflix.Ratings = (function()
{
  var exports = {

    ratings: {
      rv1:     1,
      rv2:     2,
      rv3:     3,
      rv4:     4,
      rv5:     5,
      rvnorec: -1
    },

    /**
     * called when clicking buttons
     * @param e
     */
    rateAction: function(e)
    {
      var el = $(e.target)


      // find the class name + determine the rating
      _.each(_.keys(exports.ratings), function(key)
      {
        if(el.hasClass(key))
        {
          var rating = exports.ratings[key]

          // find movieId
          var href = el.attr('href')
          var movieId = parseInt(/\d+/.exec(href.substring(href.indexOf('widgetid=')))[0])

          // update rating in the background
          chrome.runtime.sendMessage({
            msg:    'ratings.add',
            params: {
              rating: rating,
              id:     movieId
            }
          })
        }
      })

    },


    updateListeners: function()
    {
      var classes = _.map(_.keys(exports.ratings),function(v)
      {
        return '.' + v
      }).join(',')

      // unbind first
      $(classes).unbind('click')

      // bind
      $(classes).on('click', exports.rateAction)
    },


    init: function()
    {
      // set listeners
      this.updateListeners()

      // when dom changes, update listeners -- used for bubbles on list page
      $(document).bind('DOMSubtreeModified', this.updateListeners)
    }
  }

  return exports
})()

