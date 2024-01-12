import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  getConstants(): {langCode: string};
  setLangCode(langCode: string): void;
  // getSystemLangCode(): Promise<string>;
  // getCurrentLangCode(): Promise<string>;
}

export default TurboModuleRegistry.get<Spec>('LangCode') as Spec | null;
