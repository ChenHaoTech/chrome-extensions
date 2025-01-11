import { debounce } from "lodash"

export type ErrorLevel = "info" | "warning" | "error"

export interface ErrorInfo {
  level: ErrorLevel
  message: string
  stack?: string
  timestamp: string
  context?: string
  id: string
}

class ErrorHandler {
  private static errors: Map<string, ErrorInfo> = new Map()
  private static isInitialized = false

  static async initialize() {
    if (this.isInitialized) {
      return
    }

    // 更新扩展图标上的错误数量
    this.updateBadge()
    
    // 设置初始化标志
    this.isInitialized = true

    // 每小时清理旧错误
    setInterval(() => this.cleanOldErrors(), 60 * 60 * 1000)
  }

  // 防抖处理的通知展示
  private static debouncedNotify = debounce((error: ErrorInfo) => {
    this.showNotification(error)
  }, 1000)

  static async handleError(
    error: Error | string,
    level: ErrorLevel = "error",
    context?: string
  ) {
    const errorInfo: ErrorInfo = {
      id: Math.random().toString(36).substr(2, 9),
      level,
      message: error instanceof Error ? error.message : error.toString(),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      context
    }

    // 存储错误
    this.errors.set(errorInfo.id, errorInfo)
    
    // 更新扩展图标
    this.updateBadge()
    
    // 显示通知
    this.debouncedNotify(errorInfo)
    
    // 发送到错误页面
    this.sendToErrorPage(errorInfo)

    // 记录到控制台
    console[level](`[${context}] ${errorInfo.message}`, errorInfo.stack || '')
  }

  private static updateBadge() {
    const errorCount = this.errors.size
    chrome.action.setBadgeText({ 
      text: errorCount > 0 ? errorCount.toString() : "" 
    })
    chrome.action.setBadgeBackgroundColor({ 
      color: this.getBadgeColor(this.getHighestErrorLevel()) 
    })
  }

  private static getBadgeColor(level: ErrorLevel): string {
    switch (level) {
      case "error":
        return "#FF0000"
      case "warning":
        return "#FFA500"
      case "info":
        return "#0000FF"
      default:
        return "#FF0000"
    }
  }

  private static getHighestErrorLevel(): ErrorLevel {
    let highestLevel: ErrorLevel = "info"
    for (const error of this.errors.values()) {
      if (error.level === "error") {
        return "error"
      }
      if (error.level === "warning" && highestLevel === "info") {
        highestLevel = "warning"
      }
    }
    return highestLevel
  }

  private static showNotification(error: ErrorInfo) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("assets/icon.png"),
      title: `${error.level.toUpperCase()}: ${error.context || "Error"}`,
      message: error.message,
      priority: error.level === "error" ? 2 : 1
    })
  }

  private static sendToErrorPage(error: ErrorInfo) {
    chrome.runtime.sendMessage({
      type: "NEW_ERROR",
      error
    }).catch(() => {
      // 错误页面可能未打开，忽略错误
    })
  }

  private static cleanOldErrors() {
    const ONE_HOUR = 60 * 60 * 1000
    const now = new Date().getTime()

    for (const [id, error] of this.errors.entries()) {
      const errorTime = new Date(error.timestamp).getTime()
      if (now - errorTime > ONE_HOUR) {
        this.errors.delete(id)
      }
    }

    this.updateBadge()
  }

  static clearError(id: string) {
    this.errors.delete(id)
    this.updateBadge()
  }

  static clearAllErrors() {
    this.errors.clear()
    this.updateBadge()
  }

  static getErrors() {
    return Array.from(this.errors.values())
  }
}

export default ErrorHandler 