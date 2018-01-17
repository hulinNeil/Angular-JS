## 微信小游戏跳一跳-js版外挂

原理：

- 通过adb得到手机像素，屏幕截图
- 将截图画在canvas上面，通过画线得到起跳位置和落地位置的长度，以此算出长按手机屏幕的时间（time = length * 1.223）
- 通过adb命令达到长按的目的：adb shell input swipe 100 100 100 100 time（长按的坐标应该通过随机数得到，这样才不会被发现是外挂）

操作流程：

- 在目录执行 npm install
- 在index.js 里面把adbPath的路径改为安装adb的路径（例子里面的是HBuilder自带的adb的路径）
- 连接手机执行 node index 即可