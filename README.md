# anchors-smooth-scroll

Smooth scroll to anchor target.

**JS**
```javascript
import anchors from './anchors.js'

// initialize anchors
anchors({
    selector: '.anchor', // any valid selector
    speed: 150           // speed in px per frame
});
```

**HTML**
```html
<a href="#someID" class="anchor" data-offset="10">Trigger</a>

...

<div id="someID">Target</div>
```

