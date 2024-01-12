#import "RTNLangCode.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RTNI18nSpec.h"
#endif

@implementation RTNLangCode

RCT_EXPORT_MODULE(LangCode)

+ (BOOL)requiresMainQueueSetup
{
  return NO;  // only do this if your module initialization relies on calling UIKit!
}

- (NSDictionary *)getConstants
{
  return [self constantsToExport];
}
- (NSDictionary *)constantsToExport
{
  return @{ @"langCode": [self getCurrentLanguage] };
}

-(NSString*) getCurrentLanguage
{
  NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
  NSString* langCode = [userDefault objectForKey:@"langCode"];
  if (langCode != nil ) { return langCode; }

  return [[NSLocale preferredLanguages] objectAtIndex:0];
}

RCT_REMAP_METHOD(setLangCode, langCode:(NSString *)langCode)
{
    NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
  [userDefault setObject:langCode forKey:@"langCode"];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeI18nSpecJSI>(params);
}
#endif

@end