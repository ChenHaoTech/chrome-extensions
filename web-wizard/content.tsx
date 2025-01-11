import type { PlasmoContentScript } from "plasmo"
import { useEffect } from "react"

export const config: PlasmoContentScript = {
    matches: ["https://developer.mozilla.org/*"]
}

const ContentScript = () => {
    useEffect(() => {
        // Add a floating action button to save current page
        const fab = document.createElement("button")
        fab.innerHTML = "Save Page"
        fab.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 24px;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 24px;
      cursor: pointer;
      box-shadow: 0 3px 5px rgba(0,0,0,0.2);
      z-index: 10000;
    `

        fab.addEventListener("click", () => {
            const title = document.title
            const url = window.location.href
            console.log(title, url)
            chrome.storage.local.get("savedPages", (data) => {
                const savedPages = data.savedPages || []
                chrome.storage.local.set({
                    savedPages: [...savedPages, { title, url, date: new Date().toISOString() }]
                })
            })
        })

        document.body.appendChild(fab)

        return () => {
            document.body.removeChild(fab)
        }
    }, [])

    return null
}

export default ContentScript 