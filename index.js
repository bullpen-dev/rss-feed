class RSS extends HTMLElement {
	safeHtmlTags = ["abbr", "acronym", "b", "blockquote", "br", "code", "div", "em", "i", "li", "ol", "p",
"span", "strong", "table", "td", "tr", "ul", "a"];

	async connectedCallback() {
		const feedUrl = this.getAttribute('url')
		let postCount = parseInt(this.getAttribute('count'))

		if (!feedUrl) {
			console.error('No RSS feed URL provided!')
			return
		}

		if (isNaN(postCount)) {
			postCount = Infinity
		}

		try {
			const response = await fetch(feedUrl)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.text()

			const parser = new DOMParser()
			const xmlDoc = parser.parseFromString(data, "application/xml")

			const items = [...xmlDoc.querySelectorAll('item,entry')]
			const itemsToRender = items.slice(0, postCount)

			if (itemsToRender.length) {
				const items = itemsToRender.map((item) => this.itemToHTML(item))
				for (let item of items) {
					this.append(item, document.createElement('hr'))
				}
				// Removes the pending <hr>
				this.lastChild.remove()
			} else {
				console.log('No items found in the feed.')
			}
		} catch (error) {
			console.error('Error fetching the RSS feed:', error)
		}
	}

	/**
	 * Converts an XML RSS item/entry into an object containing relevant data
	 * about the post.
	 * @returns {ItemData}
	 */
	getItemData(item) {
		const titleEl = item.querySelector('title')
		const linkEl = item.querySelector('link')
		const descriptionEl = item.querySelector('description')
		const summaryEl = item.querySelector('summary')
		const pubDateEl = item.querySelector('pubDate')
		const updatedEl = item.querySelector('updated')
		const contentEl = item.querySelector('content')

		const data = {
			title: titleEl?.textContent,
			link: linkEl?.getAttribute('href') || linkEl?.textContent,
			description: descriptionEl?.textContent || summaryEl?.textContent,
			pubDate: pubDateEl?.textContent || updatedEl?.textContent,
			hostname: undefined,
			content: {
				type: 'none'
			}
		}

		if (data.link) data.hostname = new URL(data.link).hostname

		if (contentEl) {
			// If content is an image
			if (contentEl.getAttribute('medium') === 'image') {
				data.content = {
					type: "image",
					url: contentEl.getAttribute('url'),
					description: contentEl.querySelector(CSS.escape('description'))?.textContent
				}
			} else {
				data.content = {
					type: "text",
					text: contentEl?.textContent
				}
			}
		}

		return data
	}

	createMetaEl(data) {
		const metaEl = document.createElement('small')
		metaEl.className = "rf-meta"

		if (data.link) {
			const linkEl = document.createElement('a')
			linkEl.className = "rf-source"
			linkEl.href = data.link
			linkEl.target = '_blank'
			linkEl.textContent = data.hostname || 'source'
			metaEl.append(linkEl, ' ')
		}

		if (data.pubDate) {
			const userLocale = navigator.language || 'en-US'
			const localeConf = {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}

			const includeTime = this.getAttribute('time') === 'true'

			const pubDate = new Date(data.pubDate);

			const pubDateEl = document.createElement('time')
			pubDateEl.dateTime = pubDate.toISOString()
			pubDateEl.className = "rf-pubdate"

			if (includeTime) {
				pubDateEl.textContent = pubDate.toLocaleTimeString(userLocale, localeConf)
			} else {
				pubDateEl.textContent = pubDate.toLocaleDateString(userLocale, localeConf)
			}

			metaEl.appendChild(pubDateEl)
		}

		return metaEl
	}

	/**
	 * Used by the description part of the post. Allows HTML content to be
	 * inserted while avoiding XSS attacks.
	 */
	safelyInsertHTML(unparsedHtml, element) {
		const parser = new DOMParser()
		const doc = parser.parseFromString(unparsedHtml, 'text/html')

		for (let child of doc.body.children) {
			if (!this.safeHtmlTags.includes(child.tagName.toLowerCase())) continue
			for (let attr of child.attributes) {
				const name = attr.name.toLocaleLowerCase()
				// Removing JavaScript event attributes
				if (name.startsWith('on')) {
					child.removeAttribute(attr.name)
				}
				
				if (name === 'href' || name === 'src') {
					let url = attr.value.trim()
					if (!url.startsWith('https://') || !url.startsWith('http://')) {
						// Prevents JavaScript code inside
						attr.value = 'https://' + url
					}
				}
			}
			element.appendChild(child)
		}
	}

	itemToHTML(item) {
		const data = this.getItemData(item)

		const itemEl = document.createElement('div')
		itemEl.className = 'rf-item'

		if (data.title) {
			const titleEl = document.createElement('h3')
			titleEl.className = "rf-title"
			titleEl.textContent = data.title
			itemEl.appendChild(titleEl)
		}

		if (data.description) {
			const descriptionEl = document.createElement('div')
			descriptionEl.className = "rf-description"
			this.safelyInsertHTML(data.description, descriptionEl)
			itemEl.appendChild(descriptionEl)
		}

		const contentEl = document.createElement('div')
		contentEl.className = "rf-content"

		switch (data.content.type) {
			case 'image':
				if (this.getAttribute('media') === 'false') break
				const mediaEl = document.createElement('img')
				mediaEl.className = "rf-media"
				mediaEl.src = data.content.url
				mediaEl.alt = data.content.description
				contentEl.appendChild(mediaEl)
				itemEl.appendChild(contentEl)
				break
			case 'text':
				const textEl = document.createElement('span')
				textEl.className = "rf-content-text"
				textEl.textContent = data.content.text
				contentEl.appendChild(textEl)
				itemEl.appendChild(contentEl)
				break
		}

		const metaEl = this.createMetaEl(data)
		itemEl.appendChild(metaEl)

		return itemEl
	}
}

// Define the custom element
customElements.define('rss-feed', RSS)

/**
 * @typedef {object} ItemData
 * @description Contains relevant data about an RSS feed item/entry
 * @property {string | undefined} title
 * @property {string | undefined} link
 * @property {string | undefined} description
 * @property {string | undefined} pubDate
 * @property {string | undefined} hostname
 * @property {object} content
 * @property {'none' | 'image' | 'text'} content.type
 * @property {string | undefined} content.url
 * @property {string | undefined} content.description
 * @property {string | undefined} content.text
 */
