// 注册此方法到Page中，需要进行双向绑定的
// 的input控件
// bindinput="bindInput" 
// data-name='login.username'  : 需要双向绑定的属性
module.exports = {
    bindInput(e){
        let { name } = e.currentTarget.dataset;
        let nameMap = {}
        if (name.indexOf('.')>=0) {
            let nameList = name.split('.')
            if (this.data[nameList[0]]) 
                nameMap[nameList[0]] = this.data[nameList[0]]
             else 
                nameMap[nameList[0]] = {}
            nameMap[nameList[0]][nameList[1]] = e.detail.value
        } else {
            nameMap[name] = e.detail.value
        }
        this.setData(nameMap)
    }
}