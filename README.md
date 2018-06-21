# with-view-state
make redux to store some state

# Introduction

people use redux may confused when to use setState and when to use dispatch.

this package is aimed to store the state to redux simply

**usefull for these situations:**

- show/hide modal
- submitting/done button
- loading/hide spinner

# Usage

## 1. add reducer to your reducers


```
import { combineReducers } from 'redux';
import { reducer as viewState } from 'with-view-state';

// reducers = ....

export default combineReducers({
  ...reducers,
  viewState
});

```

## 2. wrap your component:
```
import withViewState  from 'with-view-state'
//  YourComponent : .....

const config = {
  id: 'myComponent-1',      //defualt is a random string, set some name if you need
  reducerName: 'viewState', //viewState is default, you could set to other name
  propName: 'viewState',    //viewState is default, you could set to other name
}

const wrapped = withViewState(config)(YourComponent)

```

## 3. get/set in your componet

```
class YourComponent extends Component{

  onClick = () => {
    this.props.setViewState({ submitting: true } )
  }

  render() {
    ....
    const { viewState } = this.props;
    const { submitting } = viewState;

    ....

  }
}

```

or dummy component:
```
const YouCompoent = ({viewState, setViewState}) => {
  ....
}

```


