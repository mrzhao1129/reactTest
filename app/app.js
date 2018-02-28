import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';

import App from './routes/route';
import reducers from './reducers';

import './routes/layout/style.less';

// import '../mock.js';

let store;
const preloadedState = {
  // userInfo: 222,
  // exp: 123456,
}
//-----browser tool-----
if(!(window.__REDUX_DEVTOOLS_EXTENSION__ || window.__REDUX_DEVTOOLS_EXTENSION__)){
    store = createStore(reducers, preloadedState, applyMiddleware(thunk));
}else{
  store = createStore(
    reducers, preloadedState, 
    compose(applyMiddleware(thunk),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
}

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>
    , document.getElementById("root")
  );
};

render(App);

// 模块热替换的 API
if (module.hot) {
  module.hot.accept('./routes/route', () => {
    render(App)
  });
}
