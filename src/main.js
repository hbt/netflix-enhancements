window.Netflix = window.Netflix || {}

Netflix.init = function()
{
  // clear cache
  Netflix.Cache.clear()


  // remove playable
  Netflix.Posters.init()

  // remove player hover in movie page
  $('.displayPagePlayable').first().removeClass('displayPagePlayable')


  // tests
  MochaRunner.init()
}


$(document).ready(function()
{
  // init
  window.setTimeout(Netflix.init, 500)
})
