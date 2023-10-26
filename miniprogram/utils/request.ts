type IAnyObject = Record<string, any>
export function staticFileRequest<T extends string | IAnyObject | ArrayBuffer =
    | string
    | IAnyObject
    | ArrayBuffer>(options: WechatMiniprogram.RequestOption<T>) {
    const data = wx.getStorageSync(options.url) || {}
    wx.request({
        ...options,
        header: {
            ...options.header,
            'If-None-Match': data.ETag || '',
        },
        success: (res) => {
            if (res.header.ETag === data.ETag && data.data) {
                options.success && options.success(data.data)
                return
            }
            wx.setStorageSync(options.url, {
                ETag: res.header.ETag,
                data: res
            })
            // @ts-ignore
            options.success && options.success(res)
        }
    })
}