import React, { Component } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import './scss/style.scss'
import 'antd/dist/reset.css';
import lazyWithRetry from './lazyWithRetry'
import { useSelector, useDispatch } from 'react-redux'


const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = lazyWithRetry(() => import('./layout/DefaultLayout'))

// Pages
const Login = lazyWithRetry(() => import('./views/pages/login/Login'))
const Page404 = lazyWithRetry(() => import('./views/pages/page404/Page404'))
const Page500 = lazyWithRetry(() => import('./views/pages/page500/Page500'))

const PengajuanPerusahaan = lazyWithRetry(() => import('./views/pages/pengajuanPerusahaan'))


class App extends Component {
 

  render() {
    return (
      <BrowserRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route exact path="/login" name="Login Page" render={(props) => <Login {...props} />} />
            <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
            <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} />
            <Route exact path="/pengajuan" name="Pengajuan Perusahaan" render={(props) => <PengajuanPerusahaan {...props} />} />
            <Route path="/" name="Home" render={(props) => <DefaultLayout {...props} />} />
            {/* <Route path="*" component={Page404} /> */}
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    )
  }
}

export default App
