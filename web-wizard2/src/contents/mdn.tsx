import type { PlasmoContentScript } from "plasmo"
import { useEffect } from "react"
import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoContentScript = {
  matches: ["https://developer.mozilla.org/*"]
}

const MdnContentScript = () => {
  useEffect(() => {
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

    fab.addEventListener("click", async () => {
      const title = document.title
      const url = window.location.href
      const description = document.querySelector("meta[name='description']")?.getAttribute("content")
      
      try {
        const response = await sendToBackground({
          name: "save-page",
          body: {
            title,
            url,
            description,
            type: "mdn"
          }
        })
        
        if (response.success) {
          fab.innerHTML = "Page Saved!"
          setTimeout(() => {
            fab.innerHTML = "Save Page"
          }, 2000)
        } else {
          fab.innerHTML = "Error!"
          setTimeout(() => {
            fab.innerHTML = "Save Page"
          }, 2000)
        }
      } catch (error) {
        console.error("Failed to save page:", error)
      }
    })

    document.body.appendChild(fab)

    // Cleanup function should return void
    return () => {
      if (document.body.contains(fab)) {
        document.body.removeChild(fab)
      }
    }
  }, [])

  return null
}

export default MdnContentScript 