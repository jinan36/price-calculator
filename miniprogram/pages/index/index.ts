import NP from 'number-precision'
import Toast, { hideToast } from 'tdesign-miniprogram/toast/index';
import { staticFileRequest } from '../../utils/request';
import { yuwanData } from "../../libs/data"

interface IProduct {
    name: string;
    price: number;
    priceShow?: number;
    count: number;
    unit: string;
}
interface IPriceJsonFile {
    updateTime: string;
    products: IProduct[];
}

// const app = getApp<IAppOption>()


Page({
    data: {
        updateTime: '1900/1/1',
        products: [] as IProduct[],
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
        this.setData(yuwanData)
        hideToast()
        // staticFileRequest<IPriceJsonFile>({
        //     url: 'https://123-1321901613.cos.ap-guangzhou.myqcloud.com',
        //     header: {
        //         'content-type': 'application/json'
        //     },
        //     success: response => {
        //         const { updateTime, products } = response.data
        //         this.setData({
        //             updateTime, products
        //         })
        //         const data: { [key: string]: number } = {}
        //         this.data.products.forEach((product, index) => {
        //             data[`products[${index}].priceShow`] = NP.divide(product.price, 100)
        //         })
        //         this.setData(data)

        //         hideToast()
        //     },
        //     fail: () => {
        //         hideToast()
        //     }
        // })
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
                // @ts-ignore
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
    },
    handleFabClick() {
        wx.makePhoneCall({ phoneNumber: "0591-26268999" })
    },
    adLoad() {
        console.log('Banner 广告加载成功')
    },
    adError(err) {
        console.error('Banner 广告加载失败', err)
    },
    adClose() {
        console.log('Banner 广告关闭')
    }
})
