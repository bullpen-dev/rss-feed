class RSS extends HTMLElement {
	async connectedCallback() {
		const feedUrl = this.getAttribute('url')

		if (!feedUrl) {
			console.error('No RSS feed URL provided!')
			return
		}

		try {
			const response = await fetch(feedUrl)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.text()

			const parser = new DOMParser()
			const xmlDoc = parser.parseFromString(data, "application/xml")

			const firstItem = xmlDoc.querySelector('item') || xmlDoc.querySelector('entry')

			if (firstItem) {
				const title = firstItem.querySelector('title')?.textContent
				const linkElement = firstItem.querySelector('link')
				const link = linkElement?.getAttribute('href') || linkElement?.textContent
				const description = firstItem.querySelector('description')?.textContent || firstItem.querySelector('summary')?.textContent
				const pubDate = firstItem.querySelector('pubDate')?.textContent || firstItem.querySelector('updated')?.textContent
				const hostname = link ? new URL(link).hostname : 'No hostname'
				const userLocale = navigator.language || 'en-US'
				const formattedPubDate = new Date(pubDate).toLocaleDateString(userLocale, {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})

				this.innerHTML = `
				${title ? `<h3>${title}</h3>` : ''}
				${description ? `<div>${description}</div>` : ''}
				<small>
				${link ? `<a href="${link}" target="_blank">${hostname || 'source'}</a>` : `${hostname || 'source'}`}
				${pubDate ? `<time datetime="${new Date(pubDate).toISOString()}">${formattedPubDate}</time>` : ''}
				</small>
				<hr>
				`
			} else {
				console.log('No items found in the feed.')
			}
		} catch (error) {
			console.error('Error fetching the RSS feed:', error)
		}
	}
}

// Define the custom element
customElements.define('rss-feed', RSS)
