import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import News from '../views/news/News'
import Detail from '../views/news/Detail'
import myLocalStorage from '../util/myLocalStorage'

export default function IndexRouter() {

  // const myLocalStorage = new MyLocalStorage()
  myLocalStorage.initRun()
  return (
    <HashRouter>
      <Switch>
        <Route path='/login' component={Login}></Route>
        <Route path='/news' component={News}></Route>
        <Route path='/detail/:id' component={Detail}></Route>
        <Route path='/' render={() =>
          localStorage.getItem('token_lh') ?
            <NewsSandBox></NewsSandBox> :
            <Redirect to='/login'></Redirect>
        }></Route>
      </Switch>
    </HashRouter>
  )
}
