'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getDisplayName = function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Component';
};

/**
 * add view state to redux
 *
 */
function withViewState(config) {
  var id = config.id || Math.random().toString();
  var reducer = config.reducerName || 'viewState';
  var propName = config.propName || 'viewState';

  return function (ComponentNode) {
    var indicatorComponet = function (_Component) {
      _inherits(indicatorComponet, _Component);

      function indicatorComponet(prop) {
        _classCallCheck(this, indicatorComponet);

        var _this = _possibleConstructorReturn(this, (indicatorComponet.__proto__ || Object.getPrototypeOf(indicatorComponet)).call(this, prop));

        _this.setViewState = function (st) {
          var dispatch = _this.props.dispatch;

          dispatch((0, _actions.updateViewState)(id, st));
        };

        _this.setViewStateAction = function (st) {
          return (0, _actions.updateViewState)(id, st);
        };

        return _this;
      }

      _createClass(indicatorComponet, [{
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
          return _react2.default.createElement(ComponentNode, _extends({}, this.props, {
            setViewState: this.setViewState,
            setViewStateAction: this.setViewStateAction
          }));
        }
      }]);

      return indicatorComponet;
    }(_react.Component);

    indicatorComponet.propTypes = {};
    indicatorComponet.displayName = 'withViewState(' + getDisplayName(ComponentNode) + ')';
    (0, _hoistNonReactStatics2.default)(indicatorComponet, ComponentNode);

    function mapStateToProps(store) {
      var viewState = store[reducer] && store[reducer][id] || {};
      return _defineProperty({}, propName, viewState);
    }

    return (0, _reactRedux.connect)(mapStateToProps)(indicatorComponet);
  };
}