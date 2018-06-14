import React, {Component} from 'react'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'

import HomePage from '../views/container/HomePage'
import UploadPage from '../views/container/UploadPage'
import FolderPage from '../views/container/FolderPage'
import LoginPage from '../views/container/LoginPage'


class RouteMap extends Component {
    constructor (props) {
        super(props)
    }
    render () {
      return (
        <Router>
          <Switch>
            <Route exact  path="/" component={HomePage}/>
            <Route exact  path="/login" component={LoginPage}/>
            <Route exact  path="/upload" component={UploadPage}/>
            <Route exact  path="/folder" component={FolderPage}/>
          </Switch>
        </Router>
      )
    }
}

module.exports = RouteMap
