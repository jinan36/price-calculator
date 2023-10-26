import NP from 'number-precision'
import Toast, { hideToast } from 'tdesign-miniprogram/toast/index';
import { staticFileRequest } from '../../utils/request';

const app = getApp<IAppOption>()


Page({
    data: {
        updateTime: '1900/1/1',
        products: [
            {
                name: "青鳗鱼丸",
                price: 3500,
                count: 0,
                unit: "斤"
            }
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

        Toast({
            context: this,
            selector: '#t-toast',
            message: '加载中...',
            theme: 'loading',
            direction: 'column',
            duration: 0
        });

        staticFileRequest({
            url: 'http://175.178.224.140:3000/miniapp-yuwan.json',
            header: {
                'content-type': 'application/json'
            },
            success: response => {
                const { updateTime, products } = response.data
                this.setData({
                    updateTime, products
                })
                const data: { [key: string]: number } = {}
                this.data.products.forEach((product, index) => {
                    data[`products[${index}].priceShow`] = NP.divide(product.price, 100)
                })
                this.setData(data)

                hideToast()
            },
            fail: () => {
                hideToast()
            }
        })
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
