'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redux = require('redux');

var _utils = require('./utils');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var views = (0, _utils.handleActionsWithLogout)({
  'views/update': function viewsUpdate(state, action) {
    var id = action.payload.id;
    return _extends({}, state, _defineProperty({}, id, _extends({}, state[id], action.payload)));
  },
  'views/delete': function viewsDelete(state, action) {
    var id = action.payload.id;
    var newState = _extends({}, state);

    delete newState[id];
    return newState;
  }
}, {});

exports.default = views;