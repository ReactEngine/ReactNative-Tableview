//
//  RNScrollEvent.h
//  RNTableView
//
//  Created by Sun Jin on 16/6/2.
//  Copyright © 2016年 Pavlo Aksonov. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RCTEventDispatcher.h"

@interface RNScrollEvent : NSObject <RCTEvent>

- (instancetype)initWithEventName:(NSString *)eventName
                         reactTag:(NSNumber *)reactTag
                       scrollView:(UIScrollView *)scrollView
                         userData:(NSDictionary *)userData
                    coalescingKey:(uint16_t)coalescingKey NS_DESIGNATED_INITIALIZER;

@end