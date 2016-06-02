//
//  RNGroupedTableViewManager.m
//  RNTableView
//
//  Created by Sun Jin on 16/6/2.
//  Copyright © 2016年 Pavlo Aksonov. All rights reserved.
//

#import "RNGroupedTableViewManager.h"
#import "RNTableView.h"

@implementation RNGroupedTableViewManager

RCT_EXPORT_MODULE()
- (UIView *)view {
    return [[RNTableView alloc] initWithBridge:self.bridge style:UITableViewStyleGrouped];
}

@end
