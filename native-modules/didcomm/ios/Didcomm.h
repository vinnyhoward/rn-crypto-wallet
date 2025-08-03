#import <React/RCTBridgeModule.h>

// Declare the external C functions
#ifdef __cplusplus
extern "C" {
#endif

const char* hello_world(void);
void free_string(const char* ptr);

#ifdef __cplusplus
}
#endif

@interface Didcomm : NSObject <RCTBridgeModule>
@end