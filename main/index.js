const { app, BrowserWindow } = require("electron");
let win;
app.on('ready', () => {
    win = new BrowserWindow({
        width: 800,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadURL('http://localhost:3000')
    // 打开开发者工具，默认不打开
    win.webContents.openDevTools()
})
// const { app, BrowserWindow } = require("electron");
// const processMessage = require('./processMessage')
//判断命令行脚本的第二参数是否含--debug
// const debug = /--debug/.test(process.argv[2]);
// let win;
// app.on('ready', () => {
//     win = new BrowserWindow({
//         width: 700,
//         height: 500,
//         webPreferences: {
//             nodeIntegration: true
//         }
//     })
//     win.loadURL('http://localhost:3000')

//     // //接收渲染进程的信息
//     // const ipc = require('electron').ipcMain;
//     // ipc.on('min', function () {
//     //     win.minimize();
//     // });
//     // ipc.on('max', function () {
//     //     win.maximize();
//     // });
//     // ipc.on("login", function () {
//     //     win.maximize();
//     // });
//     // //如果是--debug 打开开发者工具，窗口最大化，
//     // if (debug) {
//     //     win.webContents.openDevTools();
//     //     require('devtron').install();
//     // }

//     // win.on('closed', () => {
//     //     win = null
//     // })
//     // 打开开发者工具，默认不打开
//     win.webContents.openDevTools()
//     // const ProcessMessage = new processMessage(win)
//     // ProcessMessage.init()
// })


// //app主进程的事件和方法  当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
// app.on('ready', () => {
//     createWindow();
// });

// // app.on('window-all-closed', () => {
// //     // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
// //     if (process.platform !== 'darwin') {
// //         app.quit()
// //     }
// // });
// // app.on('activate', () => {
// //     // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
// //     if (win === null) {
// //         createWindow();
// //     }
// // });

// // globalShortcut.register("ctrl+d+t", () => win.webContents.openDevTools());
