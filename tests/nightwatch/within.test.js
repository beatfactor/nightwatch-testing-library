describe('within tests', function () {

  beforeEach(browser => browser.url('http://localhost:13370'));

  it('getByText within container', async browser => {
    const nested = await browser.getByTestId('nested');
    const button = await browser.within(nested).getByText('Button Text');

    await browser.click(button);
    await browser.expect.element(button).text.to.equal('Button Clicked');
  });

  xit('works with nested selector from "All" query with index - regex', async browser => {
    const nestedDivs = await browser.getAllByTestId(/nested/);

    await browser.expect(nestedDivs).to.have.length(2)

    const nested = browser.within(nestedDivs[1]);
    const button = await nested.getByText('Button Text');
    const text = await nested.getByText('text only in 2nd nested');

    await browser.expect.element(button).to.be.present;
    await browser.expect.element(text).to.be.present;
  });
});
