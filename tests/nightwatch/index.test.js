describe('queries tests', function() {

  beforeEach(function(browser) {
    browser.url('http://localhost:13370');
  });

  it('Button click works', async function(browser) {
    const button = await browser.getByText('Unique Button Text');

    await browser.expect.element(button).text.not.to.equal('Button Clicked');
    await browser.click(button);
    await browser.expect.element(button).text.to.equal('Button Clicked');
  });

  it('getByPlaceholderText', async function (browser) {

    const input = await browser.getByPlaceholderText('Placeholder Text');

    await browser.expect.element(input).property('value').not.to.equal('Hello Placeholder');

    const webElement = await input.getWebElement();

    // // Uses the User Actions API to type into the input
    await browser.actions().sendKeys(webElement, 'Hello Placeholder').perform();

    await browser.expect.element(input).property('value').to.equal('Hello Placeholder');
  });


  it('getByLabelText', async function (browser) {
    const input = await browser.getByLabelText('Label For Input Labelled By Id');
    input.sendKeys('Hello Input Labelled by Id');

    expect(input).value.toEqual('Hello Input Labelled by Id');
  });

  it('findByLabelText', async function (browser) {
    const input = await browser.findByLabelText('Label For Input Labelled By Id');
    browser.sendKeys(input, 'Hello Input Labelled by Id');

    browser.expect.element(input).value.toEqual('Hello Input Labelled by Id');
  });

  it('queryByLabelText', async function (browser) {
    const input = await browser.queryByLabelText('Label For Input Labelled By Id');
    browser.sendKeys(input, 'Hello Input Labelled by Id');

    browser.expect.element(input).value.toEqual('Hello Input Labelled by Id');
  });

  it('queryByLabelText error', async function (browser) {
    const input = await browser.queryByLabelText('non existent label');
    browser.assert.strictEqual(input, null, 'input should be null');
  });

  it('getByAltText', async function (browser) {
    const image = await browser.getByAltText('Image Alt Text');

    browser.click(image);
    browser.expect.element(image).css('border').toEqual('5px solid rgb(255, 0, 0)');
  });

  it('getByTestId', async function (browser) {
    browser.click(await browser.getByTestId('image-with-random-alt-tag'));
  });

  it('getAllByText', async function (browser) {
    const chans = await browser.getAllByText('Jackie Chan', {exact: false});
    browser.expect(chans).to.have.length(2);
  });

  it('getAllByText - regex', async function (browser) {
    const chans = await browser.getAllByText(/Jackie Chan/);

    browser.expect(chans).to.have.length(2);

    const firstChan = chans[0];
    const secondChan = chans[1];

    browser.expect.element(firstChan).text.toEqual('Jackie Chan 1');

    browser.expect.element(secondChan).text.toEqual('Jackie Chan 2');
    browser.click(chans[1]);

    browser.expect.element(secondChan).text.toEqual('Jackie Kicked');
    browser.click(chans[0]);

    browser.expect.element(firstChan).text.toEqual('Jackie Kicked');
  });

  it('queryAllByText', async function (browser) {
    const buttons = await browser.queryAllByText('Button Text');
    const nonExistentButtons = await browser.queryAllByText('non existent button');

    browser.expect(buttons).to.have.length(2);
    browser.expect(nonExistentButtons).to.have.length(0);
  });

  it('still works after page navigation', async function (browser) {
    const page2 = await browser.getByText('Go to Page 2');

    browser.click(page2);

    browser.expect.element(await browser.getByText('second page')).to.be.present;
  });

  it('still works after refresh', async function (browser) {
    await browser.click(await browser.getByText('Go to Page 2'));
    await browser.back().refresh();
    await browser.expect.element(await browser.getByText('getByText')).to.be.present;
  });
});