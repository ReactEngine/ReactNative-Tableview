'use strict';

import {
    PropTypes
} from 'react';

import {
    View,
    PointPropType,
    EdgeInsetsPropType
} from 'react-native';

export default {
    ...View.propTypes,

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
    contentInset: EdgeInsetsPropType,
    /**
    * Used to manually set the starting scroll offset.
    * The default value is `{x: 0, y: 0}`.
    * @platform ios
    */
    contentOffset: PointPropType,
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
        PropTypes.number
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
        'white'
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
        'on-drag'
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
    scrollIndicatorInsets: EdgeInsetsPropType,
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
        'end'
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
    refreshControl: PropTypes.element
}
