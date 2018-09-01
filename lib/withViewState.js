'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = withViewState;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

/**
 * add view state to redux
 *
 */
function withViewState(_ref) {
  var _ref$id = _ref.id,
      id = _ref$id === undefined ? Math.random().toString() : _ref$id,
      _ref$reducer = _ref.reducer,
      reducer = _ref$reducer === undefined ? 'viewState' : _ref$reducer,
      _ref$propName = _ref.propName,
      propName = _ref$propName === undefined ? 'viewState' : _ref$propName,
      _ref$keepState = _ref.keepState,
      keepState = _ref$keepState === undefined ? false : _ref$keepState,
      getViewState = _ref.getViewState,
      mapViewProps = _ref.mapViewProps;

  return function (ComponentNode) {
    var viewComponent = function (_PureComponent) {
      _inherits(viewComponent, _PureComponent);

      function viewComponent(props) {
        _classCallCheck(this, viewComponent);

        var _this = _possibleConstructorReturn(this, (viewComponent.__proto__ || Object.getPrototypeOf(viewComponent)).call(this, props));

        _this.setViewState = _this.setViewState.bind(_this);
        _this.setViewStateAction = _this.setViewStateAction.bind(_this);
        _this.dispatchWithIndicator = _this.dispatchWithIndicator.bind(_this);
        return _this;
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

          if (typeof keepState === 'function') {
            if (keepState(this.props)) {
              return;
            }
          } else if (keepState) {
            return;
          }

          dispatch((0, _actions.deleteViewState)(id));
        }
      }, {
        key: 'setViewState',
        value: function setViewState(st) {
          var dispatch = this.props.dispatch;

          dispatch((0, _actions.updateViewState)(id, st));
        }
      }, {
        key: 'setViewStateAction',
        value: function setViewStateAction(st) {
          return (0, _actions.updateViewState)(id, st);
        }
      }, {
        key: 'dispatchWithIndicator',
        value: function dispatchWithIndicator(action, indicator) {
          var dispatch = this.props.dispatch;

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
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(ComponentNode, _extends({}, this.props, {
            setViewState: this.setViewState,
            setViewStateAction: this.setViewStateAction,
            dispatchWithIndicator: this.dispatchWithIndicator
          }));
        }
      }]);

      return viewComponent;
    }(_react.PureComponent);

    viewComponent.propTypes = {};
    viewComponent.displayName = 'withViewState(' + getDisplayName(ComponentNode) + ')';
    (0, _hoistNonReactStatics2.default)(viewComponent, ComponentNode);

    var thGetViewState = getViewState || function (state) {
      return state[reducer];
    };
    var thMapViewProps = mapViewProps || function (viewState) {
      return _defineProperty({}, propName, viewState);
    };

    function mapStateToProps(store) {
      var state = thGetViewState(store);
      var viewState = state && state[id] || {};
      return thMapViewProps(viewState);
    }

    return (0, _reactRedux.connect)(mapStateToProps)(viewComponent);
  };
}