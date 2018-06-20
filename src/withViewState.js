import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import { updateViewState, deleteViewState } from './actions';

const getDisplayName = Comp => Comp.displayName || Comp.name || 'Component';

function mergeAction() {
  var acts = [];
  for (var i = 0; i < arguments.length; i++) {
    const it = arguments[i];
    if (it) {
      if (it instanceof Array) {
        acts = [...acts, ...it];
      } else {
        acts = [...acts, it];
      }
    }
  }

  return acts;
}

/**
 * add view state to redux
 *
 */
export default function withViewState(config) {
  const id = config.id || Math.random().toString();
  const reducer = config.reducerName || 'viewState';
  const propName = config.propName || 'viewState';

  return ComponentNode => {
    class viewComponent extends Component {
      constructor(prop) {
        super(prop);
      }

      setViewState = st => {
        const { dispatch } = this.props;
        dispatch(updateViewState(id, st));
      };
      setViewStateAction = st => {
        return updateViewState(id, st);
      };

      componentWillMount() {
        const { dispatch } = this.props;
        dispatch(updateViewState(id, {}));
      }

      componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(deleteViewState(id));
      }

      dispatchWithIndicator = (action, indicator) => {
        const { dispatch } = this.props;
        const setViewStateAction = this.setViewStateAction;

        if (indicator === undefined) {
          dispatch(action);
          return;
        }

        let ind;
        let unInd;
        if (typeof indicator === 'string') {
          ind = {
            [indicator]: true
          };
          unInd = {
            [indicator]: false
          };
        }
        if (typeof indicator === 'object') {
          ind = { ...indicator };
          unInd = Object.keys(indicator).reduce((a, b) => {
            return {
              ...a,
              [b]: false
            };
          }, {});
        }

        dispatch(setViewStateAction(ind));

        const onCompleteAction = mergeAction(
          action.meta && action.meta.onCompleteAction,
          setViewStateAction(unInd)
        );

        dispatch({
          ...action,
          meta: {
            ...action.meta,
            onCompleteAction
          }
        });
      };

      render() {
        return (
          <ComponentNode
            {...this.props}
            setViewState={this.setViewState}
            setViewStateAction={this.setViewStateAction}
            dispatchWithIndicator={this.dispatchWithIndicator}
          />
        );
      }
    }

    viewComponent.propTypes = {};
    viewComponent.displayName = `withViewState(${getDisplayName(
      ComponentNode
    )})`;
    hoistNonReactStatic(viewComponent, ComponentNode);

    function mapStateToProps(store) {
      const viewState = (store[reducer] && store[reducer][id]) || {};
      return {
        [propName]: viewState
      };
    }

    return connect(mapStateToProps)(viewComponent);
  };
}
