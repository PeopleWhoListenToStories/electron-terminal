import { observable } from 'mobx'

// 创建的是实例对象
const userStore = observable({
    lastLoginDate: new Date().toLocaleString(),
    path: '', // 命令行目录
    command: '', // 用户输入命令
    handleCommand: '', // 经过处理的用户命令 比如清除首尾空格、添加获取路径的命令
    commandMsg: [], // 当前命令信息
    commandArr: [], // 过往命令行输出保存
    isActive: true, // 终端是否聚焦
    action: false, // 是否正在执行命令
    addPath: '', // 不同系统 获取路径的命令 mac是pwd window是chdir
    historyCommandArr: [], // 历史记录

    setAddPath(path) {
        this.addPath = path
    },

    setPath(path) {
        // console.log('setpath', path)
        this.path = path
    },

    setActive(value) {
        // console.log('setActive', value)
        this.isActive = value
    },

    setCommand(value) {
        // console.log('setCommand', value)
        this.command = value
    },

    setAction(value) {
        // console.log('setAction', value)
        this.action = value
    },

    setCommandArr(value) {
        // console.log('setCommandArr', value)
        this.commandArr.push(value);
        this.historyCommandArr.push(value)
    },

    setCommandMsg(value) {
        // console.log('setCommandMsg', value)
        this.commandMsg.push(value);
    },

    sethandleCommand(path) {
        // console.log('sethandleCommand', path)
        this.handleCommand = path
    },

    setCommandMsgFinish() {
        this.commandMsg = []
    },
    setCommandFinish() {
        this.command = ''
    },
    setActionFinsh() {
        this.action = false
    },

    setCommandArrFinsh() {
        this.commandArr = []
    }

})
export default userStore