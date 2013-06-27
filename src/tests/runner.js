var MochaRunner = {

  configChai: function()
  {

    // add custom asserts
    chai.Assertion.includeStack = true
    chai.assert.is = function(act, exp, msg)
    {
      new chai.Assertion(act, msg).to.equal(exp)
    };

    chai.assert.isnt = function(act, exp, msg)
    {
      new chai.Assertion(act, msg).to.not.equal(exp);
    };
    window.assert = chai.assert;

  },

  config: function()
  {
    var a = $('<a/>', {
      href: chrome.extension.getURL('tests/runner.html'),
      text: 'Run Automated tests'
    })

    $('#hd').append(a)
    $(document.body).append($('<div/>', {id: 'mocha'}))


    chrome.runtime.sendMessage('mocha_load_css')

    // config Mocha
    mocha.setup({
      ignoreLeaks: true,
      ui:          'bdd'
    })

    _.each(window.tests, function(test)
    {
      test.call(window)
    })
  },

  init: function()
  {
    if(Extension.mode !== 'test')
    {
      return;
    }

    MochaRunner.configChai()
    MochaRunner.config()

    mocha.run(function()
    {
      $('#doc2').hide()
    })
  }
}