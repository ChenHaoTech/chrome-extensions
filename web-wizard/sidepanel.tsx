import { useEffect, useState } from "react"

function IndexSidePanel() {
  const [savedPages, setSavedPages] = useState([])

  useEffect(() => {
    // Load saved pages when component mounts
    chrome.storage.local.get("savedPages", (data) => {
      setSavedPages(data.savedPages || [])
    })

    // Listen for changes to storage
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.savedPages) {
        setSavedPages(changes.savedPages.newValue)
      }
    })
  }, [])

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
