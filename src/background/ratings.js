window.Netflix = window.Netflix || {}
window.Netflix.Ratings = window.Netflix.Ratings || {}

var Importer = {

  data: {
    'ratings':            {},
    'rated_ids':          [],
    'not_interested_ids': []
  },

  url: 'http://movies.netflix.com/MoviesYouveSeen',

  /**
   * every 15m check http://movies.netflix.com/MoviesYouveSeen for the number of ratings
   * if it is less than what we have stored then we've rated new stuff since
   * in which case, import the ratings
   *
   * 15m is chosen because netflix caches the results of that page http://movies.netflix.com/MoviesYouveSeen
   */
  Updater: {
    // 15m wait for netflix cache on ratings page
    waitingPeriod:    900,
    // indicates if we are importing or not
    updateInProgress: false,
    // every 9ecs
    interval:         9000,

    /**
     * runs import if needed
     */
    update: function()
    {
      $.ajax(Importer.url).done(function(html)
      {
        {
          // extract nb rated movies
          var html = jQuery(html)
          var content = html.find('#mylBlurb').html()
          var nbMovies = parseInt(/\d+/.exec(content)[0])

          var ratings = JSON.parse(localStorage['ratings']) || {}

          // need to import?
          if(nbMovies > _.keys(ratings).length)
          {
            Importer.import()
          }
        }
      })
    },

    /**
     * runs update if needed
     */
    check: function()
    {
      // has it been 15mins?
      var currentTime = +new Date()
      var lastTime = localStorage['ratings-last-check'] || 0
      var diff = (currentTime - lastTime) / 1000


      if(diff > Importer.Updater.waitingPeriod)
      {
        localStorage['ratings-last-check'] = currentTime

        Importer.Updater.update()
      }
    },

    init: function()
    {
      window.setInterval(Importer.Updater.check, Importer.Updater.interval)
    }
  },

  Pagination: {
    stopPaginating: false,
    intervalId:     -1,
    pageIndex:      0,

    interval: 1000,

    /**
     * resets values before/after pagination
     */
    reset: function()
    {
      this.stopPaginating = false
      this.intervalId = -1
      this.pageIndex = 0

      Importer.data.ratings = {}
      Importer.data.rated_ids = []
      Importer.data.not_interested_ids = []
    },

    importNextPage: function()
    {
      var self = Importer.Pagination

      // Note(hbt) although requests are made via ajax, as long as the interval is long enough, we should not have
      // cases where old requests have not been processed yet and the latest new one marks them as "done" when they are not done

      // done paginating?
      if(self.stopPaginating)
      {
        Importer.Updater.updateInProgress = false

        // stop interval
        window.clearInterval(self.intervalId)
        self.reset()

        return;
      }


      // increment page
      self.pageIndex++

      // url
      var url = Importer.url + "?pn=" + self.pageIndex + "&so=0&st=tt";


      // ajax
      $.ajax(url).done(function(html)
      {
        var html = jQuery(html)
        if(html.find('.agMovie').length)
        {
          html.find('.agMovie').each(function(index, row)
          {
            var data = Importer.Page.extractData(row)

            Importer.data.ratings[data.id] = data
            if(data.rating > 0)
            {
              Importer.data.rated_ids.push(data.id)
              Importer.data.rated_ids = _.unique(Importer.data.rated_ids)
            }
            else
            {
              Importer.data.not_interested_ids.push(data.id)
              Importer.data.not_interested_ids = _.unique(Importer.data.not_interested_ids)
            }

            // save
            _.each(Importer.data, function(v, k)
            {
              localStorage[k] = JSON.stringify(v)
            })
          })
        }
        else
        {
          // is empty? -- stop paginating
          self.stopPaginating = true
        }
      })

    }

  },

  Page: {

    /**
     * given a row from the ratings page
     * extract the data
     *
     * - id
     * - title
     * - rating
     *
     * @param row
     * @returns {{}}
     */
    extractData: function(row)
    {
      var ret = {}

      var $row = $(row)
      var id = $row.find('.title > :first-child').attr('id')
      id = /\d+/.exec(id)[0]

      var title = $(row).find('.title > :first-child').html()

      var rating = $(row).find('.stbrMaskFg').html()
      if(rating.toLowerCase().indexOf('average') === -1)
      {
        // actual rating
        rating = /\d+/.exec(rating)[0]
      }
      else
      {
        // not interested
        rating = -1
      }


      ret = {
        'id':     parseInt(id),
        'title':  title,
        'rating': parseInt(rating)
      }

      return ret
    }
  },

  /**
   * import triggered by updater
   */
  import: function()
  {
    // avoid running more than one import at the time
    if(!Importer.Updater.updateInProgress)
    {
      Importer.Updater.updateInProgress = true

      this.Pagination.reset()
      Importer.Pagination.intervalId = window.setInterval(Importer.Pagination.importNextPage, Importer.Pagination.interval)
    }
  },

  init: function()
  {
    this.Updater.init()
  }
}

window.Netflix.Ratings.Importer = Importer