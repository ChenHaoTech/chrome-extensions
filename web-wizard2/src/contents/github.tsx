import type { PlasmoContentScript } from "plasmo"
import { useEffect } from "react"
import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoContentScript = {
  matches: ["https://github.com/*"]
}

const GithubContentScript = () => {
  useEffect(() => {
    // Add a floating action button to save repository
    const fab = document.createElement("button")
    fab.innerHTML = "Save Repo"
    fab.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 24px;
      background: #238636;
      color: white;
      border: none;
      border-radius: 24px;
      cursor: pointer;
      box-shadow: 0 3px 5px rgba(0,0,0,0.2);
      z-index: 10000;
    `

    fab.addEventListener("click", async () => {
      // Get repository information
      const repoTitle = document.querySelector("meta[property='og:title']")?.getAttribute("content")
      const repoDesc = document.querySelector("meta[property='og:description']")?.getAttribute("content")
      const repoUrl = window.location.href
      const stars = document.querySelector('[aria-label="star"]')?.parentElement?.textContent?.trim()
      
      try {
        const response = await sendToBackground({
          name: "save-page",
          body: {
            title: `${repoTitle}${stars ? ` (⭐${stars})` : ''}`,
            url: repoUrl,
            description: repoDesc,
            type: "github"
          }
        })
        
        if (response.success) {
          fab.innerHTML = "Repo Saved!"
          setTimeout(() => {
            fab.innerHTML = "Save Repo"
          }, 2000)
        } else {
          fab.innerHTML = "Error!"
          setTimeout(() => {
            fab.innerHTML = "Save Repo"
          }, 2000)
        }
      } catch (error) {
        console.error("Failed to save repository:", error)
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

export default GithubContentScript 