'use strict';

import {
  PropTypes
} from 'react';

import ScrollViewPropTypes from './ScrollViewPropTypes';

export default {
  ...ScrollViewPropTypes,
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
  onEndDisplayingCell: PropTypes.func
}
