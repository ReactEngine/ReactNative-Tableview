
#import <UIKit/UIKit.h>

//Use react-native root views as reusable cells returned from cellForRowAtIndexPath.

@interface RNReactModuleCell : UITableViewCell {
}

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier bridge:(RCTBridge*) bridge data:(NSDictionary*)data indexPath:(NSIndexPath*)indexPath reactModule:(NSString*)reactModule tableViewTag:(NSNumber*)reactTag;

-(void)setUpAndConfigure:(NSDictionary*)data bridge:(RCTBridge*)bridge indexPath:(NSIndexPath*)indexPath reactModule:(NSString*)reactModule tableViewTag:(NSNumber*)reactTag;

@end