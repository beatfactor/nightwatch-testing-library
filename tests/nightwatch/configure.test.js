describe('configure test', function () {

  // eslint-disable-next-line
  this.settings.testing_library = {
    testIdAttribute: 'data-automation-id'
  };

  beforeEach(browser => browser.url('http://localhost:13370'));

  it('supports alternative testIdAttribute', async (browser) => {
    const image = await browser.getByTestId('image-with-random-alt-tag');

    await browser.click(image);
    await browser.expect.element(image).to.have.css('border').which.equals('5px solid rgb(255, 0, 0)')
  });

  it('still works after navigation', async (browser) => {
    browser.click(await browser.getByText('Go to Page 2'));

    browser.click(await browser.getByTestId('page2-thing'));

    browser.expect.element(await browser.getByText('second page')).to.be.present;
  });
});

