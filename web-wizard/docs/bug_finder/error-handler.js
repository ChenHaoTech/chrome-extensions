// errorHandler.js

class ExtensionErrorHandler {
  constructor(options = {}) {
    this.options = {
      logToConsole: true,
      logToFile: false,
      logToUI: true,
      logFilePath: 'errors.log',
      ...options
    };
    
    this.initializeErrorListeners();
  }

  initializeErrorListeners() {
    // 监听全局错误
    window.onerror = (message, source, lineno, colno, error) => {
      this.handleError({
        type: 'Global Error',
        message,
        source,
        lineno,
        colno,
        stack: error?.stack
      });
    };

    // 监听未捕获的Promise错误
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'Unhandled Promise Rejection',
        message: event.reason?.message || event.reason,
        stack: event.reason?.stack
      });
    });
  }

  handleError(errorInfo) {
    const timestamp = new Date().toISOString();
    const errorMessage = this.formatError(errorInfo, timestamp);

    if (this.options.logToConsole) {
      this.logToConsole(errorMessage);
    }

    if (this.options.logToFile) {
      this.logToFile(errorMessage);
    }

    if (this.options.logToUI) {
      this.showErrorDialog(errorMessage);
    }
  }

  formatError(errorInfo, timestamp) {
    return `
[${timestamp}]
Type: ${errorInfo.type}
Message: ${errorInfo.message}
${errorInfo.source ? `Source: ${errorInfo.source}` : ''}
${errorInfo.lineno ? `Line: ${errorInfo.lineno}` : ''}
${errorInfo.colno ? `Column: ${errorInfo.colno}` : ''}
${errorInfo.stack ? `Stack Trace:\n${errorInfo.stack}` : ''}
----------------------------------------`;
  }

  logToConsole(errorMessage) {
    console.error(errorMessage);
  }

  async logToFile(errorMessage) {
    if (chrome.runtime && chrome.runtime.getManifest().permissions.includes('fileSystem')) {
      try {
        const blob = new Blob([errorMessage + '\n'], { type: 'text/plain' });
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: this.options.logFilePath
        });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } catch (error) {
        console.error('Failed to write to file:', error);
      }
    }
  }

  showErrorDialog(errorMessage) {
    // 创建错误对话框
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
      <div style="padding: 20px; max-width: 600px;">
        <h2 style="color: #e32636;">Extension Error</h2>
        <pre style="background: #f5f5f5; padding: 10px; overflow-x: auto; white-space: pre-wrap;">${errorMessage}</pre>
        <button onclick="this.closest('dialog').close()">关闭</button>
      </div>
    `;
    
    // 添加样式
    dialog.style.cssText = `
      border: none;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-height: 80vh;
      overflow-y: auto;
    `;
    
    document.body.appendChild(dialog);
    dialog.showModal();
  }
}

// 示例用法
const errorHandler = new ExtensionErrorHandler({
  logToConsole: true,  // 在控制台显示错误
  logToFile: true,     // 保存错误到文件
  logToUI: true,       // 显示错误对话框
  logFilePath: 'extension-errors.log'
});

// 导出处理器
export default ExtensionErrorHandler;
