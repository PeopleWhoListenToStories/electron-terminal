/* eslint-disable react-hooks/rules-of-hooks */
import './index.scss'
import React, { useEffect, useState } from 'react'
import store from '../../store/index'
import useOsInfo from '../../hooks/useOsInfo'
import Weather from '../weather/index'
import { useObserver } from "mobx-react-lite"
import { spawn } from 'child_process'
import { Input } from 'antd';
import { formaterStrOrLine } from '../../utils/index'
import { FrownTwoTone, CheckCircleTwoTone, LoadingOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea'
const electron = window.require('electron');
const { ipcRenderer } = electron

const dateList = [
    {
        id: 0,
        name: '凌晨',
        min: 0,
        max: 2,
    },
    {
        id: 1,
        name: '黎明',
        min: 2,
        max: 5,
    }, {
        id: 3,
        name: '拂晓',
        min: 5,
        max: 6,
    }, {
        id: 4,
        name: '清晨',
        min: 6,
        max: 7,
    }, {
        id: 5,
        name: '早晨',
        min: 7,
        max: 8,
    }, {
        id: 6,
        name: '上午',
        min: 8,
        max: 11,
    }, {
        id: 7,
        name: '中午',
        min: 11,
        max: 13,
    }, {
        id: 8,
        name: '下午',
        min: 13,
        max: 16,
    }, {
        id: 9,
        name: '黄昏',
        min: 16,
        max: 17,
    }, {
        id: 10,
        name: '傍晚',
        min: 17,
        max: 18,
    }, {
        id: 11,
        name: '晚上',
        min: 18,
        max: 22,
    }, {
        id: 12,
        name: '夜间',
        min: 22,
        max: 24,
    }
]
export default function index() {
    const { User } = store
    const [inputValue, setInputValue] = useState('')
    const [domscrollOff, setDomscrollOff] = useState(0)
    const [dateTime, useDateTime] = useState('')
    const [dateExtName, useDateExtName] = useState('')
    const [loading, setLoading] = useState(false)

    let inputDomRef = React.createRef();
    let containerRef = React.createRef();
    let wrapperRef = React.createRef();
    useEffect(() => {
        addGetPath()
        // 初始化路径
        User.setPath(process.cwd())
        watchFocus()
        // scrollBottom()
        formatterDate()
        inputDomRef.current.focus({
            cursor: 'end',
        });
        return () => { }
    }, [])

    useEffect(() => {
        if (inputValue !== '') {
            User.setCommand(inputValue)
        }
    }, [inputValue])

    useEffect(() => {
        const timer = setInterval(() => {
            const { extName, time } = formatterDate()
            useDateTime(time)
            useDateExtName(extName)
        }, 500)
        return (() => {
            clearInterval(timer)
        })
    }, [])

    // 获取不同系统下的路径
    function addGetPath() {
        const systemName = useOsInfo()
        if (systemName === 'Mac') {
            User.setAddPath(' && pwd')
        } else if (systemName === 'Windows') {
            User.setAddPath(' && chdir')
        }
    }

    // 监听窗口聚焦、失焦
    function watchFocus() {
        ipcRenderer.on('win-focus', (event, message) => {
            console.log('窗口聚焦、失焦...', event, message)
            User.setActive(message)
            if (message) {
                focusInput()
            }
        })
    }

    // 聚焦输入
    function focusInput() {
        console.log('666', inputDomRef.current)
        // inputDomRef.current.focus() //解决ff不获取焦点无法定位问题
        // var range = window.getSelection() //创建range
        // range.selectAllChildren(inputDomRef.current) //range 选择obj下所有子内容
        // range.collapseToEnd() //光标移至最后
        inputDomRef.current.focus()
        ipcRenderer.send('page-ready') // 告诉主进程页面准备好了
    }

    // 点击div
    function timeoutFocusInput() {
        // const timer = setTimeout(() => {
        // focusInput()
        // }, 200)

        // clearTimeout(timer)
    }

    // 回车执行命令
    function keyFn() {
        actionCommand()
        setInputValue('')
        setDomscrollOff(Date.now())
    }

    // 执行命令
    function actionCommand() {
        const command = User.command?.trim()
        console.log(command, 'command...')
        isClear(command)
        if (User.command === '') return
        User.setAction(true)
        User.sethandleCommand(cdCommand(command))
        const ls = spawn(cdCommand(command), {
            encoding: 'utf8',
            cwd: User.path, // 执行命令路径
            shell: true, // 使用shell命令
        })
        // 监听命令行执行过程的输出
        ls.stdout.on('data', (data) => {
            const value = data.toString().trim()
            User.setCommandMsg(value)
            console.log(`stdout: ${value}`)
        })
        // 错误或详细状态进度报告 比如 git push、 git clone 
        ls.stderr.on('data', (data) => {
            const value = data.toString().trim()
            User.setCommandMsg(`stderr: ${value}`)
            console.log(`stderr: ${data}`)
        })
        // 子进程关闭事件 保存信息 更新状态
        ls.on('close', closeCommandAction)
    }

    // 执行完毕 保存信息 更新状态
    function closeCommandAction(code) {
        // 保存执行信息
        User.setCommandArr({
            code, // 是否执行成功
            path: User.path, // 执行路径
            command: User.command, // 执行命令
            commandMsg: User.commandMsg, // 执行信息
        })
        // 清空
        updatePath(User.handleCommand, code)
        commandFinish()
        console.log(
            `子进程退出，退出码 ${code}, 运行${code === 0 ? '成功' : '失败'}`
        )
    }

    // cd命令处理
    function cdCommand(command) {
        let pathCommand = ''
        if (User.command?.startsWith('cd ')) {
            pathCommand = User.addPath
        } else if (User.command?.indexOf(' cd ') !== -1) {
            pathCommand = User.addPath
        }
        return command + pathCommand
        // 目录自动联想...等很多细节功能 可以做但没必要2
    }

    // 清空历史
    function isClear(command) {
        console.log('command === clear', command === 'clear')
        if (command === 'clear') {
            User.setCommandArrFinsh()
            commandFinish()
        }
    }

    // 命令执行完毕 重置参数
    function commandFinish() {
        User.setCommandMsgFinish()
        User.setCommandFinish()
        console.log('??!23123123123', inputDomRef.current)
        User.setActionFinsh()
        // 激活编辑器
        // this.$nextTick(() => {
        //     this.focusInput()
        //     this.scrollBottom()
        // })
    }

    // 判断命令是否添加过addPath
    function updatePath(command, code) {
        if (code !== 0) return
        const isPathChange = command.indexOf(User.addPath) !== -1
        if (isPathChange) {
            User.setPath(User.commandMsg[User.commandMsg.length - 1])
        }
    }

    // 修改页面滚动条到最底部
    function scrollBottom() {
        console.log(containerRef.current.scrollHeight + 175, '🐯')
        wrapperRef.current.scrollTo(0, containerRef.current.scrollHeight + 75)
    }

    // 处理时间
    function formatterDate() {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const day = new Date().getDay() + 2;
        const hours = new Date().getHours();
        const minutes = new Date().getMinutes();
        const seconds = new Date().getSeconds();
        let strTime = `${year}-${month}-${day} ${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
        let isTimeExt = dateList.find(item => item.max > hours && item.min <= hours)
        return {
            extName: isTimeExt?.name,
            time: strTime
        }
    }

    function RenderCommand(item, index) {
        return <>
            <span style={{ padding: '0 .05rem' }}>
                {
                    item.code === 0 ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <FrownTwoTone twoToneColor="#eb2f96" />
                }
            </span>
            <span className="command-action-path">{item.path} $ </span>
            <span className='command-action-contenteditable'>{item.command}</span>
            <div style={{ padding: '.05rem .4rem' }}>
                {
                    item.code === 0 ? <div className="command-action-msg-gird">
                        {
                            formaterStrOrLine(item.commandMsg[0]).map((childItem, childIndex) => {
                                return <span key={childIndex} className={item.code === 0 ? 'command-action-true' : 'command-action-false'}>{childItem}</span>
                            })
                        }
                    </div>
                        : <span className='command-action-false' >{item.commandMsg.toString().slice(16)}</span> // 截取掉前面的信息 留下报错信息
                }
            </div>
        </>
    }

    return useObserver(() =>
        < div className="wrapper" ref={wrapperRef} >
            <div className="wrapper-title">
                Last login: {User.lastLoginDate}
            </div>
            <div className="wrapper-login">
                {/* logn */}
            </div>
            <div className="wrapper-container" ref={containerRef}>
                {/* 渲染过往的命令行 */}
                {
                    User.commandArr.length > 0 && User.commandArr.map((item, index) => {
                        return < >
                            <div key={index} className="command-action">
                                {RenderCommand(item, index)}
                            </div>
                        </>
                    })
                }
                <div className="command-action command-action-editor" onMouseUp={() => { timeoutFocusInput() }}>
                    <span style={{ padding: '0 .05rem' }}>{<LoadingOutlined />}</span>
                    <span className="command-action-path">{User.path} $</span>
                    <Input
                        placeholder="Please input"
                        ref={inputDomRef}
                        className="command-action-input"
                        value={inputValue}
                        onChange={(e) => { setInputValue(e.target.value) }}
                        onPressEnter={() => { keyFn() }}
                    />
                    {/* <span className="command-action-date">{Date.now()}</span> */}
                    {/* <div className="command-action-date"> {dateTime} {dateExtName} </div> */}
                    <div className="command-action-date">
                        <Weather dateTime={dateTime} dateExtName={dateExtName} />
                    </div>
                </div>
                {/* 当前命令行输出 */}
                <div className="output-command">
                    {
                        User.commandMsg.length > 0 && User.commandMsg.map((item, index) => {
                            return <div key={index}>{item}</div>
                        })
                    }
                </div>
            </div >
            {/* <Input
                className="command-action-contenteditable"
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value) }}
                onPressEnter={() => { keyFn() }}
            /> */}
            {/* 
                < span
                    ref={inputDomRef}
                    className="command-action-contenteditable"
                    contentEditable={User.action ? false : 'plaintext-only'}
                    onInput={(e) => {
                        setInputValue(e.target.value)
                    }}
                    onKeyUp={(e) => { keyFn(e) }}
                >
                </span>
             */}
            <div style={{ height: '1000px' }}></div>
        </div >
    )
}
