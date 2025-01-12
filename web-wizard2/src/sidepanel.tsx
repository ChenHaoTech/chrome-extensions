import { useEffect, useState } from "react"
import { sendToBackground } from "@plasmohq/messaging"

type SavedPage = {
  title: string
  url: string
  description?: string
  type: "mdn" | "github"
  date: string
}

function IndexSidePanel() {
  const [savedPages, setSavedPages] = useState<SavedPage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "mdn" | "github">("all")

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

    chrome.storage.onChanged.addListener((changes) => {
      if (changes.savedPages) {
        setSavedPages(changes.savedPages.newValue)
      }
    })
  }, [])

  const filteredPages = savedPages.filter(
    page => filter === "all" || page.type === filter
  )

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
      <div style={{ marginBottom: 16 }}>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | "mdn" | "github")}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            width: "100%"
          }}>
          <option value="all">All Pages</option>
          <option value="mdn">MDN Docs</option>
          <option value="github">GitHub Repos</option>
        </select>
      </div>

      <h2>Saved Pages</h2>
      
      {filteredPages.map((page, index) => (
        <div 
          key={index}
          style={{
            padding: "12px",
            marginBottom: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: page.type === "github" ? "#f6f8fa" : "white"
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "12px",
              backgroundColor: page.type === "github" ? "#238636" : "#1976d2",
              color: "white"
            }}>
              {page.type?.toUpperCase()??"Null"}
            </span>
            <a 
              href={page.url}
              target="_blank"
              style={{
                color: page.type === "github" ? "#238636" : "#1976d2",
                textDecoration: "none",
                fontWeight: "500"
              }}>
              {page.title}
            </a>
          </div>
          
          {page.description && (
            <p style={{
              margin: "8px 0",
              fontSize: "14px",
              color: "#666"
            }}>
              {page.description}
            </p>
          )}
          
          <div style={{fontSize: "12px", color: "#666"}}>
            {new Date(page.date).toLocaleString()}
          </div>
        </div>
      ))}

      {filteredPages.length === 0 && (
        <div style={{textAlign: "center", color: "#666", marginTop: "32px"}}>
          No pages saved yet. Visit MDN docs or GitHub repositories and click the Save button to add pages.
        </div>
      )}
    </div>
  )
}

export default IndexSidePanel
