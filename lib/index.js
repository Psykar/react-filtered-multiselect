'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function makeLookup(arr, prop) {
  var lkup = {};
  for (var i = 0, l = arr.length; i < l; i++) {
    if (prop) {
      lkup[arr[i][prop]] = true;
    } else {
      lkup[arr[i]] = true;
    }
  }
  return lkup;
}

function getItemsByProp(arr, prop, values) {
  var items = [];
  var found = 0;
  var valuesLookup = makeLookup(values);
  for (var i = 0, la = arr.length, lv = values.length; i < la && found < lv; i++) {
    if (valuesLookup[arr[i][prop]]) {
      items.push(arr[i]);
      found++;
    }
  }
  return items;
}

var DEFAULT_CLASS_NAMES = {
  button: 'FilteredMultiSelect__button',
  buttonActive: 'FilteredMultiSelect__button--active',
  filter: 'FilteredMultiSelect__filter',
  select: 'FilteredMultiSelect__select'
};

exports['default'] = _react2['default'].createClass({
  displayName: 'FilteredMultiSelect',

  propTypes: {
    onChange: _react.PropTypes.func.isRequired,
    options: _react.PropTypes.array.isRequired,

    buttonText: _react.PropTypes.string,
    className: _react.PropTypes.string,
    classNames: _react.PropTypes.object,
    defaultFilter: _react.PropTypes.string,
    disabled: _react.PropTypes.bool,
    groupProp: _react.PropTypes.string,
    placeholder: _react.PropTypes.string,
    selectedOptions: _react.PropTypes.array,
    size: _react.PropTypes.number,
    textProp: _react.PropTypes.string,
    valueProp: _react.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      buttonText: 'Select',
      className: 'FilteredMultiSelect',
      classNames: {},
      defaultFilter: '',
      disabled: false,
      groupProp: false,
      placeholder: 'type to filter',
      size: 6,
      selectedOptions: [],
      textProp: 'text',
      valueProp: 'value'
    };
  },

  getInitialState: function getInitialState() {
    var _props = this.props;
    var defaultFilter = _props.defaultFilter;
    var selectedOptions = _props.selectedOptions;

    return {
      // Filter text
      filter: defaultFilter,
      // Options which haven't been selected and match the filter text
      filteredOptions: this._filterOptions(defaultFilter, selectedOptions),
      // Values of <options> currently selected in the <select>
      selectedValues: []
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    // Update visibile options in response to options or selectedOptions
    // changing. Also update selected values after the re-render completes, as
    // one of the previously selected options may have been removed.
    if (nextProps.options !== this.props.options || nextProps.selectedOptions !== this.props.selectedOptions || nextProps.options.length !== this.props.options.length || nextProps.selectedOptions.length !== this.props.selectedOptions.length) {
      this.setState({
        filteredOptions: this._filterOptions(this.state.filter, nextProps.selectedOptions, nextProps.options)
      }, this._updateSelectedValues);
    }
  },

  _getClassName: function _getClassName(name) {
    var classNames = [this.props.classNames[name] || DEFAULT_CLASS_NAMES[name]];

    for (var _len = arguments.length, modifiers = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      modifiers[_key - 1] = arguments[_key];
    }

    for (var i = 0, l = modifiers.length; i < l; i++) {
      if (modifiers[i]) {
        classNames.push(this.props.classNames[modifiers[i]] || DEFAULT_CLASS_NAMES[modifiers[i]]);
      }
    }
    return classNames.join(' ');
  },

  _filterOptions: function _filterOptions(filter, selectedOptions, options) {
    if (typeof filter == 'undefined') {
      filter = this.state.filter;
    }
    if (typeof selectedOptions == 'undefined') {
      selectedOptions = this.props.selectedOptions;
    }
    if (typeof options == 'undefined') {
      options = this.props.options;
    }
    filter = filter.toUpperCase();

    var _props2 = this.props;
    var textProp = _props2.textProp;
    var valueProp = _props2.valueProp;

    var selectedValueLookup = makeLookup(selectedOptions, valueProp);
    var filteredOptions = [];

    for (var i = 0, l = options.length; i < l; i++) {
      if (!selectedValueLookup[options[i][valueProp]] && (!filter || options[i][textProp].toUpperCase().indexOf(filter) !== -1)) {
        filteredOptions.push(options[i]);
      }
    }

    return filteredOptions;
  },

  _onFilterChange: function _onFilterChange(e) {
    var filter = e.target.value;
    this.setState({
      filter: filter,
      filteredOptions: this._filterOptions(filter)
    }, this._updateSelectedValues);
  },

  _onFilterKeyPress: function _onFilterKeyPress(e) {
    var _this = this;

    if (e.key === 'Enter') {
      e.preventDefault();
      if (this.state.filteredOptions.length === 1) {
        (function () {
          var selectedOption = _this.state.filteredOptions[0];
          var selectedOptions = _this.props.selectedOptions.concat([selectedOption]);
          _this.setState({ filter: '', selectedValues: [] }, function () {
            _this.props.onChange(selectedOptions);
          });
        })();
      }
    }
  },

  _updateSelectedValues: function _updateSelectedValues(e) {
    var el = e ? e.target : this.refs.select;
    var selectedValues = [];
    for (var i = 0, l = el.options.length; i < l; i++) {
      if (el.options[i].selected) {
        selectedValues.push(el.options[i].value);
      }
    }
    // Always update if we were handling an event, otherwise only update if
    // selectedValues has actually changed.
    if (e || String(this.state.selectedValues) !== String(selectedValues)) {
      this.setState({ selectedValues: selectedValues });
    }
  },

  /**
   * Adds backing objects for the currently selected options to the selection
   * and calls back with the new list.
   */
  _addSelectedToSelection: function _addSelectedToSelection(e) {
    var _this2 = this;

    var selectedOptions = this.props.selectedOptions.concat(getItemsByProp(this.state.filteredOptions, this.props.valueProp, this.state.selectedValues));
    this.setState({ selectedValues: [] }, function () {
      _this2.props.onChange(selectedOptions);
    });
  },

  render: function render() {
    var _state = this.state;
    var filter = _state.filter;
    var filteredOptions = _state.filteredOptions;
    var selectedValues = _state.selectedValues;
    var _props3 = this.props;
    var className = _props3.className;
    var disabled = _props3.disabled;
    var groupProp = _props3.groupProp;
    var placeholder = _props3.placeholder;
    var size = _props3.size;
    var textProp = _props3.textProp;
    var valueProp = _props3.valueProp;

    var hasSelectedOptions = selectedValues.length > 0;
    var options = [];
    if (groupProp) {
      (function () {
        var groups = filteredOptions.reduce(function (result, option) {
          if (!result[option[groupProp]]) {
            result[option[groupProp]] = [];
          }
          result[option[groupProp]].push(option);
          return result;
        }, {});
        options = Object.keys(groups).map(function (group) {
          return _react2['default'].createElement(
            'optgroup',
            { key: group, label: group },
            groups[group].map(function (option) {
              return _react2['default'].createElement(
                'option',
                { key: option[valueProp], value: option[valueProp] },
                option[textProp]
              );
            })
          );
        });
      })();
    } else {
      options = filteredOptions.map(function (option) {
        return _react2['default'].createElement(
          'option',
          { key: option[valueProp], value: option[valueProp] },
          option[textProp]
        );
      });
    }
    return _react2['default'].createElement(
      'div',
      { className: className },
      _react2['default'].createElement('input', {
        type: 'text',
        className: this._getClassName('filter'),
        placeholder: placeholder,
        value: filter,
        onChange: this._onFilterChange,
        onKeyPress: this._onFilterKeyPress,
        disabled: disabled
      }),
      _react2['default'].createElement(
        'select',
        { multiple: true,
          ref: 'select',
          className: this._getClassName('select'),
          size: size,
          value: selectedValues,
          onChange: this._updateSelectedValues,
          onDoubleClick: this._addSelectedToSelection,
          disabled: disabled },
        options
      ),
      _react2['default'].createElement(
        'button',
        { type: 'button',
          className: this._getClassName('button', hasSelectedOptions && 'buttonActive'),
          disabled: !hasSelectedOptions,
          onClick: this._addSelectedToSelection },
        this.props.buttonText
      )
    );
  }
});
module.exports = exports['default'];