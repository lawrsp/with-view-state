'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var UPDATE = exports.UPDATE = '@view-state/update';
var DELETE = exports.DELETE = '@view-state/delete';

var updateViewState = exports.updateViewState = function updateViewState(id, st) {
  return {
    type: UPDATE,
    meta: { id: id },
    payload: st
  };
};

var deleteViewState = exports.deleteViewState = function deleteViewState(id) {
  return {
    type: DELETE,
    meta: { id: id }
  };
};