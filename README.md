# rss-feed

display RSS feed item(s) in plain HTML

## use

```html
<script type="text/javascript" src="https://catskull.net/public/js/components/rss-feed.js" async></script>
<rss-feed url="https://mastodon.social/@dareelcatskull.rss"></rss-feed>
```

output:
```html
<rss-feed url="https://mastodon.social/@dareelcatskull.rss">
  <div class="rf-item">
    <div class="rf-description">
      <p>what a time to be alive!</p>
    </div>
    <small class="rf-meta">
      <a class="rf-source" href="https://mastodon.social/@dareelcatskull/113086020707228626" target="_blank">mastodon.social</a>
      <time class="rf-pubdate" datetime="2024-09-05T17:02:15.000Z">September 5, 2024</time>
    </small>
  </div>

  <hr>

  <div class="rf-item">
    <div class="rf-description">
      <p>wow you can edit tweets</p>
    </div>
    <small class="rf-meta">
      <a class="rf-source" href="https://mastodon.social/@dareelcatskull/113086004893026159" target="_blank">mastodon.social</a>
      <time class="rf-pubdate" datetime="2024-09-05T16:58:14.000Z">September 5, 2024</time>
    </small>
  </div>
  
  <!-- ... -->
</rss-feed>
```

**attributes**

| name    | required | type   | description                  | default      |
|---------|----------|--------|------------------------------|--------------|
| `url`   | **yes**  | URL    | the url of the RSS/Atom feed | -            |
| `count` | no       | number | max item quantity            | ∞ (infinite) |
| `time`  | no       | bool   | show publication time        | `false`      |
| `media` | no       | bool   | show media (images)          | `true`       |

No style is applied. _It should look fine_.

The items are arranged from newest to oldest.

Note the date string is localized based on `navigator.language` (ex. `en-US`)

**classes**

You can use these classes to style your feed:

| class               | description                                 |
|---------------------|---------------------------------------------|
| `.rf-item`          | main item wrapper                           |
| `.rf-description`   | post content (for RSS)                      |
| `.rf-content`       | post content (for Atom) & media wrapper     |
| `.rf-content-text`  | post content (for Atom)                     |
| `.rf-media`         | images                                      |
| `.rf-meta`          | meta info wrapper                           |
| `.rf-source`        | source link                                 |
| `.rf-pubdate`       | publication date and/or time                |

## thanks
- you
- [lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed?tab=readme-ov-file)

## help wanted
- accesibility
- what is the best way to distribute a single static JS file in 2024?

