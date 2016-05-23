'use strict';
var React = require('react-native');

var {
  NativeMethodsMixin,
  ReactNativeViewAttributes,
  NativeModules,
  StyleSheet,
  Platform,
  View,
  requireNativeComponent,
  ScrollView,
  PropTypes
} = React;

var invariant = require('invariant');

import TableViewScrollResponder from './src/TableViewScrollResponder.js'

var TABLEVIEW = 'tableview';

function extend(el, map) {
    for (var i in map)
        if (typeof(map[i])!='object')
            el[i] = map[i];
    return el;
}
var TableView = React.createClass({
    mixins: [NativeMethodsMixin, TableViewScrollResponder.Mixin],

    propTypes: {
        ...View.propTypes,

        style: View.propTypes.style,

        // Data Source
        sections: PropTypes.array,
        json: PropTypes.string,
        filter: PropTypes.string,
        filterArgs: PropTypes.array,
        additionalItems: PropTypes.array,

        // table view properties
        tableViewStyle: PropTypes.oneOf([
          'plain',
          'grouped'
        ]),
        autoFocus: PropTypes.bool,
        emptyInsets: PropTypes.bool,

        fontSize: PropTypes.number,
        fontWeight: PropTypes.string,
        fontStyle: PropTypes.string,
        fontFamily: PropTypes.string,

        // header
        headerHeight: PropTypes.number,
        headerFontSize: PropTypes.number,
        headerFontWeight: PropTypes.string,
        headerFontStyle: PropTypes.string,
        headerFontFamily: PropTypes.string,

        // footer
        footerHeight: PropTypes.number,
        footerFontSize: PropTypes.number,
        footerFontWeight: PropTypes.string,
        footerFontFamily: PropTypes.string,
        footerFontStyle: PropTypes.string,

        // cell
        tableViewCellStyle: PropTypes.oneOf([
          'default',
          'value1',
          'value2',
          'subtitle'
        ]),
        reactModuleForCell: PropTypes.string,
        cellForRowAtIndexPath: PropTypes.array,
        cellHeight: PropTypes.number,

        textColor: PropTypes.string,
        detailTextColor: PropTypes.string,
        tintColor: PropTypes.string,

        allowsToggle: PropTypes.bool,

        allowsMultipleSelection: PropTypes.bool,
        selectedSection: PropTypes.number,
        selectedIndex: PropTypes.number,
        selectedValue: PropTypes.any, // string or integer basically
        selectedTextColor: PropTypes.string,

        moveWithinSectionOnly: PropTypes.bool,

        // Editing
        editing: PropTypes.bool,
        tableViewCellEditingStyle: PropTypes.oneOf([
          'none',
          'delete',
          'insert'
        ]),

        // separator
        separatorColor: PropTypes.string,
        separatorStyle: PropTypes.oneOf([
          'none',
          'singleLine',
          'singleLineEtched'
        ]),

        // Events
        onPress: PropTypes.func,
        onWillDisplayCell: PropTypes.func,
        onEndDisplayingCell: PropTypes.func,




        /**
         * Controls whether iOS should automatically adjust the content inset
         * for scroll views that are placed behind a navigation bar or
         * tab bar/ toolbar. The default value is true.
         * @platform ios
         */
        automaticallyAdjustContentInsets: PropTypes.bool,
        /**
         * The amount by which the scroll view content is inset from the edges
         * of the scroll view. Defaults to `{0, 0, 0, 0}`.
         * @platform ios
         */
        contentInset: React.EdgeInsetsPropType,
        /**
         * Used to manually set the starting scroll offset.
         * The default value is `{x: 0, y: 0}`.
         * @platform ios
         */
        contentOffset: React.PointPropType,
        /**
         * When true, the scroll view bounces when it reaches the end of the
         * content if the content is larger then the scroll view along the axis of
         * the scroll direction. When false, it disables all bouncing even if
         * the `alwaysBounce*` props are true. The default value is true.
         * @platform ios
         */
        bounces: PropTypes.bool,
        /**
         * When true, gestures can drive zoom past min/max and the zoom will animate
         * to the min/max value at gesture end, otherwise the zoom will not exceed
         * the limits.
         * @platform ios
         */
        bouncesZoom: PropTypes.bool,
        /**
         * When true, the scroll view bounces horizontally when it reaches the end
         * even if the content is smaller than the scroll view itself. The default
         * value is true when `horizontal={true}` and false otherwise.
         * @platform ios
         */
        alwaysBounceHorizontal: PropTypes.bool,
        /**
         * When true, the scroll view bounces vertically when it reaches the end
         * even if the content is smaller than the scroll view itself. The default
         * value is false when `horizontal={true}` and true otherwise.
         * @platform ios
         */
        alwaysBounceVertical: PropTypes.bool,
        /**
         * A floating-point number that determines how quickly the scroll view
         * decelerates after the user lifts their finger. You may also use string
         * shortcuts `"normal"` and `"fast"` which match the underlying iOS settings
         * for `UIScrollViewDecelerationRateNormal` and
         * `UIScrollViewDecelerationRateFast` respectively.
         *   - normal: 0.998 (the default)
         *   - fast: 0.99
         * @platform ios
         */
        decelerationRate: PropTypes.oneOfType([
          PropTypes.oneOf(['fast', 'normal']),
          PropTypes.number,
        ]),
        /**
         * The style of the scroll indicators.
         *   - `default` (the default), same as `black`.
         *   - `black`, scroll indicator is black. This style is good against a white content background.
         *   - `white`, scroll indicator is white. This style is good against a black content background.
         * @platform ios
         */
        indicatorStyle: PropTypes.oneOf([
          'default', // default
          'black',
          'white',
        ]),
        /**
         * When true, the ScrollView will try to lock to only vertical or horizontal
         * scrolling while dragging.  The default value is false.
         * @platform ios
         */
        directionalLockEnabled: PropTypes.bool,
        /**
         * When false, once tracking starts, won't try to drag if the touch moves.
         * The default value is true.
         * @platform ios
         */
        canCancelContentTouches: PropTypes.bool,
        /**
         * Determines whether the keyboard gets dismissed in response to a drag.
         *   - 'none' (the default), drags do not dismiss the keyboard.
         *   - 'on-drag', the keyboard is dismissed when a drag begins.
         *   - 'interactive', the keyboard is dismissed interactively with the drag and moves in
         *     synchrony with the touch; dragging upwards cancels the dismissal.
         *     On android this is not supported and it will have the same behavior as 'none'.
         */
        keyboardDismissMode: PropTypes.oneOf([
          'none', // default
          'interactive',
          'on-drag',
        ]),
        /**
         * When false, tapping outside of the focused text input when the keyboard
         * is up dismisses the keyboard. When true, the scroll view will not catch
         * taps, and the keyboard will not dismiss automatically. The default value
         * is false.
         */
        keyboardShouldPersistTaps: PropTypes.bool,
        /**
         * The maximum allowed zoom scale. The default value is 1.0.
         * @platform ios
         */
        maximumZoomScale: PropTypes.number,
        /**
         * The minimum allowed zoom scale. The default value is 1.0.
         * @platform ios
         */
        minimumZoomScale: PropTypes.number,
        /**
         * Fires at most once per frame during scrolling. The frequency of the
         * events can be controlled using the `scrollEventThrottle` prop.
         */
        onScroll: PropTypes.func,
        /**
         * Called when a scrolling animation ends.
         * @platform ios
         */
        onScrollAnimationEnd: PropTypes.func,
        /**
         * When true, the scroll view stops on multiples of the scroll view's size
         * when scrolling. This can be used for horizontal pagination. The default
         * value is false.
         * @platform ios
         */
        pagingEnabled: PropTypes.bool,
        /**
         * When false, the content does not scroll.
         * The default value is true.
         */
        scrollEnabled: PropTypes.bool,
        /**
         * This controls how often the scroll event will be fired while scrolling
         * (as a time interval in ms). A lower number yields better accuracy for code
         * that is tracking the scroll position, but can lead to scroll performance
         * problems due to the volume of information being send over the bridge.
         * You will not notice a difference between values set between 1-16 as the
         * JS run loop is synced to the screen refresh rate. If you do not need precise
         * scroll position tracking, set this value higher to limit the information
         * being sent across the bridge. The default value is zero, which results in
         * the scroll event being sent only once each time the view is scrolled.
         * @platform ios
         */
        scrollEventThrottle: PropTypes.number,
        /**
         * The amount by which the scroll view indicators are inset from the edges
         * of the scroll view. This should normally be set to the same value as
         * the `contentInset`. Defaults to `{0, 0, 0, 0}`.
         * @platform ios
         */
        scrollIndicatorInsets: React.EdgeInsetsPropType,
        /**
         * When true, the scroll view scrolls to top when the status bar is tapped.
         * The default value is true.
         * @platform ios
         */
        scrollsToTop: PropTypes.bool,
        /**
         * When true, momentum events will be sent from Android
         * This is internal and set automatically by the framework if you have
         * onMomentumScrollBegin or onMomentumScrollEnd set on your ScrollView
         * @platform android
         */
        sendMomentumEvents: PropTypes.bool,
        /**
         * When true, shows a horizontal scroll indicator.
         */
        showsHorizontalScrollIndicator: PropTypes.bool,
        /**
         * When true, shows a vertical scroll indicator.
         */
        showsVerticalScrollIndicator: PropTypes.bool,

        /**
         * When set, causes the scroll view to stop at multiples of the value of
         * `snapToInterval`. This can be used for paginating through children
         * that have lengths smaller than the scroll view. Used in combination
         * with `snapToAlignment`.
         * @platform ios
         */
        snapToInterval: PropTypes.number,
        /**
         * When `snapToInterval` is set, `snapToAlignment` will define the relationship
         * of the snapping to the scroll view.
         *   - `start` (the default) will align the snap at the left (horizontal) or top (vertical)
         *   - `center` will align the snap in the center
         *   - `end` will align the snap at the right (horizontal) or bottom (vertical)
         * @platform ios
         */
        snapToAlignment: PropTypes.oneOf([
          'start', // default
          'center',
          'end',
        ]),
        /**
         * The current scale of the scroll view content. The default value is 1.0.
         * @platform ios
         */
        zoomScale: PropTypes.number,

        /**
         * A RefreshControl component, used to provide pull-to-refresh
         * functionality for the ScrollView.
         *
         * See [RefreshControl](docs/refreshcontrol.html).
         */
        refreshControl: PropTypes.element,
    },

    getDefaultProps() {
        return {
            tableViewCellEditingStyle: "delete",
        };
    },

    getInitialState: function() {
        return this._stateFromProps(this.props);
    },

    componentWillReceiveProps: function(nextProps) {
        var state = this._stateFromProps(nextProps);
        this.setState(state);
    },

    getScrollResponder: function() {
      return this;
    },

    // Translate TableView prop and children into stuff that RNTableView understands.
    _stateFromProps: function(props) {
        var sections = [];
        var additionalItems = [];
        var children = [];
        var json = props.json;

        // iterate over sections
        React.Children.forEach(props.children, function (section, index) {
            var items=[];
            var count = 0;
            if (section && section.type==TableView.Section) {
                let customCells = false;
                React.Children.forEach(section.props.children, function (child, itemIndex) {
                    var el = {};
                    extend(el, section.props);
                    extend(el, child.props);
                    if (el.children) {
                        el.label = el.children;
                    }
                    count++;
                    items.push(el);

                    if (child.type==TableView.Cell){
                        customCells = true;
                        count++;
                        var element = React.cloneElement(child, {key: index+" "+itemIndex, section: index, row: itemIndex});
                        children.push(element);
                    }

                });
                sections.push({
                    customCells,
                    label: section.props.label,
                    footerLabel: section.props.footerLabel,
                    footerHeight: section.props.footerHeight,
                    headerHeight: section.props.headerHeight,
                    items: items,
                    count: count
                });
            } else if (section && section.type==TableView.Item){
                var el = extend({},section.props);
                if (!el.label){
                    el.label = el.children;
                }
                additionalItems.push(el);
            } else if (section){
                children.push(section);
            }
        });
        this.sections = sections;
        return {sections, additionalItems, children, json};
    },

    render: function() {

      // if (__DEV__ && this.props.style) {
      //   var style = flattenStyle(this.props.style);
      //   var childLayoutProps = ['alignItems', 'justifyContent']
      //     .filter((prop) => style && style[prop] !== undefined);
      //   invariant(
      //     childLayoutProps.length === 0,
      //     'TableView child layout (' + JSON.stringify(childLayoutProps) +
      //       ') must by applied through the contentContainerStyle prop.'
      //   );
      // }

      var contentSizeChangeProps = {};
      if (this.props.onContentSizeChange) {
        contentSizeChangeProps = {
          onLayout: this._handleContentOnLayout,
        };
      }

      var alwaysBounceHorizontal =
        this.props.alwaysBounceHorizontal !== undefined ?
          this.props.alwaysBounceHorizontal :
          this.props.horizontal;

      var alwaysBounceVertical =
        this.props.alwaysBounceVertical !== undefined ?
          this.props.alwaysBounceVertical :
          !this.props.horizontal;

      var props = {
        ...this.props,
        alwaysBounceHorizontal,
        alwaysBounceVertical,
        style: ([styles.base, this.props.style]: ?Array<any>),
        onTouchStart: this.scrollResponderHandleTouchStart,
        onTouchMove: this.scrollResponderHandleTouchMove,
        onTouchEnd: this.scrollResponderHandleTouchEnd,
        onScrollBeginDrag: this.scrollResponderHandleScrollBeginDrag,
        onScrollEndDrag: this.scrollResponderHandleScrollEndDrag,
        onMomentumScrollBegin: this.scrollResponderHandleMomentumScrollBegin,
        onMomentumScrollEnd: this.scrollResponderHandleMomentumScrollEnd,
        onStartShouldSetResponder: this.scrollResponderHandleStartShouldSetResponder,
        onStartShouldSetResponderCapture: this.scrollResponderHandleStartShouldSetResponderCapture,
        onScrollShouldSetResponder: this.scrollResponderHandleScrollShouldSetResponder,
        onScroll: this.handleScroll,
        onResponderGrant: this.scrollResponderHandleResponderGrant,
        onResponderTerminationRequest: this.scrollResponderHandleTerminationRequest,
        onResponderTerminate: this.scrollResponderHandleTerminate,
        onResponderRelease: this.scrollResponderHandleResponderRelease,
        onResponderReject: this.scrollResponderHandleResponderReject,
        sendMomentumEvents: (this.props.onMomentumScrollBegin || this.props.onMomentumScrollEnd) ? true : false,

        sections: this.state.sections,
        additionalItems: this.state.additionalItems,
        tableViewStyle: 'plain',
        tableViewCellStyle: 'subtitle',
        tableViewCellEditingStyle: this.props.tableViewCellEditingStyle,
        separatorStyle: 'singleLine',
        scrollIndicatorInsets: this.props.contentInset,
        json: this.state.json,
        onPress: this._onPress,
        onChange: this._onChange,
        onWillDisplayCell: this._onWillDisplayCell,
        onEndDisplayingCell: this._onEndDisplayingCell,
      };

      var { decelerationRate } = this.props;
      if (decelerationRate) {
        props.decelerationRate = processDecelerationRate(decelerationRate);
      }

      var TableViewClass;
      if (Platform.OS === 'ios') {
        TableViewClass = RNTableView;
      } else if (Platform.OS === 'android') {
        if (this.props.horizontal) {
          TableViewClass = undefined;
        } else {
          TableViewClass = undefined;
        }
      }
      invariant(
        TableViewClass !== undefined,
        'TableViewClass must not be undefined'
      );

      var refreshControl = this.props.refreshControl;
      if (refreshControl) {
        if (Platform.OS === 'ios') {
          // On iOS the RefreshControl is a child of the TableView.
          return (
            <TableViewClass {...props} ref={TABLEVIEW}>
              <Header>{refreshControl}</Header>
              {this.state.children}
            </TableViewClass>
          );
        } else if (Platform.OS === 'android') {
          // On Android wrap the TableView with a AndroidSwipeRefreshLayout.
          // Since the TableView is wrapped add the style props to the
          // AndroidSwipeRefreshLayout and use flex: 1 for the TableView.
          // return React.cloneElement(
          //   refreshControl,
          //   {style: props.style},
          //   <TableViewClass {...props} style={styles.base} ref={TABLEVIEW}>
          //     {contentContainer}
          //   </TableViewClass>
          // );
          return null;
        }
      }

      return (
        <TableViewClass {...props} ref={TABLEVIEW}>
          {this.state.children}
        </TableViewClass>
      );
    },

    _onPress: function(event) {
        let data = event.nativeEvent;
        let sec = this.sections[data.selectedSection];
        let item = sec ? sec.items[data.selectedIndex] : null;
        let onPress = item ? item.onPress : null;
        if (onPress) {
            onPress(data);
        }
        if (this.props.onPress) {
            this.props.onPress(data);
        }
        event.stopPropagation();
    },
    _onAccessoryPress: function(event) {
        console.log('_onAccessoryPress', event);
        let data = event.nativeEvent;
        let sec = this.sections[data.selectedSection];
        let item = sec ? sec.items[data.selectedIndex] : null;
        let onAccessoryPress = item ? item.onAccessoryPress : null;
        if (onAccessoryPress) {
            onAccessoryPress(data);
        }
        if (this.props.onAccessoryPress) {
            this.props.onAccessoryPress(data);
        }
        event.stopPropagation();
    },
    _onChange: function(event) {
      let data = event.nativeEvent;
      let sec = this.sections[data.selectedSection];
      let item = sec ? sec.items[data.selectedIndex] : null;
      let onChange = item ? item.onChange : null;
        if (onChange) {
            onChange(data);
        }
        if (this.props.onChange) {
            this.props.onChange(data);
        }
        event.stopPropagation();
    },
    _onWillDisplayCell: function(event) {
        let data = event.nativeEvent;
        let sec = this.sections[data.section];
        let row = sec ? sec.items[data.row] : null;
        let onWillDisplayCell = row ? row.onWillDisplayCell : null;
        if (onWillDisplayCell) {
            onWillDisplayCell(data);
        }
        if (this.props.onWillDisplayCell) {
            this.props.onWillDisplayCell(data);
        }
        event.stopPropagation();
    },
    _onEndDisplayingCell: function(event) {
      let data = event.nativeEvent;
      let sec = this.sections[data.section];
      let row = sec ? sec.items[data.row] : null;
      let onEndDisplayingCell = row ? row.onEndDisplayingCell : null;
        if (onEndDisplayingCell) {
            onEndDisplayingCell(data);
        }
        if (this.props.onEndDisplayingCell) {
            this.props.onEndDisplayingCell(data);
        }
        event.stopPropagation();
    },

    setNativeProps: function(props: Object) {
      this.refs[TABLEVIEW].setNativeProps(props);
    },

    endRefreshing: function() {
      RCTTableViewManager.endRefreshing(
        React.findNodeHandle(this)
      );
    },

    /**
     * Returns a reference to the underlying scroll responder, which supports
     * operations like `scrollTo`. All TableView-like components should
     * implement this method so that they can be composed while providing access
     * to the underlying scroll responder's methods.
     */
    getScrollResponder: function(): ReactComponent {
      return this;
    },

    getScrollableNode: function(): any {
      return React.findNodeHandle(this.refs[TABLEVIEW]);
    },

    getInnerViewNode: function(): any {
      return React.findNodeHandle(this.refs[INNERVIEW]);
    },

    /**
     * Scrolls to a given x, y offset, either immediately or with a smooth animation.
     * Syntax:
     *
     * scrollTo(options: {x: number = 0; y: number = 0; animated: boolean = true})
     *
     * Note: The weird argument signature is due to the fact that, for historical reasons,
     * the function also accepts separate arguments as as alternative to the options object.
     * This is deprecated due to ambiguity (y before x), and SHOULD NOT BE USED.
     */
    scrollTo: function(
      y?: number | { x?: number, y?: number, animated?: boolean },
      x?: number,
      animated?: boolean
    ) {
      if (typeof y === 'number') {
        console.warn('`scrollTo(y, x, animated)` is deprecated. Use `scrollTo({x: 5, y: 5, animated: true})` instead.');
      } else {
        ({x, y, animated} = y || {});
      }
      // $FlowFixMe - Don't know how to pass Mixin correctly. Postpone for now
      this.getScrollResponder().scrollResponderScrollTo({x: x || 0, y: y || 0, animated: animated !== false});
    },

    /**
     * Deprecated, do not use.
     */
    scrollWithoutAnimationTo: function(y: number = 0, x: number = 0) {
      console.warn('`scrollWithoutAnimationTo` is deprecated. Use `scrollTo` instead');
      this.scrollTo({x, y, animated: false});
    },

    handleScroll: function(e: Object) {
      if (__DEV__) {
        if (this.props.onScroll && !this.props.scrollEventThrottle) {
          console.log(
            'You specified `onScroll` on a <TableView> but not ' +
            '`scrollEventThrottle`. You will only receive one event. ' +
            'Using `16` you get all the events but be aware that it may ' +
            'cause frame drops, use a bigger number if you don\'t need as ' +
            'much precision.'
          );
        }
      }
      if (Platform.OS === 'android') {
        if (this.props.keyboardDismissMode === 'on-drag') {
          dismissKeyboard();
        }
      }
      this.scrollResponderHandleScroll(e);
    },

    _handleContentOnLayout: function(e: Object) {
      var {width, height} = e.nativeEvent.layout;
      this.props.onContentSizeChange && this.props.onContentSizeChange(width, height);
    },
});



TableView.Header = React.createClass({
    getInitialState(){
        return {width:0, height:0}
    },
    render: function() {
        return <RNHeaderView onLayout={(event)=>{
                                        this.setState(event.nativeEvent.layout)
                                      }}
                             {...this.props}
                             componentWidth={this.state.width}
                             componentHeight={this.state.height}
               />
    },
});
var RNHeaderView = requireNativeComponent('RNTableHeaderView', null);

TableView.Footer = React.createClass({
    getInitialState(){
        return {width:0, height:0}
    },
    render: function() {
        return <RNFooterView onLayout={(event)=>{
                                        this.setState(event.nativeEvent.layout)
                                      }}
                             {...this.props}
                             componentWidth={this.state.width}
                             componentHeight={this.state.height}/>
    },
});
var RNFooterView = requireNativeComponent('RNTableFooterView', null);

TableView.Section = React.createClass({
    render: function() {
        // These items don't get rendered directly.
        return null;
    },
});

TableView.Item = React.createClass({
    render: function() {
        // These items don't get rendered directly.
        return null;
    },
});

// custom cell
TableView.Cell = React.createClass({
    getInitialState(){
        return {width:0, height:0}
    },
    render: function() {
        return <RNCellView onLayout={(event) => {
                                      this.setState(event.nativeEvent.layout)
                                     }}
                           {...this.props}
                           componentWidth={this.state.width}
                           componentHeight={this.state.height}
               />
    },
});
var RNCellView = requireNativeComponent('RNCellView', null);


var styles = StyleSheet.create({
    tableView: {
        // The picker will conform to whatever width is given, but we do
        // have to set the component's height explicitly on the
        // surrounding view to ensure it gets rendered.
        //height: RNTableViewConsts.ComponentHeight,
    },
});

var RNTableView = requireNativeComponent('RNTableView', TableView, {
  nativeOnly: {

  }
});

module.exports = TableView;
