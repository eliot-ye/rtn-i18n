export function logNameValueBase(
  color: string,
  name: string | number = "",
  value: string | number = "",
  ...orderValue: any[]
) {
  if (__DEV__) {
    console.log(
      `%c ${name} %c ${value} %c`,
      "background: #35495e; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
      `background: ${color}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`,
      "background: transparent",
      ...orderValue
    );
  }
}
export const CusLog = {
  success(
    name?: string | number,
    value?: string | number,
    ...orderValue: any[]
  ) {
    logNameValueBase("#41b883", name, value, ...orderValue);
  },
  error(name?: string | number, value?: string | number, ...orderValue: any[]) {
    logNameValueBase("red", name, value, ...orderValue);
  },
};

/** 获取一个随机6位字符串加时间戳的字符串，格式为 `{randomString}:{timestamp}` */
export function getRandomStr(): `${string}:${number}` {
  return `${Math.random().toString(36).slice(-8)}:${new Date().getTime()}`;
}

/**
 * 获取一个不属于 comparative 的随机字符串
 * @param comparative - 需要排除的字符串集合
 * @param length - 字符串长度，默认长度：8
 * */
export function getOnlyStr(comparative: string[], length = 8): string {
  const str = Math.random().toString(36).slice(-length);
  if (comparative.includes(str)) {
    return getOnlyStr(comparative, length);
  }
  return str;
}

/** 获取 [n,m] 范围内的随机整数 */
export function getRandomInteger(n: number, m: number) {
  return Math.floor(Math.random() * (m - n + 1)) + n;
}

/**
 * 提取 url 的 query
 * @param url 需要提取的 url
 * @param key query 的 key
 */
export function getUrlQuery(url: string, key: string) {
  if (!url.includes("?")) {
    return undefined;
  }
  const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`, "i");
  const resultList = url.split("?")[1].match(reg);
  return resultList ? decodeURIComponent(resultList[2]) : undefined;
}

/**
 * 防抖函数
 * @return - 防抖函数体
 */
export function debounce<T extends Array<any>>(
  callback: (...args: T) => void,
  option: {
    /**
     * 延迟毫秒数
     * @default 500
     * */
    wait?: number;
    /**
     * - immediate=true 调用函数体时，callback 被立即调用，并锁定不能再调用。函数体会从上一次被调用后，倒计时 wait 毫秒后解锁可调用 callback。
     * - immediate=false 函数体会从上一次被调用后，延迟 wait 毫秒后调用 callback；
     * @default false
     * */
    immediate?: boolean;
  } = {}
): (...args: T) => void {
  let timer: any = null;
  const { wait = 500, immediate = false } = option;
  return (...args: T) => {
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate) {
      if (!timer) {
        callback(...args);
      }
      timer = setTimeout(() => (timer = null), wait);
    } else {
      timer = setTimeout(() => {
        timer = null;
        callback(...args);
      }, wait);
    }
  };
}

/**
 * 节流函数。函数体在 wait 毫秒内多次调用，callback 只触发一次
 * @return - 节流函数体
 */
export function throttle<T extends Array<any>>(
  callback: (...args: T) => void,
  /**
   * 间隔时间，单位：毫秒
   * @default 500
   * */
  wait: number = 500
): (...args: T) => void {
  let startTime = 0;
  return (...args: T) => {
    const now = +new Date();
    if (now - startTime >= wait) {
      startTime = now;
      callback(...args);
    }
  };
}

export function getValueFromStringKey(strKey: string, objState: any) {
  const keyList = strKey.split(".");
  let data = objState;
  for (const key of keyList) {
    data = data[key];
  }
  return data;
}
