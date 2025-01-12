import { Box, Button, TextField, Typography } from "@mui/material"
import { useStorage } from "@plasmohq/storage/hook"
import { useState } from "react"

import "~styles/globals.css"

function IndexPopup() {
  const [query, setQuery] = useState("")
  const [searchHistory] = useStorage<string[]>("search-history", [])

  const handleSearch = () => {
    if (!query.trim()) return
    chrome.tabs.create({
      url: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(query)}`
    })
  }

  return (
    <Box sx={{ width: 300, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Web Development Assistant
      </Typography>

      <TextField
        fullWidth
        size="small"
        placeholder="Search MDN docs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleSearch}>
        Search MDN
      </Button>

      {searchHistory?.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Recent Searches
          </Typography>
          <Box sx={{ mt: 1 }}>
            {searchHistory.map((item, i) => (
              <Typography
                key={i}
                variant="body2"
                sx={{
                  p: 1,
                  mb: 0.5,
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "action.hover"
                  }
                }}
                onClick={() => setQuery(item)}>
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default IndexPopup 