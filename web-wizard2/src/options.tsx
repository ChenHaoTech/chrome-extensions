import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Typography
} from "@mui/material"
import { useStorage } from "@plasmohq/storage/hook"

import "~styles/globals.css"

function IndexOptions() {
  const [darkMode, setDarkMode] = useStorage("darkMode", false)
  const [autoSearch, setAutoSearch] = useStorage("autoSearch", true)

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Appearance
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
            }
            label="Dark Mode"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Search Behavior
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={autoSearch}
                onChange={(e) => setAutoSearch(e.target.checked)}
              />
            }
            label="Auto-search on Enter"
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default IndexOptions 