const myLocalStorage = {

    initRun() {
        const reg = new RegExp('__expires__')
        let data = localStorage
        let list = Object.keys(data)
        if (list.length > 0) {
            list.map((key) => {
                if (!reg.test(key)) {
                    let now = Date.now()
                    let expires = data[`${key}__expires__`] || Date.now() + 1;
                    if (now >= expires) {
                        this.remove(key);
                    }
                }
                return key
            })
        }
    },

    set(key, value, expired, setShort = false) {
        //key 键
        //value 值
        // expires 过期时间，以分钟为单位

        const source = localStorage
        //加密存储
        source[key] = window.btoa(window.encodeURIComponent(JSON.stringify(value)))
        //如果设置了过期时间
        if (expired) {
            source[`${key}__expires__`] = Date.now() + 1000 * 60 * expired  //毫秒 短效时间
            if (!setShort) {
                source[`${key}__long_expires__`] = Date.now() + 1000 * 60 * expired * 7 //7倍 长效时间
            }
        }
    },

    get(key) {
        const source = localStorage;
        const now = Date.now();
        let expired = Date.now() + 1, long_expired
        if (source[`${key}__expires__`]) {
            expired = source[`${key}__expires__`]
            long_expired = source[`${key}__long_expires__`]
        }
        //如果超出了设置的短效时间 就删除key 返回null
        if (now >= expired) {
            //同时超出了设置的长效时间 就删除key 返回null
            if (now >= long_expired) {
                this.remove(key)
                return null
            } else {
                //没有超出长效时间 重新设置短效过期时间的key
                let value = JSON.parse(decodeURIComponent(window.atob(source[key])))
                this.set(key, value, 1440, true)  //重新设置了24h的短效时间
                return value
            }
        }
        //否则就return 当前key对应的值
        return JSON.parse(decodeURIComponent(window.atob(source[key])))
    },

    remove(key) {
        const source = localStorage
        delete source[key];
        delete source[`${key}__expires__`];
        delete source[`${key}__long_expires__`];
    }
}

export default myLocalStorage;