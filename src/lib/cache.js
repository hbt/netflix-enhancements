window.Netflix = window.Netflix || {}

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

Netflix.Cache = Cache
