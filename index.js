class RSS extends HTMLElement {
	async connectedCallback() {
		const feedUrl = this.getAttribute('url')
		let postCount = parseInt(this.getAttribute('count'))

		if (!feedUrl) {
			console.error('No RSS feed URL provided!')
			return
		}

		if (isNaN(postCount)) {
			postCount = 1
		}

		try {
			const response = await fetch(feedUrl)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.text()

			const parser = new DOMParser()
			const xmlDoc = parser.parseFromString(data, "application/xml")

			const items = xmlDoc.querySelectorAll('item') || xmlDoc.querySelectorAll('entry')
			const itemsToRender = [...items].slice(0, postCount)

			if (itemsToRender.length) {
				this.innerHTML = itemsToRender
					.map((item) => this.itemToHTML(item))
					.join("<hr>");
			} else {
				console.log('No items found in the feed.')
			}
		} catch (error) {
			console.error('Error fetching the RSS feed:', error)
		}
	}

	itemToHTML(item) {
		const title = item.querySelector('title')?.textContent
		const linkElement = item.querySelector('link')
		const link = linkElement?.getAttribute('href') || linkElement?.textContent
		const description = item.querySelector('description')?.textContent || item.querySelector('summary')?.textContent
		const pubDate = item.querySelector('pubDate')?.textContent || item.querySelector('updated')?.textContent
		const hostname = link ? new URL(link).hostname : 'No hostname'
 		const userLocale = navigator.language || 'en-US'
		const formattedPubDate = new Date(pubDate).toLocaleDateString(userLocale, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
		const mediaContent = item.querySelector('content')
		const mediaIsImage = mediaContent?.getAttribute('medium') === 'image'
		const mediaUrl = mediaContent?.getAttribute('url')
		const mediaDescription = mediaContent?.querySelector(CSS.escape('description'))?.textContent

		return `
				${title ? `<h3>${title}</h3>` : ''}
				${description ? `<div>${description}</div>` : ''}
				${mediaUrl && mediaIsImage ? `<img src="${mediaUrl}" alt="${mediaDescription}"></img>` : ''}
				<small>
				${link ? `<a href="${link}" target="_blank">${hostname || 'source'}</a>` : `${hostname || 'source'}`}
				${pubDate ? `<time datetime="${new Date(pubDate).toISOString()}">${formattedPubDate}</time>` : ''}
				</small>
				`
	}
}

// Define the custom element
customElements.define('rss-feed', RSS)
