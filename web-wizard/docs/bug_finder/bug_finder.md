要求: 
无论是content脚本还是后台脚本，或者是Option、index、pop等, 只要是出现问题, 都很容易捕获到错误。效果包括: 
- 视觉和听觉
- 不要求输出到文件。// 因为有权限隐私问题
表现形式可以是:
- 弹窗、输出到控制台、在命令行表现, 
- 在一个 单独的页面 error.html 中展示错误信息。
  - 可以通过点击弹窗按钮, 打开这个页面。
  - 在这个界面最好可以手动 miss 掉所有的错误提醒。
- 扩展的图标, 状态也要有表现。 有多少error就展示多少红点(数字)
- 能调用Notification展示一些信息。
  - 如果没有权限, 提示开启
  

对于页面表现出来的错误提醒， 需要有debounce处理。