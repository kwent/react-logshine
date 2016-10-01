# react-logshine

Shine light on your log files (Papertrail only).

[![NPM version][npm-image]][npm-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/react-logshine.svg?style=flat-square
[npm-url]: http://npmjs.org/package/react-logshine
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/kwent/react-logshine.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-logshine

## Screenshot

![react-logshine](https://github.com/kwent/react-logshine/raw/master/doc/screenshot.png)

## Install

[![react-logshine](https://nodei.co/npm/react-logshine.png)](https://npmjs.org/package/react-logshine)

## Usage

```js
var React = require('react');
var ReactDOM = require('react-dom');
var LogShine = require('react-logshine');
require('react-logshine/lib/LogShine.css');
ReactDOM.render(<LogShine token="your_token"/>, container);
```

## Props

Property | Type | Description | Default value
:---|:---|:---|:---
`height` | `PropTypes.string` | Component height | `500px`
`width`  | `PropTypes.string` | Component width  | `100%`
`token`  | `PropTypes.string.isRequired` | Papertrail token | `null`
`query`  | `PropTypes.string` | LogShine query | `null`
`systemID` | `PropTypes.number` or `PropTypes.string` | System to search by ID or in most cases, by name | `null`
`groupID` | `PropTypes.number` | Group to search | `null`
`follow` | `PropTypes.bool` | Follow (`tail -f`) | `true`
`delay` | `PropTypes.number` | Delay between refresh in seconds | `10`
`showTopToolbar` | `PropTypes.bool` | Show top toolbar | `true`
`showBottomToolbar` | `PropTypes.bool` | Show bottom toolbar | `true`
`backgroundColor` | `PropTypes.string` | Set background color | `#252830`
`dateTimeColor` | `PropTypes.string` | Set datetime color | `#e4d836`
`systemColor` | `PropTypes.string` | Set system color | `#1bc98e`
`programColor` | `PropTypes.string` | Set program color | `#9f86ff`
`messageColor` | `PropTypes.string` | Set message color | `#ffffff`
`topToolbarBackgroundColor` | `PropTypes.string` | Set top toolbar background color | `#1bc98e`
`rowFormat` | `PropTypes.function` | Custom row format | `null`


## Custom row format

```javascript
let rowFormat = function(event) {
  return(
        <li className="LogShine event" key={event.id}>
         <hr style={{width: '90%'}}/>
         <p>Date: {event.generated_at}</p>
         <p>System: {event.host}</p>
         <p>Program: {event.program}</p>
         <p>{event.message}</p>
       </li>
  );
}

ReactDOM.render(
  <LogShine token="your_token" rowFormat={rowFormat}/>, document.getElementById('root')
);
```

## Development

```
npm install
npm start
```

## Example

http://localhost:3000

# History

View the [changelog](https://github.com/kwent/react-logshine/blob/master/CHANGELOG.md)

# Authors

- [Quentin Rousseau](https://github.com/kwent)

# License

```plain
Copyright (c) 2016 Quentin Rousseau <contact@quent.in>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
```
