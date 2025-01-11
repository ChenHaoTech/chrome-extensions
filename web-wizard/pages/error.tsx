import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import ClearAllIcon from "@mui/icons-material/ClearAll"
import { useEffect, useState } from "react"
import type { ErrorInfo } from "~utils/error-handler"
import ErrorHandler from "~utils/error-handler"

function ErrorPage() {
  const [errors, setErrors] = useState<ErrorInfo[]>([])

  useEffect(() => {
    // 加载现有错误
    setErrors(ErrorHandler.getErrors())

    // 监听新错误
    const handleNewError = (message) => {
      if (message.type === "NEW_ERROR") {
        setErrors(ErrorHandler.getErrors())
      }
    }

    chrome.runtime.onMessage.addListener(handleNewError)
    return () => chrome.runtime.onMessage.removeListener(handleNewError)
  }, [])

  const handleClearError = (id: string) => {
    ErrorHandler.clearError(id)
    setErrors(ErrorHandler.getErrors())
  }

  const handleClearAll = () => {
    ErrorHandler.clearAllErrors()
    setErrors([])
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Error Log</Typography>
        <Button
          startIcon={<ClearAllIcon />}
          onClick={handleClearAll}
          disabled={errors.length === 0}>
          Clear All
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Context</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {errors.map((error) => (
              <TableRow key={error.id}>
                <TableCell>{new Date(error.timestamp).toLocaleString()}</TableCell>
                <TableCell>{error.level}</TableCell>
                <TableCell>{error.context}</TableCell>
                <TableCell>
                  <div>{error.message}</div>
                  {error.stack && (
                    <pre style={{ fontSize: "0.8em", color: "#666" }}>
                      {error.stack}
                    </pre>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleClearError(error.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ErrorPage 