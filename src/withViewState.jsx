import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

const getDisplayName = Comp => Comp.displayName || Comp.name || 'Component';

/**
 * 为一个Compoent
 *
 * @param  {[type]} ComponentNode [description]
 * @return {[type]}               [description]
 */
export default function withIndicator(ComponentNode) {
  const id = Math.random().toString();
  class indicatorComponet extends Component {
    propTypes: {}

    constructor(prop) {
      super(prop);
      this.setIndicator = this.setIndicator.bind(this);
      this.dispatchWithIndicator = this.dispatchWithIndicator.bind(this);
    }

    componentWillMount() {
      const { dispatch } = this.props;
      dispatch({
        type: 'views/update',
        payload: {
          id,
        },
      });
    }

    componentWillUnmount() {
      const { dispatch } = this.props;
      dispatch({
        type: 'views/delete',
        payload: {
          id,
        },
      });
    }

    setIndicator(obj) {
      const { dispatch } = this.props;
      dispatch({
        type: 'views/update',
        payload: {
          id,
          ...obj,
        },
      });
    }

    dispatchWithIndicator(action, indicator, sucessInfo) {
      const { dispatch } = this.props;
      const setIndicator = this.setIndicator;

      if (indicator === undefined) {
        dispatch(action);
        return;
      }

      let ind;
      let unInd;
      if (typeof indicator === 'string') {
        ind = {
          [indicator]: true,
        };
        unInd = {
          [indicator]: false,
        };
      }
      if (typeof indicator === 'object') {
        ind = indicator;
        unInd = Object.keys(indicator).reduce((a, b) => {
          return {
            ...a,
            [b]: false,
          }
        }, {});
      }

      setIndicator(ind);
      const oldComplete = action.meta ? action.meta.onComplete || (() => {}) : (() => {});

      let onSuccess = action.meta && action.meta.onSuccess || (() => {});

      if (sucessInfo) {
        const oldSucess = action.meta && action.meta.onSuccess;
        onSuccess = (args) => {
          if (typeof oldSucess === 'function') {
            oldSucess(args);
          }
        }
      }
      dispatch({
        ...action,
        meta: {
          ...action.meta,
          onSuccess,
          onComplete() {
            oldComplete();
            setIndicator(unInd);
          },
        },
      });
    }

    render() {
      const { indicator, ...others } = this.props;
      return (<ComponentNode
        indicator={indicator}
        {...others}
        setIndicator={this.setIndicator}
        dispatchWithIndicator={this.dispatchWithIndicator}
      />);
    }
  }

  indicatorComponet.displayName = `withViewState(${getDisplayName(ComponentNode)})`;
  hoistNonReactStatic(indicatorComponet, ComponentNode);

  function mapStateToProps({ views }) {
    const indicator = views[id] || {};
    return {
      indicator,
    };
  }

  return connect(mapStateToProps)(indicatorComponet);
}

