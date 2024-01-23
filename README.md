# rtn-i18n

### 安装

```
npm i rtn-i18n
```

## 使用

**_注意：如果更换语言但页面没有重新加载，那么需要在该组件中使用 `useLangCode` 钩子函数_**

```js
import {createReactI18n, formatReactNode} from 'rtn-i18n';

export enum LangCode {
  zhHans = 'zh-Hans',
  en = 'en',
}

interface LangItem {
  label: string;
  code: LangCode;
}
export const langList: ReadonlyArray<Readonly<LangItem>> = [
  {label: '简体中文', code: LangCode.zhHans},
  {label: 'English', code: LangCode.en},
];

export const I18n = createReactI18n(
  {
    [LangCode.zhHans]: {
      Hello: '你好，{0}',
      World: '世界',
    } as const,
    [LangCode.en]: {
      Hello: 'Hello, {0}',
      World: 'World',
    } as const,
  },
  {
    // 匹配系统语言
    // 'zh', 'en' 这类 `code` 几乎可以匹配所有系统的 `langCode`, 所以可以忽略 `langScope`
    // 'zh-Hans' 这种 `code` 只能匹配 `zh-Hans-*` 这类 code, 就需要配置 `langScope`
    langScope: {
      [LangCode.zhHans]: ['zh-Hans', 'zh-CN', 'zh-SG', 'zh-MO'],
    },
    // 调用 setLangCode 时，传入 native 的值
    langMap: {
      [LangCode.zhHans]: {
        android: 'zh-CN',
      },
    },
  },
);

// 获取当前语言代码。
I18n.getLangCode();

I18n.t('Hello', I18n.t('World'));

formatReactNode(I18n.t('Hello'), I18n.t('World'));
```

### 说明

- 调用 `setLangCode` 时，默认传入 `code` 值，如果需要传入对应系统可识别的值（例如：android 平台不能传入 `zh-Hans`，而应该传入 `zh-CN`），需要在 `langMap` 中配置。
- 调用 `setLangCode` 时，android 平台会更改 native 端的 `Locale` 值，并保存到本地，下一次启动时会自动设置为对应值。
- `langScope` 中的值为系统可识别的值，例如：ios 的 `zh-Hans-CN` 可匹配 `zh-Hans`，android 的 `zh-CN`。
