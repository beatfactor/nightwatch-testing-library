# @nightwatch/testing-library

<p align=center>
  <img alt="Nightwatch.js Logo" src=".github/assets/nightwatch-logo.png" width=200 />
  <img alt="Vue Logo" src=".github/assets/tllogo-large.png" width=200 />
</p>

Using [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro) in Nightwatch has never been easier with the official Nightwatch plugin.

Requires Nightwatch 2.6.0 or higher.

<hr />

[![Build Status][build-badge]][build]
[![version][version-badge]][package]
[![MIT License][license-badge]][license]
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]
[![Discord][discord-badge]][discord]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
- [Contributors](#contributors)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

Install the project from NPM with:

```sh
npm i @nightwatch/testing-library --save-dev
```

Edit your `nightwatch.json` (or `nightwatch.conf.js`) file and add the plugin to the list:

```json
{
  "plugins": [
    "@nightwatch/testing-library"      
  ]
}
```

## Usage

Once the plugin is installed, you can use the `TestingLibrary` queries in your tests as regular Nightwatch commands.

### About the queries
- `getBy...`: returns the matching element and throw a descriptive error if no elements match or if more than one match is found (use `getAllBy` instead if more than one element is expected);
- `queryBy...`: returns the matching element and return `null` if no elements match. This is useful for asserting an element that is not present. Throws an error if more than one match is found (use `queryAllBy` instead if this is OK);
- `findBy...`: same as `getBy...` but will retry until a default timeout of `1000ms` is reached before throwing the error when no match is found. If you need to find more than one element, use `findAllBy`.

The complete list of queries is available on the [DOM Testing Library documentation](https://testing-library.com/docs/queries/about).

### Returned values

The individual queries return a Nightwatch [Element](https://nightwatchjs.org/api/element/#overview) object. In addition to the element methods available directly on the element, you can use this object directly with any Nightwatch command or assertion that accepts an element as a parameter.

The `getAllBy`, `findAllBy`, `queryAllBy` queries return an array of Nightwatch [Element](https://nightwatchjs.org/api/element/#overview) objects.

The following are equivalent:

```js
test('first example', async (browser) => {
  const input = await browser.getByLabelText('Label For Input Labelled By Id');
  await input.sendKeys('Hello Input Labelled by Id');
});

test('second example', async (browser) => {
  const input = await browser.getByLabelText('Label For Input Labelled By Id');
  await browser.sendKeys(input, 'Hello Input Labelled by Id');
});
```

### getByText

```js
test('getByText example', async function(browser) {
  const button = await browser.getByText('Unique Button Text');

  browser.click(button);
  browser.expect.element(button).text.to.equal('Button Clicked');
});
```

### getByPlaceholderText

```js
test('getByPlaceholderText example', async function(browser) {
  const input = await browser.getByPlaceholderText('Placeholder Text');

  // Uses the User Actions API to type into the input
  const webElement = await input.getWebElement();
  await browser.actions().sendKeys(webElement, 'Hello Placeholder').perform();

  await browser.expect.element(input).property('value').to.equal('Hello Placeholder');
});
```

### getByLabelText
    
```js
test('getByLabelText example', async function(browser) {
  const input = await browser.getByLabelText('Label For Input Labelled By Id');
  browser.sendKeys(input, 'Hello Input Labelled by Id');

  browser.expect.element(input).value.toEqual('Hello Input Labelled by Id');
});
```

### getByAltText

```js
test('getByAltText example', async function(browser) {
  const image = await browser.getByAltText('Image Alt Text');

  browser.expect.element(image).to.be.present;
});
```

### getByTestId

```js
test('getByTestId example', async function(browser) {
  const button = await browser.getByTestId('unique-button-id');

  browser.click(button);
  browser.expect.element(button).text.to.equal('Button Clicked');
});
```

### getAllByText
    
```js
test('getAllByText example', async function(browser) {
  const chans = await browser.getAllByText('Jackie Chan', {exact: false});
  browser.expect(chans).to.have.length(2);
});
```

### getAllByText with regex

```js
test('getAllByText with regex example', async function(browser) {
  const chans = await browser.getAllByText(/Jackie Chan/)
  browser.expect(chans).to.have.length(2);
});
```

### queryAllByText

```js
test('queryAllByText', async function (browser) {
  const buttons = await browser.queryAllByText('Button Text');
  const nonExistentButtons = await browser.queryAllByText('non existent button');

  browser.expect(buttons).to.have.length(2);
  browser.expect(nonExistentButtons).to.have.length(0);
});
```

### using .within

```js
test('getByText within container', async browser => {
  const nested = await browser.getByTestId('nested');
  const button = await browser.within(nested).getByText('Button Text');

  await browser.click(button);
  await browser.expect.element(button).text.to.equal('Button Clicked');
});
```

```js
test('using nested selector from "All" query with index - regex', async browser => {
  const nestedDivs = await browser.getAllByTestId(/nested/);

  await browser.expect(nestedDivs).to.have.length(2)

  const nested = browser.within(nestedDivs[1]);
  const button = await nested.getByText('Button Text');
  const text = await nested.getByText('text only in 2nd nested');

  await browser.expect.element(button).to.be.present;
  await browser.expect.element(text).to.be.present;
});
```

### Configure testIdAttribute

The `testIdAttribute` can be configured to use a different attribute for the `getByTestId` query

1) In your `nightwatch.json` (or `nightwatch.conf.js`) file:

```json
{
  "testing_library": {
    "testIdAttribute": "data-automation-id"
  }
}
```

2) In your test file:

```js
describe('configure test', function () {

  this.settings.testing_library = {
    testIdAttribute: 'data-automation-id'
  };

  beforeEach(browser => browser.url('http://localhost:13370'));

  test('supports alternative test Id attribute', async (browser) => {
    const image = await browser.getByTestId('image-with-random-alt-tag');
    browser.click(image);
    browser.expect.element(image).to.have.css('border').which.equals('5px solid rgb(255, 0, 0)')
  });
});
```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/benmonro"><img src="https://avatars3.githubusercontent.com/u/399236?v=4" width="100px;" alt="Ben Monro"/><br /><sub><b>Ben Monro</b></sub></a><br /><a href="https://github.com/testing-library/nightwatch-testing-library/commits?author=benmonro" title="Documentation">📖</a> <a href="https://github.com/testing-library/nightwatch-testing-library/commits?author=benmonro" title="Code">💻</a> <a href="https://github.com/testing-library/nightwatch-testing-library/commits?author=benmonro" title="Tests">⚠️</a> <a href="#infra-benmonro" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#ideas-benmonro" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://kentcdodds.com"><img src="https://avatars0.githubusercontent.com/u/1500684?v=4" width="100px;" alt="Kent C. Dodds"/><br /><sub><b>Kent C. Dodds</b></sub></a><br /><a href="#infra-kentcdodds" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#ideas-kentcdodds" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/testing-library/nightwatch-testing-library/commits?author=kentcdodds" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/appleJax"><img src="https://avatars1.githubusercontent.com/u/13618860?v=4" width="100px;" alt="Kevin Brewer"/><br /><sub><b>Kevin Brewer</b></sub></a><br /><a href="#ideas-appleJax" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/testing-library/nightwatch-testing-library/commits?author=appleJax" title="Code">💻</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://github.com/nightwatchjs/nightwatch-testing-library/actions/workflows/nightwatch-testing-library.yml/badge.svg?branch=main
[build]: https://github.com/nightwatchjs/nightwatch-testing-library/actions/workflows/nightwatch-testing-library.yml

[version-badge]: https://img.shields.io/npm/v/nightwatch.svg?style=flat-square
[package]: https://www.npmjs.com/package/@nightwatch/testing-library
[license-badge]: https://img.shields.io/npm/l/@nightwatch/testing-library.svg?style=flat-square
[license]: https://github.com/nightwatchjs/nightwatch-testing-library/blob/main/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/testing-library/nightwatch-testing-library/blob/main/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/testing-library/nightwatch-testing-library.svg?style=social
[github-watch]: https://github.com/testing-library/nightwatch-testing-library/watchers
[github-star-badge]: https://img.shields.io/github/stars/testing-library/nightwatch-testing-library.svg?style=social
[github-star]: https://github.com/testing-library/nightwatch-testing-library/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20nightwatch-testing-library%20by%20%40benmonro%20https%3A%2F%2Fgithub.com%2Ftesting-library%2Fnightwatch-testing-library%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/testing-library/nightwatch-testing-library.svg?style=social
[emojis]: https://github.com/benmonro/all-contributors#emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors
[dom-testing-library]: https://github.com/testing-library/dom-testing-library
[nightwatch]: https://nightwatchjs.org/guide
[discord-badge]: https://img.shields.io/discord/618399631038218240.svg?color=7389D8&labelColor=6A7EC2&logo=discord&logoColor=ffffff&style=flat-square
[discord]: https://discord.gg/SN8Da2X
