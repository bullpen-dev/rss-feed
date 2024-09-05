# rss-feed

display RSS feed item(s) in plain HTML

## use

```html
<script type="text/javascript" src="https://catskull.net/public/js/components/rss-feed.js"></script>
<rss-feed url="https://mastodon.social/@dareelcatskull.rss" count="2"></rss-feed>
```

output:
```html
<rss-feed url="https://mastodon.social/@dareelcatskull.rss" count="2">
  <div><p>what a time to be alive!</p></div>
  <small>
  <a href="https://mastodon.social/@dareelcatskull/113086020707228626" target="_blank">mastodon.social</a>
  <time datetime="2024-09-05T17:02:15.000Z">September 5, 2024</time>
  </small>
  <hr>

  <div><p>wow you can edit tweets</p></div>
  <small>
  <a href="https://mastodon.social/@dareelcatskull/113086004893026159" target="_blank">mastodon.social</a>
  <time datetime="2024-09-05T16:58:14.000Z">September 5, 2024</time>
  </small>
  <hr>
</rss-feed>
```

**attributes**
- `url` (required): the url of the RSS/Atom feed
- `count` (optional): how many items (newest to oldest) to display

No style is applied. _It should look fine_.

Note the date string is localized based on `navigator.language` (ex. `en-US`)

## thanks
- you
- [lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed?tab=readme-ov-file)


