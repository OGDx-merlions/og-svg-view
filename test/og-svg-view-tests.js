// This is the placeholder suite to place custom tests in
// Use testCase(options) for a more convenient setup of the test cases
suite('Custom Automation Tests for og-svg-view', () => {
  test('Check initial value of counter', done => {
    let counterEl = fixture('og-svg-view-fixture'),
        counterValueEl = Polymer.dom(counterEl.root).querySelector('span');
    debugger;
    assert.equal(counterValueEl.textContent, '0');
    done();
  });

  test('Clicking og-svg-view increments the counter', done => {
    let counterEl = fixture('og-svg-view-fixture'),
        counterValueEl = Polymer.dom(counterEl.root).querySelector('span');
    assert.equal(counterValueEl.textContent, '0');

    counterEl.click();
    flush(function(){
      assert.equal(counterValueEl.textContent, '1');
    });
    done();
  });
});
