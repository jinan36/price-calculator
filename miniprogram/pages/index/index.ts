import NP from 'number-precision'
import Toast from 'tdesign-miniprogram/toast/index';

const app = getApp<IAppOption>()


Page({
    data: {
        products: [
            {
                name: "青鳗鱼丸",
                price: 3500,
                count: 0,
                unit: "斤"
            },
            {
                name: "马鲛鱼丸",
                price: 3000,
                count: 0,
                unit: "斤"
            },
            {
                name: "虾丸",
                price: 6500,
                count: 0,
                unit: "斤"
            },
            {
                name: "墨鱼丸",
                price: 7500,
                count: 0,
                unit: "斤"
            },
            {
                name: "正鮸鱼丸",
                price: 6500,
                count: 0,
                unit: "斤"
            },
            {
                name: "石斑鱼丸",
                price: 8500,
                count: 0,
                unit: "斤"
            },
            {
                name: "招牌酒糟鳗鱼",
                price: 2500,
                count: 0,
                unit: "斤"
            },
            {
                name: "精品酒糟鳗鱼",
                price: 3500,
                count: 0,
                unit: "斤"
            },
            {
                name: "招牌肉燕",
                price: 4000,
                count: 0,
                unit: "斤"
            },
            {
                name: "招牌芋泥",
                price: 2600,
                count: 0,
                unit: "份"
            },
            {
                name: "菠萝饭",
                price: 2500,
                count: 0,
                unit: "份"
            },
            {
                name: "鲨鱼滑",
                price: 3800,
                count: 0,
                unit: "斤"
            },
            {
                name: "鳗鱼滑",
                price: 3800,
                count: 0,
                unit: "斤"
            },
            {
                name: "正鮸鱼滑",
                price: 4500,
                count: 0,
                unit: "斤"
            },
            {
                name: "肉片",
                price: 2300,
                count: 0,
                unit: "斤"
            },
            {
                name: "鱼燕",
                price: 2600,
                count: 0,
                unit: "400g"
            },
            {
                name: "鱼饺",
                price: 2600,
                count: 0,
                unit: "斤"
            },
            {
                name: "白春只鱼面",
                price: 3800,
                count: 0,
                unit: "斤"
            },
            {
                name: "连江鸡卷",
                price: 3500,
                count: 0,
                unit: "斤"
            },
            {
                name: "头水紫菜",
                price: 5500,
                count: 0,
                unit: "250g"
            },
            {
                name: "鱼皮猪肉烧麦",
                price: 3000,
                count: 0,
                unit: "400g"
            },
            {
                name: "黄瓜鱼片干",
                price: 7500,
                count: 0,
                unit: "斤"
            },
            {
                name: "黄瓜鱼干",
                price: 2600,
                count: 0,
                unit: "只（约 250g)"
            },
            {
                name: "剥皮鱼干",
                price: 8500,
                count: 0,
                unit: "斤"
            },
            {
                name: "丝鳗鱼干",
                price: 8500,
                count: 0,
                unit: "斤"
            },
            {
                name: "肉昌鱼干",
                price: 4500,
                count: 0,
                unit: "斤"
            },
            {
                name: "白春鱼干",
                price: 4200,
                count: 0,
                unit: "斤"
            },
            {
                name: "鮸鱼干",
                price: 8500,
                count: 0,
                unit: "斤"
            },
            {
                name: "白昌鱼干",
                price: 6000,
                count: 0,
                unit: "斤"
            },
            {
                name: "小虾米",
                price: 3500,
                count: 0,
                unit: "罐（约 250g）"
            },
            {
                name: "大虾米",
                price: 6500,
                count: 0,
                unit: "罐（约 250g）"
            },
            {
                name: "丁香鱼干",
                price: 3500,
                count: 0,
                unit: "罐（约 250g）"
            },
            {
                name: "盐带鱼",
                price: 3000,
                count: 0,
                unit: "400g",
                defaultText: "时价"
            },
            {
                name: "鱿鱼干",
                price: 17500,
                count: 0,
                unit: "斤"
            },
            {
                name: "目鱼干",
                price: 12500,
                count: 0,
                unit: "斤"
            },
            {
                name: "小蛏干",
                price: 23000,
                count: 0,
                unit: "斤"
            },
            {
                name: "大蛏干",
                price: 3000,
                count: 0,
                unit: "400g",
                defaultText: "缺货"
            },
        ],
        total: 0,


        visible: true,
        marquee1: {
            speed: 50,
            loop: -1,
            delay: 3000,
        },
        saftBottomHeight: 0
    },
    onLoad() {
        const systemInfo = wx.getSystemInfoSync()
        this.setData({ saftBottomHeight: systemInfo.screenHeight - systemInfo.safeArea.height - systemInfo.statusBarHeight })

        const products = this.data.products
        const data: { [key: string]: number } = {}
        products.forEach((product, index) => {
            data[`products[${index}].priceShow`] = NP.divide(product.price, 100)
        })
        this.setData(data)
    },
    onShareAppMessage() {
        return {
            title: "荘家鱼丸",
            path: '/pages/index/index'
        }
    },


    handleCountChange(e: WechatMiniprogram.CustomEvent) {
        const { value } = e.detail
        const { index } = e.currentTarget.dataset

        this.setData({
            [`products[${index}].count`]: value
        })
        this.calculate()
    },
    reset() {
        const products = this.data.products
        const data: { [key: string]: number } = {}
        products.forEach((product, index) => {
            if (product.count !== 0)
                data[`products[${index}].count`] = 0
        })
        this.setData(data)
        this.calculate()
    },
    calculate() {
        const products = this.data.products
        const total = products.reduce((prev, cur) => {
            return NP.plus(prev, NP.times(cur.price, cur.count))
        }, 0)
        this.setData({
            total: NP.divide(total, 100)
        })
    },
    copySelectedInformation() {
        const products = this.data.products
        const data: string[] = []
        products.forEach((product) => {
            if (product.count !== 0)
                data.push(`${product.name} ${product.priceShow} 元 / ${product.unit} * ${product.count} = ${NP.divide(NP.times(product.price, product.count), 100)} 元\r\n`)
        })
        if (data.length > 0) {
            data.push(`\r\n商品合计：${this.data.total} 元`)
        } else {
            Toast({
                context: this,
                selector: '#t-toast',
                message: '还没有选择商品哦',
                theme: 'warning',
                direction: 'column',
            });
            return
        }
        wx.setClipboardData({
            data: data.reduce((prev, content) => prev + content, ''),
            success: () => {
                setTimeout(() => {
                    Toast({
                        context: this,
                        selector: '#t-toast',
                        message: '复制成功，发送给店员下单吧',
                        theme: 'success',
                        direction: 'column',
                        duration: 4000
                    });
                }, 1500)
            }
        })

    }
})
