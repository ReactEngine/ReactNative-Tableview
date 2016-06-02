//
//  RNScrollEvent.m
//  RNTableView
//
//  Created by Sun Jin on 16/6/2.
//  Copyright © 2016年 Pavlo Aksonov. All rights reserved.
//

#import "RNScrollEvent.h"
#import "RCTAssert.h"

@implementation RNScrollEvent
{
    UIScrollView *_scrollView;
    NSDictionary *_userData;
    uint16_t _coalescingKey;
}

@synthesize viewTag = _viewTag;
@synthesize eventName = _eventName;

- (instancetype)initWithEventName:(NSString *)eventName
                         reactTag:(NSNumber *)reactTag
                       scrollView:(UIScrollView *)scrollView
                         userData:(NSDictionary *)userData
                    coalescingKey:(uint16_t)coalescingKey
{
    RCTAssertParam(reactTag);
    
    if ((self = [super init])) {
        _eventName = [eventName copy];
        _viewTag = reactTag;
        _scrollView = scrollView;
        _userData = userData;
        _coalescingKey = coalescingKey;
    }
    return self;
}

RCT_NOT_IMPLEMENTED(- (instancetype)init)

- (uint16_t)coalescingKey
{
    return _coalescingKey;
}

- (NSDictionary *)body
{
    NSDictionary *body = @{
                           @"contentOffset": @{
                                   @"x": @(_scrollView.contentOffset.x),
                                   @"y": @(_scrollView.contentOffset.y)
                                   },
                           @"contentInset": @{
                                   @"top": @(_scrollView.contentInset.top),
                                   @"left": @(_scrollView.contentInset.left),
                                   @"bottom": @(_scrollView.contentInset.bottom),
                                   @"right": @(_scrollView.contentInset.right)
                                   },
                           @"contentSize": @{
                                   @"width": @(_scrollView.contentSize.width),
                                   @"height": @(_scrollView.contentSize.height)
                                   },
                           @"layoutMeasurement": @{
                                   @"width": @(_scrollView.frame.size.width),
                                   @"height": @(_scrollView.frame.size.height)
                                   },
                           @"zoomScale": @(_scrollView.zoomScale ?: 1),
                           };
    
    if (_userData) {
        NSMutableDictionary *mutableBody = [body mutableCopy];
        [mutableBody addEntriesFromDictionary:_userData];
        body = mutableBody;
    }
    
    return body;
}

- (BOOL)canCoalesce
{
    return YES;
}

- (RNScrollEvent *)coalesceWithEvent:(RNScrollEvent *)newEvent
{
    NSArray<NSDictionary *> *updatedChildFrames = [_userData[@"updatedChildFrames"] arrayByAddingObjectsFromArray:newEvent->_userData[@"updatedChildFrames"]];
    
    if (updatedChildFrames) {
        NSMutableDictionary *userData = [newEvent->_userData mutableCopy];
        userData[@"updatedChildFrames"] = updatedChildFrames;
        newEvent->_userData = userData;
    }
    
    return newEvent;
}

+ (NSString *)moduleDotMethod
{
    return @"RCTEventEmitter.receiveEvent";
}

- (NSArray *)arguments
{
    return @[self.viewTag, RCTNormalizeInputEventName(self.eventName), [self body]];
}

@end