/**
 * 图片预加载
 */
export default (imgs) => {
    const fn = url => {
        const img = new Image()
        img.src = url
    }

    if(Array.isArray(imgs)) {
        imgs.forEach(item => fn(item))
    } else {
        fn(imgs)
    }
}