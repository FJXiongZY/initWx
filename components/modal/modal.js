import regeneratorRuntime from '../../utils/runtime';
const app = getApp();

Component({
	properties: {
		isshow: { // 切换默认显示
			type: Boolean,
			value: true
        },
        disableShade: { // 是否禁用遮罩点击关闭
            type: Boolean,
			value: true
        },
        contentBackground:{ // 内容区的默认颜色
            type: String,
            value: "#ffffff"
        }
	},
	methods: {
        // 防穿透
        _strike(){},
        // 显示模态框
		show() {
			this.setData({ isshow: true })
        },
        // 隐藏模态框
		hide() {
			this.setData({ isshow: false })
        },
        // 遮罩触发关闭
        shadeHide(e){
            if(this.data.disableShade) return false;
            this.hide();
        }
	}
})
