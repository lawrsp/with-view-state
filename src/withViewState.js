import React, { PureComponent } from 'react';
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
export default function withViewState({
  id = Math.random().toString(),
  reducer = 'viewState',
  propName = 'viewState',
  keepState = false,
  getViewState,
  mapViewProps
}) {
  return ComponentNode => {
    class viewComponent extends PureComponent {
      constructor(props) {
        super(props);
        this.setViewState = this.setViewState.bind(this);
        this.setViewStateAction = this.setViewStateAction.bind(this);
        this.dispatchWithIndicator = this.dispatchWithIndicator.bind(this);
      }

      componentWillMount() {
        const { dispatch } = this.props;
        dispatch(updateViewState(id, {}));
      }

      componentWillUnmount() {
        const { dispatch } = this.props;
        if (typeof keepState === 'function') {
          if (keepState(this.props)) {
            return;
          }
        } else if (keepState) {
          return;
        }

        dispatch(deleteViewState(id));
      }

      setViewState(st) {
        const { dispatch } = this.props;
        dispatch(updateViewState(id, st));
      }
      setViewStateAction(st) {
        return updateViewState(id, st);
      }

      dispatchWithIndicator(action, indicator) {
        const { dispatch } = this.props;
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

        dispatch(updateViewState(id, ind));

        const onCompleteAction = mergeAction(
          action.meta && action.meta.onCompleteAction,
          updateViewState(id, unInd)
        );

        dispatch({
          ...action,
          meta: {
            ...action.meta,
            onCompleteAction
          }
        });
      }

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

    const thGetViewState =
      getViewState ||
      function(state) {
        return state[reducer];
      };
    const thMapViewProps =
      mapViewProps ||
      function(viewState) {
        return { [propName]: viewState };
      };

    function mapStateToProps(store) {
      const state = thGetViewState(store);
      const viewState = (state && state[id]) || {};
      return thMapViewProps(viewState);
    }

    return connect(mapStateToProps)(viewComponent);
  };
}
