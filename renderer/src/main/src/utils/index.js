export const formaterStrOrLine = (str) => {
    // 以/r/n 作为切割符号的标记
    // let arr = pySort(str.split(/[\s\n]/), '')
    // return arr
    return str.split(/[\s\n]/)
}

const pySort = (arr, empty) => {
    if (!String.prototype.localeCompare)
        return null;
    let regChinese = /[^\u4E00-\u9FA5]/;
    let regChar = /[A-Za-z]/;
    let letters = "ABCDEFGHJKLMNOPQRSTWXYZ".split('');
    let zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');
    let arrList = arr
    let result = [];
    let curr;
    for (let i = 0; i < letters.length; i++) {
        curr = { letter: letters[i], data: [] };
        if (i != 26) {
            for (let j = 0; j < arrList.length; j++) {
                let initial = arrList[j].charAt(0);//截取第一个字符
                if (arrList[j].charAt(0) == letters[i] || arrList[j].charAt(0) == letters[i].toLowerCase()) {   //首字符是英文的
                    curr.data.push(arrList[j]);
                } else if (zh[i] != '*' && regChinese.test(initial)) {      //判断是否是无汉字,是否是中文
                    if (initial.localeCompare(zh[i]) >= 0 && (!zh[i + 1] || initial.localeCompare(zh[i + 1]) < 0)) {   //判断中文字符在哪一个类别
                        curr.data.push(arrList[j]);
                    }
                }
            }
        } else {
            for (let k = 0; k < arrList.length; k++) {
                let ini = arrList[k].charAt(0);           //截取第一个字符
                if (!(!regChar.test(ini)) && !regChinese.test(ini)) {
                    curr.data.push(arrList[k]);
                }
            }
        }
        if (empty || curr.data.length) {
            result.push(curr);
            // curr.data.sort(function (a, b) {
            //     return b.localeCompare(a);       //排序,英文排序,汉字排在英文后面
            // });
        }
    }
    let newArrs = []
    result.forEach(item => {
        newArrs = [...newArrs, ...item.data]
    });
    return newArrs
}

