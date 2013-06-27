window.tests = window.tests || []

// e.g http://movies.netflix.com/WiMovie/70180387
if(window.location.href.indexOf('WiMovie') !== -1)
{
  window.tests.push(function()
  {
    describe('movie page', function()
    {
      describe('poster', function()
      {
        // why: hover image does not work with custom styles
        it('should not have the play button as a hover', function()
        {
          assert.is($('displayPagePlayable').length, 0)
        })
      });
    })
  })
}
