window.tests = window.tests || []

// e.g http://movies.netflix.com/WiAltGenre?agid=83
if(window.location.href.indexOf('WiMovie') === -1)
{
  window.tests.push(function()
  {
    describe('poster URLs', function()
    {
      describe('when clicking a poster', function()
      {
        // why: it's more likely user wants to see the movie page than to play a movie based on the poster alone
        it('should go to the movie page and not play the movie', function()
        {
          var links = $('.playLink')
          assert.is(links.length, 0)
          assert.isnt($('.moviePageLink').length, 0)
        })
      });
    })
  })
}
