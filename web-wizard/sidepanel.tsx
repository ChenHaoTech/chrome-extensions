import { useEffect, useState } from "react"
import { sendToBackground } from "@plasmohq/messaging"

function IndexSidePanel() {
  const [savedPages, setSavedPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSavedPages = async () => {
      try {
        const pages = await sendToBackground({
          name: "get-saved-pages"
        })
        setSavedPages(pages)
      } catch (error) {
        console.error("Failed to load saved pages:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSavedPages()

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.savedPages) {
        setSavedPages(changes.savedPages.newValue)
      }
    })
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 16, textAlign: "center" }}>
        Loading...
      </div>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        height: "100vh",
        overflow: "auto"
      }}>
      <h2>Saved Pages</h2>
      
      {savedPages.map((page, index) => (
        <div 
          key={index}
          style={{
            padding: "12px",
            marginBottom: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px"
          }}>
          <a 
            href={page.url}
            target="_blank"
            style={{
              color: "#1976d2",
              textDecoration: "none",
              fontWeight: "500"
            }}>
            {page.title}
          </a>
          <div style={{fontSize: "12px", color: "#666", marginTop: "4px"}}>
            {new Date(page.date).toLocaleString()}
          </div>
        </div>
      ))}

      {savedPages.length === 0 && (
        <div style={{textAlign: "center", color: "#666", marginTop: "32px"}}>
          No pages saved yet. Visit MDN docs and click the Save button to add pages.
        </div>
      )}
    </div>
  )
}

export default IndexSidePanel
