import "@plasmohq/messaging/background"
import ErrorHandler from "~utils/error-handler"

// 初始化错误处理器
ErrorHandler.initialize()

// 添加全局错误处理
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ERROR") {
    ErrorHandler.handleError(
      message.error,
      message.level || "error",
      message.context || sender.tab?.url || "Unknown Context"
    )
  }
})

// Handle runtime.lastError instead of non-existent onMessageError
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (chrome.runtime.lastError) {
    const error = new Error(chrome.runtime.lastError.message || "Unknown runtime error")
    ErrorHandler.handleError(error, "error", "Runtime Error")
  }
})

console.log("Background script loaded and error handling initialized")