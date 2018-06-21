'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = withViewState;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getDisplayName = function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Component';
};

function mergeAction() {
  var acts = [];
  for (var i = 0; i < arguments.length; i++) {
    var it = arguments[i];
    if (it) {
      if (it instanceof Array) {
        acts = [].concat(_toConsumableArray(acts), _toConsumableArray(it));
      } else {
        acts = [].concat(_toConsumableArray(acts), [it]);
      }
    }
  }

  return acts;
}

var dispatchWith = function dispatchWith(dispatch) {
  return function (action, indicator) {
    if (indicator === undefined) {
      dispatch(action);
      return;
    }

    var ind = void 0;
    var unInd = void 0;
    if (typeof indicator === 'string') {
      ind = _defineProperty({}, indicator, true);
      unInd = _defineProperty({}, indicator, false);
    }
    if ((typeof indicator === 'undefined' ? 'undefined' : _typeof(indicator)) === 'object') {
      ind = _extends({}, indicator);
      unInd = Object.keys(indicator).reduce(function (a, b) {
        return _extends({}, a, _defineProperty({}, b, false));
      }, {});
    }

    dispatch((0, _actions.updateViewState)(id, ind));

    var onCompleteAction = mergeAction(action.meta && action.meta.onCompleteAction, (0, _actions.updateViewState)(id, unInd));

    dispatch(_extends({}, action, {
      meta: _extends({}, action.meta, {
        onCompleteAction: onCompleteAction
      })
    }));
  };
};

/**
 * add view state to redux
 *
 */
function withViewState(config, parentMapStateToProps, parentMapDispatchToProps) {
  var id = config.id || Math.random().toString();
  var reducer = config.reducerName || 'viewState';
  var propName = config.propName || 'viewState';

  return function (ComponentNode) {
    var viewComponent = function (_Component) {
      _inherits(viewComponent, _Component);

      function viewComponent(prop) {
        _classCallCheck(this, viewComponent);

        return _possibleConstructorReturn(this, (viewComponent.__proto__ || Object.getPrototypeOf(viewComponent)).call(this, prop));
      }

      _createClass(viewComponent, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          var dispatch = this.props.dispatch;

          dispatch((0, _actions.updateViewState)(id, {}));
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          var dispatch = this.props.dispatch;

          dispatch((0, _actions.deleteViewState)(id));
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(ComponentNode, this.props);
        }
      }]);

      return viewComponent;
    }(_react.Component);

    viewComponent.propTypes = {};
    viewComponent.displayName = 'withViewState(' + getDisplayName(ComponentNode) + ')';
    (0, _hoistNonReactStatics2.default)(viewComponent, ComponentNode);

    function mapStateToProps(store, ownProps) {
      var viewState = store[reducer] && store[reducer][id] || {};
      var props = _defineProperty({}, propName, viewState);

      if (parentMapStateToProps) {
        return _extends({}, props, parentMapStateToProps(store, props));
      }
      return props;
    }

    function mapDispatchToProps(dispatch, ownProps) {
      var props = {
        dispatch: dispatch,
        setViewState: function setViewState(st) {
          return dispatch((0, _actions.updateViewState)(id, st));
        },
        setViewStateAction: function setViewStateAction(st) {
          return (0, _actions.updateViewState)(id, st);
        },
        dispatchWithIndicator: dispatchWith(dispatch)
      };

      if (parentMapDispatchToProps) {
        return _extends({}, props, parentMapDispatchToProps(dispatch, _extends({}, props, ownProps)));
      }
      return props;
    }

    return (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(viewComponent);
  };
}