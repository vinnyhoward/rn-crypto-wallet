#import "Didcomm.h"

@implementation Didcomm

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(helloWorld:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    const char* message = hello_world();
    NSString *messageString = [NSString stringWithUTF8String:message];
    free_string(message);
    resolve(messageString);
}

@end