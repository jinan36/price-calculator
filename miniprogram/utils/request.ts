export function staticFileRequest(options: WechatMiniprogram.RequestOption<string | Record<string, any> | ArrayBuffer>) {
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
            options.success && options.success(res)
        }
    })
}