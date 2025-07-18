#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ProductCalendarModule, NSObject)

RCT_EXTERN_METHOD(addPurchaseReminder:(NSString *)title
                  date:(nonnull NSNumber *)date
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
