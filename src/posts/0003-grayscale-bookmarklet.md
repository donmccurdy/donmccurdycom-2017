---
title: Grayscale CSS and Bookmarklet
slug: grayscale-bookmarklet
date: 2015-05-14 04:00:00
layout: post.html
---

A bit of code that can be used to convert any webpage (or part of a page) to grayscale. Because accessibility!

## CSS

```scss
body {
  /* IE */
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);

  /* Chrome, Safari */
  -webkit-filter: grayscale(1);

  /* Firefox */
  filter: grayscale(1);
}
```

## JavaScript

```javascript
(function () {
  var body = document.body;
  body.style['filter'] = 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)';
  if (!body.style['filter']) {
    body.style['-webkit-filter'] = 'grayscale(1)';
    body.style['filter'] = 'grayscale(1)';
  }
}());
```

## Bookmarklet

```
javascript:(function(){var e=document.body;e.style.filter="progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)",e.style.filter||(e.style["-webkit-filter"]="grayscale(1)",e.style.filter="grayscale(1)")}())
```

---

## References

- Questions on Stack Exchange [[1](http://superuser.com/a/915033/228191)] and [[2](http://stackoverflow.com/a/30250245/1314762)]
- [Browser Support](http://caniuse.com/#feat=css-filters)
- [Spec](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)
- [Tutorial](http://davidwalsh.name/css-filters)
