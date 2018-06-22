import React, { Component } from 'react';
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

const dispatchWith = dispatch => (action, indicator) => {
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
};

/**
 * add view state to redux
 *
 */
export default function withViewState(
  config,
  parentMapStateToProps,
  parentMapDispatchToProps
) {
  const id = config.id || Math.random().toString();
  const reducer = config.reducerName || 'viewState';
  const propName = config.propName || 'viewState';

  return ComponentNode => {
    class viewComponent extends Component {
      constructor(prop) {
        super(prop);
      }

      componentWillMount() {
        const { dispatch } = this.props;
        dispatch(updateViewState(id, {}));
      }

      componentWillUnmount() {
        const { dispatch, keepState = false } = this.props;
        if (!keepState) {
          dispatch(deleteViewState(id));
        }
      }

      render() {
        return <ComponentNode {...this.props} />;
      }
    }

    viewComponent.propTypes = {};
    viewComponent.displayName = `withViewState(${getDisplayName(
      ComponentNode
    )})`;
    hoistNonReactStatic(viewComponent, ComponentNode);

    function mapStateToProps(store, ownProps) {
      const viewState = (store[reducer] && store[reducer][id]) || {};
      const props = { [propName]: viewState };

      if (parentMapStateToProps) {
        return {
          ...props,
          ...parentMapStateToProps(store, props)
        };
      }
      return props;
    }

    function mapDispatchToProps(dispatch, ownProps) {
      const props = {
        dispatch: dispatch,
        setViewState: st => dispatch(updateViewState(id, st)),
        setViewStateAction: st => updateViewState(id, st),
        dispatchWithIndicator: dispatchWith(dispatch)
      };

      if (parentMapDispatchToProps) {
        return {
          ...props,
          ...parentMapDispatchToProps(dispatch, { ...props, ...ownProps })
        };
      }
      return props;
    }

    return connect(
      mapStateToProps,
      mapDispatchToProps
    )(viewComponent);
  };
}
