'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actions = require('./actions');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var views = function views() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case _actions.UPDATE:
      {
        var id = action.meta.id;
        return _extends({}, state, _defineProperty({}, id, _extends({}, state[id], action.payload)));
      }
    case _actions.DELETE:
      {
        var _id = action.meta.id;
        var newState = _extends({}, state);

        delete newState[_id];
        return newState;
      }
    default:
      return state;
  }
};

exports.default = views;