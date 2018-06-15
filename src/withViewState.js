import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import { updateViewState, deleteViewState } from './actions';

const getDisplayName = Comp => Comp.displayName || Comp.name || 'Component';

/**
 * add view state to redux
 *
 */
export default function withViewState(config) {
  const id = config.id || Math.random().toString();
  const reducer = config.reducerName || 'viewState';
  const propName = config.propName || 'viewState';

  return ComponentNode => {
    class indicatorComponet extends Component {
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

      render() {
        return (
          <ComponentNode
            {...this.props}
            setViewState={this.setViewState}
            setViewStateAction={this.setViewStateAction}
          />
        );
      }
    }

    indicatorComponet.propTypes = {};
    indicatorComponet.displayName = `withViewState(${getDisplayName(
      ComponentNode
    )})`;
    hoistNonReactStatic(indicatorComponet, ComponentNode);

    function mapStateToProps(store) {
      const viewState = (store[reducer] && store[reducer][id]) || {};
      return {
        [propName]: viewState
      };
    }

    return connect(mapStateToProps)(indicatorComponet);
  };
}
