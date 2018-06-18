import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'

import RouterMap from '../router'
import configureStore from '../redux/store'

import './reset.css'

function renderRoot () {
  ReactDOM.render(
    <AppContainer>
      <Provider store={configureStore}>
        <RouterMap/>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}

renderRoot()

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept(() => renderRoot());
}