export type StorageSetItemEvent = { key?: string, newValue?: string } & Event
export const dispatchEventStorage = () => {
  const storage = window.localStorage
  const localStorageMock = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItem: (key: string, value: any) => {
      const setEvent: StorageSetItemEvent = new Event('storageSetItemEvent')
      setEvent.key = key
      setEvent.newValue = value
      window.dispatchEvent(setEvent)
      Reflect.set(storage, key, value)
      return true
    },
    getItem: (key: string) => {
      return Reflect.get(storage, key)
    },
    removeItem: (key: string) => {
      storage[key] = null
      return true
    },
    clear: () => {
      storage.clear()
      return true
    },
    key: (index: number) => {
      return storage.key(index)
    },
    length: storage.length
  }
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  })
}

export const getRoot = () => {
  return window.document.querySelector(':root') as HTMLElement
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setProperty = (key: string, value: any) => {
  return getRoot().style.setProperty(key, value)
}

export const getPropertyValue = (property: string) => {
  return getComputedStyle(getRoot()).getPropertyValue(property)
}

export const imgReady = (pics: Array<string>) => {
  const picsAll = pics.map((imgUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      // 提取图片地址
      img.src = imgUrl
        .replace('src=', '')
        .replace('amp;', '')
        .replace(/^['|"](.*)['|"]$/, '$1')
      img.onload = () => resolve(imgUrl)
      img.onerror = () => reject(new Error(imgUrl + ' load error'))
    })
  })
  return Promise.all(picsAll)
    .then(() => {
      return true
    })
    .catch(() => {
      return false
    })
}

export const loadJs = (src:string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    document.body.appendChild(script)
    script.onload = () => {
      resolve(true)
    }

    script.onerror = (error) => {
      reject(error)
    }
  })
}
