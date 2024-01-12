import {debounce, getOnlyStr} from './utils/tools';

export type Option<C extends string, T extends JSONConstraint> = {
  [code in C]: T;
};

interface ListenerCodeFn<C> {
  (code: C): void;
}

interface SubscribeFn<T> {
  (value: T): void;
}

let serialNumber = 0;

export function createReactiveConstant<
  C extends string,
  T extends JSONConstraint,
>(opt: Option<C, T>, mark?: string) {
  serialNumber++;
  const _mark = mark || `SerialNumber-${serialNumber}`;

  const defaultActiveCode = Object.keys(opt)[0] as C;
  let activeCode = defaultActiveCode;
  const defaultValue = opt[defaultActiveCode] as T;

  type Key = keyof T;

  type ListenerId = string;
  const listenerCodeMap: {[id: ListenerId]: ListenerCodeFn<C> | undefined} = {};
  const listenerCodeIds: ListenerId[] = [];

  /**
   * @param fn - 监听函数
   * - 监听函数初始化执行一次
   * - 监听函数在每次更改 Code 时（执行 $setCode 时）执行
   * @returns function removeListener
   */
  function addListener(
    eventName: 'changeCode',
    fn: ListenerCodeFn<C>,
  ): () => void;
  function addListener(eventName: string, fn: ListenerCodeFn<C>) {
    if (eventName === 'changeCode') {
      try {
        fn(activeCode);
      } catch (error) {
        console.error(`${_mark} $addListener error:`, error);
      }
      const id: ListenerId = getOnlyStr(listenerCodeIds);
      listenerCodeMap[id] = fn;
      listenerCodeIds.push(id);
      return () => {
        listenerCodeMap[id] = undefined;
        listenerCodeIds.splice(listenerCodeIds.indexOf(id), 1);
      };
    }
  }

  function listenerCodeHandle(_activeCode: C) {
    for (let i = 0; i < listenerCodeIds.length; i++) {
      const listener = listenerCodeMap[listenerCodeIds[i]];
      try {
        listener && listener(_activeCode);
      } catch (error) {
        console.error(
          `${_mark} listener (id: ${listenerCodeIds[i]}) error:`,
          error,
        );
      }
    }
  }

  type SubscribeId = string;
  const subscribeMap: {
    [id: SubscribeId]: {fn: SubscribeFn<T>; keys?: Key[]} | undefined;
  } = {};
  const subscribeIds: SubscribeId[] = [];
  let effectKeys: Key[] = [];
  const effectHandler = debounce(
    (_value: T) => {
      subscribeIds.forEach(_id => {
        const subscribe = subscribeMap[_id];
        if (subscribe?.keys) {
          let hasSubscribe = false;
          for (const _key of effectKeys) {
            if (subscribe.keys.includes(_key)) {
              hasSubscribe = true;
            }
          }
          if (hasSubscribe) {
            try {
              subscribe.fn(_value);
            } catch (error) {
              console.error(`${_mark} subscribe (id: ${_id}) error:`, error);
            }
          }
        } else if (subscribe) {
          try {
            subscribe.fn(_value);
          } catch (error) {
            console.error(`${_mark} subscribe (id: ${_id}) error:`, error);
          }
        }
      });
      effectKeys = [];
    },
    {wait: 0},
  );

  const returnValue = {
    ...defaultValue,

    _interfaceType: 'ReactiveConstant',
    _mark,

    /**
     * - setValue 内部会进行数据的浅层对比。对比相同的属性，不会更新和触发订阅函数。
     * @param value - 不能是`undefined`和是函数
     */
    $setValue<K extends Key>(key: K, value: T[K]) {
      if (value === undefined) {
        console.error(
          `${_mark} $setValue error: "${String(
            key,
          )}" value cannot be undefined`,
        );
        return;
      }
      if (typeof value === 'function') {
        console.error(
          `${_mark} $setValue error: "${String(
            key,
          )}" value cannot be a function`,
        );
        return;
      }
      const oldValue = returnValue[key];
      if (typeof oldValue === 'function') {
        console.error(
          `${_mark} $setValue error: "${String(key)}" is a read-only function`,
        );
        return;
      }
      if (Object.is(oldValue, value)) {
        return;
      }

      returnValue[key] = value;
      effectKeys.push(key);
      effectHandler(returnValue);
    },
    $setCode(code: C) {
      if (activeCode !== code) {
        activeCode = code;

        const valueMap: T = opt[activeCode];
        if (!valueMap) {
          console.error(`${_mark} $setCode error: "${activeCode}" not found`);
          return;
        }

        Object.keys(valueMap).forEach(_key => {
          returnValue.$setValue(_key, valueMap[_key]);
        });
        listenerCodeHandle(activeCode);
      }
    },
    $getCode: () => activeCode,

    /**
     * @param fn - 订阅函数
     * - 初始化时会执行一次
     * - 使用 $setValue 时，内部在更新数据后才触发函数预计算，订阅函数获取的数据是最新的。
     * - 短时间内多次使用 $setValue 时，会触发防抖处理，订阅函数只执行一次。
     * @param keys - 订阅属性
     * - 只有订阅的属性发生了更改才触发执行订阅函数。如果不传入该参数，则所有属性更改都会执行。
     * - 如果传入空数组，则订阅函数只执行一次，并且不会返回 SubscribeId
     * @returns function unsubscribe
     */
    $subscribe<K extends Key>(fn: SubscribeFn<T>, keys?: K[]) {
      try {
        fn(returnValue);
      } catch (error) {
        console.error(`${_mark} $subscribe error:`, error);
      }

      if (keys?.length === 0) {
        return;
      }
      const id: SubscribeId = getOnlyStr(subscribeIds);
      subscribeIds.push(id);
      subscribeMap[id] = {
        fn,
        keys,
      };

      return () => {
        subscribeMap[id] = undefined;
        subscribeIds.splice(subscribeIds.indexOf(id), 1);
      };
    },

    $addListener: addListener,
  } as const;

  return returnValue;
}
