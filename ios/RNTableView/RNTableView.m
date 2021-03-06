//
//  SVGUse.m
//  SVGReact
//
//  Created by Pavlo Aksonov on 07.08.15.
//  Copyright (c) 2015 Pavlo Aksonov. All rights reserved.
//


#import "RCTConvert.h"
#import "RCTUtils.h"
#import "RCTUIManager.h"
#import "RCTRefreshControl.h"

#import "UIView+React.h"
#import "UIView+Private.h"

#import "RNTableView.h"
#import "JSONDataSource.h"
#import "RNCellView.h"
#import "RNTableFooterView.h"
#import "RNTableHeaderView.h"
#import "RNReactModuleCell.h"
#import "RNScrollEvent.h"

#pragma mark -
#pragma mark RNTableView

@interface RNTableView() {
    id<RNTableViewDatasource> datasource;
}
@property (strong, nonatomic) NSMutableArray *selectedIndexes;
@property (strong, nonatomic) UITableView *tableView;
@property (strong, nonatomic) UIRefreshControl *refreshControl;

@end

@implementation RNTableView {
    RCTBridge *_bridge;
    RCTEventDispatcher *_eventDispatcher;
    NSArray *_items;
    NSMutableArray *_cells;
    NSString *_reactModuleCellReuseIndentifier;

    
    NSTimeInterval _lastScrollDispatchTime;
    NSMutableArray<NSValue *> *_cachedChildFrames;
    BOOL _allowNextScrollNoMatterWhat;
    CGRect _lastClippedToRect;
    
    uint16_t _coalescingKey;
    NSString *_lastEmittedEventName;
}

#pragma mark -
#pragma mark Constructors

- (instancetype)initWithBridge:(RCTBridge *)bridge style:(UITableViewStyle)style {
    RCTAssertParam(bridge);
    
    if ((self = [super initWithFrame:CGRectZero])) {
        _bridge = bridge;
        while ([_bridge respondsToSelector:NSSelectorFromString(@"parentBridge")]
               && [_bridge valueForKey:@"parentBridge"]) {
            _bridge = [_bridge valueForKey:@"parentBridge"];
        }
        _eventDispatcher = bridge.eventDispatcher;
        _cellHeight = 44;
        _cells = [NSMutableArray array];
        _autoFocus = YES;
        _allowsToggle = NO;
        
        [self createTableViewWithStyle:style];
    }
    return self;
}

- (void)createTableViewWithStyle:(UITableViewStyle)style {
    _tableView = [[UITableView alloc] initWithFrame:CGRectZero style:style];
    _tableView.dataSource = self;
    _tableView.delegate = self;
    _tableView.allowsMultipleSelectionDuringEditing = NO;
    _tableView.contentInset = self.contentInset;
    _tableView.backgroundColor = [UIColor clearColor];
    
    _reactModuleCellReuseIndentifier = @"ReactModuleCell";
    [_tableView registerClass:[RNReactModuleCell class] forCellReuseIdentifier:_reactModuleCellReuseIndentifier];
    
    [self addSubview:_tableView];
}

- (void)dealloc {
    _tableView.delegate = nil;
}

RCT_NOT_IMPLEMENTED(-initWithFrame:(CGRect)frame)
RCT_NOT_IMPLEMENTED(-initWithCoder:(NSCoder *)aDecoder)

#pragma mark -
#pragma mark React View Hierarchy

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex {
    // will not insert because we don't need to draw them
    //   [super insertSubview:subview atIndex:atIndex];
    
    // just add them to registry
    if ([subview isKindOfClass:[RNCellView class]]){
        RNCellView *cellView = (RNCellView *)subview;
        cellView.tableView = self.tableView;
        while (cellView.section >= [_cells count]){
            [_cells addObject:[NSMutableArray array]];
        }
        [_cells[cellView.section] addObject:subview];
        if (cellView.section == [_sections count]-1 && cellView.row == [_sections[cellView.section][@"count"] integerValue]-1){
            [self.tableView reloadData];
        }
    } else if ([subview isKindOfClass:[RNTableFooterView class]]){
        RNTableFooterView *footerView = (RNTableFooterView *)subview;
        footerView.tableView = self.tableView;
    } else if ([subview isKindOfClass:[RNTableHeaderView class]]){
        RNTableHeaderView *headerView = (RNTableHeaderView *)subview;
        headerView.tableView = self.tableView;
    } else if ([subview isKindOfClass:[RCTRefreshControl class]]) {
        [self addRefreshControl:(UIRefreshControl *)subview];
    }
}

- (void)removeReactSubview:(UIView *)subview {
    if ([subview isKindOfClass:[RCTRefreshControl class]]) {
        [self removeRefreshControl];
    }
}

- (NSArray<UIView *> *)reactSubviews {
    if (self.refreshControl) {
        return @[self.refreshControl];
    }
    return @[];
}

#pragma mark -
#pragma mark Refresh Control

- (void)addRefreshControl:(UIRefreshControl *)refreshControl {
    // remove old refreshControl
    [self removeRefreshControl];
    // add new refreshControl
    self.refreshControl = refreshControl;
    [self.tableView addSubview:refreshControl];
}

- (void)removeRefreshControl {
    [self.refreshControl removeFromSuperview];
    self.refreshControl = nil;
}

- (void)endRefreshing {
    [self.refreshControl endRefreshing];
}

#pragma mark -

- (void)setRemoveClippedSubviews:(__unused BOOL)removeClippedSubviews {
    // Does nothing
}

- (void)setClipsToBounds:(BOOL)clipsToBounds {
    super.clipsToBounds = clipsToBounds;
    _tableView.clipsToBounds = clipsToBounds;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    RCTAssert(self.subviews.count == 1, @"we should only have exactly one subview");
    RCTAssert([self.subviews lastObject] == _tableView, @"our only subview should be a tableview");
    
    CGPoint originalOffset = _tableView.contentOffset;
    _tableView.frame = self.bounds;
    _tableView.contentOffset = originalOffset;
    
    // if sections are not define, try to load JSON
    if (![_sections count] && _json){
        datasource = [[JSONDataSource alloc] initWithFilename:_json filter:_filter args:_filterArgs];
        self.sections = [NSMutableArray arrayWithArray:[datasource sections]];
    }
    
    // find first section with selection
    NSInteger selectedSection = -1;
    for (int i=0;i<[_selectedIndexes count];i++){
        if ([_selectedIndexes[i] intValue] != -1){
            selectedSection = i;
            break;
        }
    }
    // focus of first selected value
    if (_autoFocus && selectedSection>=0 && [self numberOfSectionsInTableView:self.tableView] && [self tableView:self.tableView numberOfRowsInSection:selectedSection]){
        dispatch_async(dispatch_get_main_queue(), ^{
            NSIndexPath *indexPath = [NSIndexPath indexPathForItem:[_selectedIndexes[selectedSection] intValue ]inSection:selectedSection];
            [self.tableView scrollToRowAtIndexPath:indexPath atScrollPosition:UITableViewScrollPositionMiddle animated:YES];
        });
    }
}

#pragma mark -
#pragma mark Private APIs

#pragma mark -
#pragma mark Item Description Data

- (void)setSections:(NSArray *)sections {
    
    _sections = [NSMutableArray arrayWithCapacity:[sections count]];
    
    // create selected indexes
    _selectedIndexes = [NSMutableArray arrayWithCapacity:[sections count]];
    
//    BOOL found = NO;
    for (NSDictionary *section in sections) {
        NSMutableDictionary *sectionData = [NSMutableDictionary dictionaryWithDictionary:section];
        NSMutableArray *allItems = [NSMutableArray array];
        if (self.additionalItems){
            [allItems addObjectsFromArray:self.additionalItems];
        }
        [allItems addObjectsFromArray:sectionData[@"items"]];
        
        NSMutableArray *items = [NSMutableArray arrayWithCapacity:[allItems count]];
        NSInteger selectedIndex = -1;
        for (NSDictionary *item in allItems){
            NSMutableDictionary *itemData = [NSMutableDictionary dictionaryWithDictionary:item];
            if ((itemData[@"selected"] && [itemData[@"selected"] intValue])
                || (self.selectedValue && [self.selectedValue isEqual:item[@"value"]]))
            {
                if (selectedIndex == -1)
                    selectedIndex = [items count];
                itemData[@"selected"] = @YES;
//                found = YES;
            }
            [items addObject:itemData];
        }
        [_selectedIndexes addObject:[NSNumber numberWithUnsignedInteger:selectedIndex]];
        
        sectionData[@"items"] = items;
        [_sections addObject:sectionData];
    }
    [self.tableView reloadData];
}

- (NSMutableDictionary *)dataForRow:(NSInteger)row section:(NSInteger)section {
    return (NSMutableDictionary *)_sections[section][@"items"][row];
}

- (BOOL)hasCustomCells:(NSInteger)section {
    return [[_sections[section] valueForKey:@"customCells"] boolValue];
}

#pragma mark -
#pragma mark Section Header

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section{
    if (_sections[section][@"headerHeight"]){
        return [_sections[section][@"headerHeight"] floatValue] ? [_sections[section][@"headerHeight"] floatValue] : 0.000001;
    } else {
        return self.tableView.sectionHeaderHeight;
    }
}

- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
    return _sections[section][@"label"];
}

- (void)tableView:(UITableView *)tableView willDisplayHeaderView:(UIView *)view forSection:(NSInteger)section {
    UITableViewHeaderFooterView *header = (UITableViewHeaderFooterView *)view;
    
    if (self.headerTextColor){
        header.textLabel.textColor = self.headerTextColor;
    }
    if (self.headerFont){
        header.textLabel.font = self.headerFont;
    }
}

#pragma mark -
#pragma mark Section Footer

- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section{
    if (_sections[section][@"footerHeight"]){
        return [_sections[section][@"footerHeight"] floatValue] ? [_sections[section][@"footerHeight"] floatValue] : 0.000001;
        
    } else {
        return self.tableView.sectionFooterHeight;
    }
}

- (NSString *)tableView:(UITableView *)tableView titleForFooterInSection:(NSInteger)section {
    return _sections[section][@"footerLabel"];
}

- (void)tableView:(UITableView *)tableView willDisplayFooterView:(nonnull UIView *)view forSection:(NSInteger)section {
    UITableViewHeaderFooterView *footer = (UITableViewHeaderFooterView *)view;
    
    if (self.footerTextColor){
        footer.textLabel.textColor = self.footerTextColor;
    }
    if (self.footerFont){
        footer.textLabel.font = self.footerFont;
    }
}

#pragma mark -
#pragma mark Cells

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return [_sections count];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    NSInteger count = [_sections[section][@"items"] count];
    // if we have custom cells, additional processing is necessary
    if ([self hasCustomCells:section]){
        if ([_cells count]<=section){
            return 0;
        }
        // don't display cells until their's height is not calculated (TODO: maybe it is possible to optimize??)
        for (RNCellView *view in _cells[section]){
            if (!view.componentHeight){
                return 0;
            }
        }
        count = [_cells[section] count];
    }
    return count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    if (![self hasCustomCells:indexPath.section]){
        NSNumber *styleHeight = _sections[indexPath.section][@"items"][indexPath.row][@"height"];
        return styleHeight.floatValue ?: _cellHeight;
    } else {
        RNCellView *cell = (RNCellView *)_cells[indexPath.section][indexPath.row];
        CGFloat height =  cell.componentHeight;
        return height;
    }
}

- (UITableViewCell *)setupReactModuleCell:(UITableView *)tableView data:(NSDictionary *)data indexPath:(NSIndexPath *)indexPath {
    RNReactModuleCell *cell = [tableView dequeueReusableCellWithIdentifier:_reactModuleCellReuseIndentifier];
    if (cell == nil) {
        cell = [[RNReactModuleCell alloc] initWithStyle:self.tableViewCellStyle reuseIdentifier:_reactModuleCellReuseIndentifier bridge: _bridge data:data indexPath:indexPath reactModule:_reactModuleForCell tableViewTag:self.reactTag];
    } else {
        [cell setUpAndConfigure:data bridge:_bridge indexPath:indexPath reactModule:_reactModuleForCell tableViewTag:self.reactTag];
    }
    return cell;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = nil;
    NSDictionary *item = [self dataForRow:indexPath.item section:indexPath.section];
    
    // check if it is standard cell or user-defined UI
    if ([self hasCustomCells:indexPath.section]){
        cell = ((RNCellView *)_cells[indexPath.section][indexPath.row]).tableViewCell;
    } else if (self.reactModuleForCell != nil && ![self.reactModuleForCell isEqualToString:@""]) {
        cell = [self setupReactModuleCell:tableView data:item indexPath:indexPath];
    } else {
        cell = [tableView dequeueReusableCellWithIdentifier:@"Cell"];
        if (cell == nil) {
            cell = [[UITableViewCell alloc] initWithStyle:self.tableViewCellStyle reuseIdentifier:@"Cell"];
        }
        cell.textLabel.text = item[@"label"];
        cell.detailTextLabel.text = item[@"detail"];
    }
    
    if (item[@"selected"] && [item[@"selected"] intValue]){
        cell.accessoryType = UITableViewCellAccessoryCheckmark;
    } else if ([item[@"arrow"] intValue]) {
        cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
    } else {
        cell.accessoryType = UITableViewCellAccessoryNone;
    }
    if ([item[@"transparent"] intValue]) {
        cell.backgroundColor = [UIColor clearColor];
    }
    if (item[@"selectionStyle"]) {
        cell.selectionStyle = [item[@"selectionStyle"] intValue];
    }
    return cell;
}

- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (self.emptyInsets){
        // Remove separator inset
        if ([cell respondsToSelector:@selector(setSeparatorInset:)]) {
            [cell setSeparatorInset:UIEdgeInsetsZero];
        }
        
        // Prevent the cell from inheriting the Table View's margin settings
        if ([cell respondsToSelector:@selector(setPreservesSuperviewLayoutMargins:)]) {
            [cell setPreservesSuperviewLayoutMargins:NO];
        }
        
        // Explictly set your cell's layout margins
        if ([cell respondsToSelector:@selector(setLayoutMargins:)]) {
            [cell setLayoutMargins:UIEdgeInsetsZero];
        }
    }
    if (self.font){
        cell.detailTextLabel.font = self.font;
        cell.textLabel.font = self.font;
    }
    if (self.tintColor){
        cell.tintColor = self.tintColor;
    }
    NSDictionary *item = [self dataForRow:indexPath.item section:indexPath.section];
    if (self.selectedTextColor && [item[@"selected"] intValue]){
        cell.textLabel.textColor = self.selectedTextColor;
        cell.detailTextLabel.textColor = self.selectedTextColor;
    } else {
        if (self.textColor){
            cell.textLabel.textColor = self.textColor;
            cell.detailTextLabel.textColor = self.textColor;
        }
        if (self.detailTextColor){
            cell.detailTextLabel.textColor = self.detailTextColor;
        }
        
    }
    if (item[@"image"]) {
        UIImage *image = [UIImage imageNamed:item[@"image"]];
        if ([item[@"imageWidth"] intValue]) {
            CGSize itemSize = CGSizeMake([item[@"imageWidth"] intValue], image.size.height);
            CGPoint itemPoint = CGPointMake((itemSize.width - image.size.width) / 2, (itemSize.height - image.size.height) / 2);
            UIGraphicsBeginImageContextWithOptions(itemSize, NO, UIScreen.mainScreen.scale);
            [image drawAtPoint:itemPoint];
            cell.imageView.image = UIGraphicsGetImageFromCurrentImageContext();
            UIGraphicsEndImageContext();
        } else {
            cell.imageView.image = image;
        }
    }
    [_eventDispatcher sendInputEventWithName:@"onWillDisplayCell" body:@{@"target":self.reactTag, @"row":@(indexPath.row), @"section": @(indexPath.section)}];
}

- (void)tableView:(UITableView *)tableView didEndDisplayingCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath {
    [_eventDispatcher sendInputEventWithName:@"onEndDisplayingCell" body:@{@"target":self.reactTag, @"row":@(indexPath.row), @"section": @(indexPath.section)}];
}

#pragma mark Select Row

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:NO];
    
    NSInteger selectedIndex = [self.selectedIndexes[indexPath.section] integerValue];
    NSMutableDictionary *oldValue = selectedIndex>=0 ?[self dataForRow:selectedIndex section:indexPath.section] : [NSMutableDictionary dictionaryWithDictionary:@{}];
    
    NSMutableDictionary *newValue = [self dataForRow:indexPath.item section:indexPath.section];
    newValue[@"target"] = self.reactTag;
    newValue[@"selectedIndex"] = [NSNumber numberWithInteger:indexPath.item];
    newValue[@"selectedSection"] = [NSNumber numberWithInteger:indexPath.section];

    /*
     * if allowToggle is enabled and we tap an already selected row, then remove the selection.
     * otherwise, add selection to the new row and remove selection from old row if multiple is not allowed.
     * default: allowMultipleSelection:false and allowToggle: false
     */
    if ((oldValue[@"selected"] && [oldValue[@"selected"] intValue]) || self.selectedValue){
        if (_allowsToggle && newValue[@"selected"] && [newValue[@"selected"] intValue]) {
            [newValue removeObjectForKey:@"selected"];
        } else {
            if (!tableView.allowsMultipleSelection) {
                [oldValue removeObjectForKey:@"selected"];
            }
            [newValue setObject:@1 forKey:@"selected"];
        }
        [self.tableView reloadData];
    }

    [_eventDispatcher sendInputEventWithName:@"press" body:newValue];
    self.selectedIndexes[indexPath.section] = [NSNumber numberWithInteger:indexPath.item];
}

#pragma mark Moving

- (BOOL)tableView:(UITableView *)tableView canMoveRowAtIndexPath:(NSIndexPath *)indexPath {
    NSMutableDictionary *value = [self dataForRow:indexPath.item section:indexPath.section];
    return [value[@"canMove"] boolValue];
}

- (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)sourceIndexPath toIndexPath:(NSIndexPath *)destinationIndexPath {
    [_eventDispatcher sendInputEventWithName:@"change" body:@{@"target":self.reactTag, @"sourceIndex":@(sourceIndexPath.row), @"sourceSection": @(sourceIndexPath.section), @"destinationIndex":@(destinationIndexPath.row), @"destinationSection":@(destinationIndexPath.section), @"mode": @"move"}];
}

- (NSIndexPath *)tableView:(UITableView *)tableView targetIndexPathForMoveFromRowAtIndexPath:(NSIndexPath *)sourceIndexPath toProposedIndexPath:(NSIndexPath *)proposedDestinationIndexPath {
    if (self.moveWithinSectionOnly && sourceIndexPath.section != proposedDestinationIndexPath.section) {
        return sourceIndexPath;
    }
    return proposedDestinationIndexPath;
}

#pragma mark Editing

- (void)setEditing:(BOOL)editing {
    [self.tableView setEditing:editing animated:YES];
}

- (BOOL)editing {
    return self.tableView.editing;
}

- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath {
    NSMutableDictionary *value = [self dataForRow:indexPath.item section:indexPath.section];
    return [value[@"canEdit"] boolValue];
}

- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath { //implement the delegate method
    
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        NSMutableDictionary *newValue = [self dataForRow:indexPath.item section:indexPath.section];
        newValue[@"target"] = self.reactTag;
        newValue[@"selectedIndex"] = [NSNumber numberWithInteger:indexPath.item];
        newValue[@"selectedSection"] = [NSNumber numberWithInteger:indexPath.section];
        newValue[@"mode"] = @"delete";
        
        [_eventDispatcher sendInputEventWithName:@"change" body:newValue];
        
        [_sections[indexPath.section][@"items"] removeObjectAtIndex:indexPath.row];
        [self.tableView reloadData];
    }
}

- (UITableViewCellEditingStyle)tableView:(UITableView *)tableView
          editingStyleForRowAtIndexPath:(NSIndexPath *)indexPath {
    return self.tableViewCellEditingStyle;
}

- (BOOL)tableView:(UITableView *)tableView shouldIndentWhileEditingRowAtIndexPath:(NSIndexPath *)indexPath{
    if (self.tableViewCellEditingStyle == UITableViewCellEditingStyleNone) {
        return NO;
    }
    return YES;
}

#pragma mark -
#pragma mark RCTAutoInsetsProtocol

- (void)setContentInset:(UIEdgeInsets)contentInset {
    CGPoint contentOffset = self.tableView.contentOffset;
    
    _contentInset = contentInset;
    [RCTView autoAdjustInsetsForView:self
                      withScrollView:self.tableView
                        updateOffset:NO];
    
    self.tableView.contentOffset = contentOffset;
}

- (void)refreshContentInset {
    [RCTView autoAdjustInsetsForView:self
                      withScrollView:self.tableView
                        updateOffset:YES];
}

#pragma mark -
#pragma mark RCTScrollableProtocol

@synthesize nativeScrollDelegate = _nativeScrollDelegate;
@synthesize contentSize = _contentSize;

- (void)scrollToOffset:(CGPoint)offset {
    [self scrollToOffset:offset animated:YES];
}

- (void)scrollToOffset:(CGPoint)offset animated:(BOOL)animated {
    if (!CGPointEqualToPoint(_tableView.contentOffset, offset)) {
        [_tableView setContentOffset:offset animated:animated];
    }
}

- (void)zoomToRect:(CGRect)rect animated:(BOOL)animated {
    [_tableView zoomToRect:rect animated:animated];
}

#pragma mark -
#pragma mark Scroll Events

- (void)sendScrollEventWithName:(NSString *)eventName
                       userData:(NSDictionary *)userData
{
    if (![_lastEmittedEventName isEqualToString:eventName]) {
        _coalescingKey++;
        _lastEmittedEventName = [eventName copy];
    }
    RNScrollEvent *scrollEvent = [[RNScrollEvent alloc] initWithEventName:eventName
                                                                 reactTag:self.reactTag
                                                               scrollView:_tableView
                                                                 userData:userData
                                                            coalescingKey:_coalescingKey];
    [_eventDispatcher sendEvent:scrollEvent];
}

#define RCT_SEND_SCROLL_EVENT(_eventName, _userData) { \
    NSString *eventName = NSStringFromSelector(@selector(_eventName)); \
    [self sendScrollEventWithName:eventName userData:_userData]; \
}

#define RCT_FORWARD_SCROLL_EVENT(call) \
if ([_nativeScrollDelegate respondsToSelector:_cmd]) { \
    [_nativeScrollDelegate call]; \
}

#define RCT_SCROLL_EVENT_HANDLER(delegateMethod, eventName) \
- (void)delegateMethod:(UIScrollView *)scrollView           \
{                                                           \
    RCT_SEND_SCROLL_EVENT(eventName, nil);                    \
    RCT_FORWARD_SCROLL_EVENT(delegateMethod:scrollView);      \
}

RCT_SCROLL_EVENT_HANDLER(scrollViewDidEndScrollingAnimation, onMomentumScrollEnd) //TODO: shouldn't this be onScrollAnimationEnd?
RCT_SCROLL_EVENT_HANDLER(scrollViewWillBeginDecelerating, onMomentumScrollBegin)
RCT_SCROLL_EVENT_HANDLER(scrollViewDidEndDecelerating, onMomentumScrollEnd)
RCT_SCROLL_EVENT_HANDLER(scrollViewDidZoom, onScroll)

#pragma mark -
#pragma mark UIScrollViewDelegate

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    //    [_tableView dockClosestSectionHeader];
    [self updateClippedSubviews];
    
    NSTimeInterval now = CACurrentMediaTime();
    
    /**
     * TODO: this logic looks wrong, and it may be because it is. Currently, if _scrollEventThrottle
     * is set to zero (the default), the "didScroll" event is only sent once per scroll, instead of repeatedly
     * while scrolling as expected. However, if you "fix" that bug, ScrollView will generate repeated
     * warnings, and behave strangely (ListView works fine however), so don't fix it unless you fix that too!
     */
    if (_allowNextScrollNoMatterWhat ||
        (_scrollEventThrottle > 0 && _scrollEventThrottle < (now - _lastScrollDispatchTime))) {
        
        // Dispatch event
        RCT_SEND_SCROLL_EVENT(onScroll, nil);
        
        // Update dispatch time
        _lastScrollDispatchTime = now;
        _allowNextScrollNoMatterWhat = NO;
    }
    RCT_FORWARD_SCROLL_EVENT(scrollViewDidScroll:scrollView);
}

- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView {
    _allowNextScrollNoMatterWhat = YES; // Ensure next scroll event is recorded, regardless of throttle
    RCT_SEND_SCROLL_EVENT(onScrollBeginDrag, nil);
    RCT_FORWARD_SCROLL_EVENT(scrollViewWillBeginDragging:scrollView);
}

- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset {
    
    NSDictionary *userData = @{
                               @"velocity": @{
                                       @"x": @(velocity.x),
                                       @"y": @(velocity.y)
                                       },
                               @"targetContentOffset": @{
                                       @"x": @(targetContentOffset->x),
                                       @"y": @(targetContentOffset->y)
                                       }
                               };
    RCT_SEND_SCROLL_EVENT(onScrollEndDrag, userData);
    RCT_FORWARD_SCROLL_EVENT(scrollViewWillEndDragging:scrollView withVelocity:velocity targetContentOffset:targetContentOffset);
}

- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate {
    RCT_FORWARD_SCROLL_EVENT(scrollViewDidEndDragging:scrollView willDecelerate:decelerate);
}

- (void)scrollViewWillBeginZooming:(UIScrollView *)scrollView withView:(UIView *)view
{
    RCT_SEND_SCROLL_EVENT(onScrollBeginDrag, nil);
    RCT_FORWARD_SCROLL_EVENT(scrollViewWillBeginZooming:scrollView withView:view);
}

- (void)scrollViewDidEndZooming:(UIScrollView *)scrollView withView:(UIView *)view atScale:(CGFloat)scale
{
    RCT_SEND_SCROLL_EVENT(onScrollEndDrag, nil);
    RCT_FORWARD_SCROLL_EVENT(scrollViewDidEndZooming:scrollView withView:view atScale:scale);
}

- (BOOL)scrollViewShouldScrollToTop:(UIScrollView *)scrollView
{
    if ([_nativeScrollDelegate respondsToSelector:_cmd]) {
        return [_nativeScrollDelegate scrollViewShouldScrollToTop:scrollView];
    }
    return YES;
}

#pragma mark -
#pragma mark ScrollView APIs

/**
 * Once you set the `contentSize`, to a nonzero value, it is assumed to be
 * managed by you, and we'll never automatically compute the size for you,
 * unless you manually reset it back to {0, 0}
 */
- (CGSize)contentSize {
    return _tableView.contentSize;
}

// Note: setting several properties of UIScrollView has the effect of
// resetting its contentOffset to {0, 0}. To prevent this, we generate
// setters here that will record the contentOffset beforehand, and
// restore it after the property has been set.

#define RCT_SET_AND_PRESERVE_OFFSET(setter, type)     \
- (void)setter:(type)value                            \
{                                                     \
    CGPoint contentOffset = _tableView.contentOffset; \
    [_tableView setter:value];                        \
    _tableView.contentOffset = contentOffset;         \
}

RCT_SET_AND_PRESERVE_OFFSET(setSectionHeaderHeight, CGFloat)
RCT_SET_AND_PRESERVE_OFFSET(setSectionFooterHeight, CGFloat)
RCT_SET_AND_PRESERVE_OFFSET(setSeparatorStyle, UITableViewCellSeparatorStyle)
RCT_SET_AND_PRESERVE_OFFSET(setSeparatorColor, UIColor*)
RCT_SET_AND_PRESERVE_OFFSET(setAllowsMultipleSelection, BOOL)

RCT_SET_AND_PRESERVE_OFFSET(setAlwaysBounceHorizontal, BOOL)
RCT_SET_AND_PRESERVE_OFFSET(setAlwaysBounceVertical, BOOL)
RCT_SET_AND_PRESERVE_OFFSET(setBounces, BOOL)
RCT_SET_AND_PRESERVE_OFFSET(setBouncesZoom, BOOL)
RCT_SET_AND_PRESERVE_OFFSET(setCanCancelContentTouches, BOOL)
RCT_SET_AND_PRESERVE_OFFSET(setDecelerationRate, CGFloat)
RCT_SET_AND_PRESERVE_OFFSET(setDirectionalLockEnabled, BOOL)
RCT_SET_AND_PRESERVE_OFFSET(setKeyboardDismissMode, UIScrollViewKeyboardDismissMode)
RCT_SET_AND_PRESERVE_OFFSET(setMaximumZoomScale, CGFloat)
RCT_SET_AND_PRESERVE_OFFSET(setMinimumZoomScale, CGFloat)
RCT_SET_AND_PRESERVE_OFFSET(setPagingEnabled, BOOL)
RCT_SET_AND_PRESERVE_OFFSET(setScrollEnabled, BOOL)
RCT_SET_AND_PRESERVE_OFFSET(setScrollsToTop, BOOL)
RCT_SET_AND_PRESERVE_OFFSET(setShowsHorizontalScrollIndicator, BOOL)
RCT_SET_AND_PRESERVE_OFFSET(setShowsVerticalScrollIndicator, BOOL)
RCT_SET_AND_PRESERVE_OFFSET(setZoomScale, CGFloat);
RCT_SET_AND_PRESERVE_OFFSET(setScrollIndicatorInsets, UIEdgeInsets);

#pragma mark - Forward methods and properties to underlying UIScrollView

- (BOOL)respondsToSelector:(SEL)aSelector {
    return [super respondsToSelector:aSelector] || [_tableView respondsToSelector:aSelector];
}

- (NSMethodSignature *)methodSignatureForSelector:(SEL)aSelector {
    NSMethodSignature *signature = [super methodSignatureForSelector:aSelector];
    if (!signature && [_tableView respondsToSelector:aSelector]) {
        signature = [_tableView methodSignatureForSelector:aSelector];
    }
    return signature;
}

- (id)forwardingTargetForSelector:(SEL)aSelector {
    if ([_tableView respondsToSelector:aSelector]) {
        return _tableView;
    }
    return self;
}

@end

