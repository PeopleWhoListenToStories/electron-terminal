// 获取操作系统信息
const useDate = () => {
    const strTime = ''
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDay();
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const seconds = new Date().getSeconds();
    // const amOrpm = new Date()
    strTime`${year}-${month}-${day}  ${hours}:${minutes}:${seconds}`
    return strTime
}

export default useDate

// 大家自行去熟悉下 API，接着假设我们有下面这样的结构存在：

// <div class="container">
//     <div class="shape-outside">
//       <img src="image.png">
//     </div>
//     xxxxxxxxxxx，文字描述，xxxxxxxxx
// </div>
// 定义如下 CSS：

// .shape-outside {
//     width: 160px;
//     height: 160px;
//     shape-outside: circle(80px at 80px 80px);
//     float: left;
// }

// 作者：哔哔one
// 链接：https://www.imooc.com/article/27838
// 来源：慕课网