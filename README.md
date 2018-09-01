# with-view-state
use redux to store some state in view component

# Install

```
npm install --save with-view-state
```

# Introduction

people use redux may confused when to use setState and when to use dispatch reducer action.

this package is aimed to store the state to redux. Forget setState, enjoy redux!

**usefull for these situations:**

- show/hide modal
- submitting/done button
- loading/hide spinner

# Usage

## 1. add the reducer to your reducers


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

# Configure

The configure that the decorator withViewState() accept.

## getViewState : Function(store): viewStateStore

default is 

```
(store) => store.viewState
```

if your reducer is not at `sotre.viewState`, set another function

## mapViewProps : Function(thisViewState) => props

default is 
```
(state) => ({viewState: state})

```

this makes props.viewState to get the view state for the view.
you can set as your usage 

## keepState : Bool || Function(props) Bool
As default, when a view is unmounted, it's view state will be remove from the store,
you can set keepState = true to keep it , or set a function to determin according to 
the props.

## old: 
these will be decprecated in future
###  reducerName : String
set the store name in reducer, default is 'viewState'
###  propName: String
set the props where can get the view state for a view , default is  'viewState'


# Props
The props that generated to give to your decorated form component.


## setViewStateAction : Function(Object): action
This is a bound action creator for the view, it return the action 

## setViewState : Function(Object) :Void
this function dispatch a bound view update action

## dispatchWithIndicator: Function(action, indicator) : Void

this function will first dispatch a indicator start action and then dispatch the action
with a meta fields onCompleteAction which is the idicator complete action.

### indicator:  String || Object

when indicator is a string, it will be as the field name, in start it will be true, on completed, it will be false,
if indicator is a object, it will be itself on start, and on completed, it will be a object with the same keys, 
but every value si false

for explain:
```
indicator = "submitting"

on start :  viewState = {submitting : true, ...others }
completed:  viewState = {submitting : false, ...others }

```

or 
```
idicator = { startDate: "1999-10-20", submitting: true }

on start: viewState = { spin: "double-bounce", submitting: true, ...others }
completed:  viewState = { spin: false, submitting: false, ...others }

```

Notice: 
You may need some async handlers like redux-saga to dispatch the onCompleteAction. 

