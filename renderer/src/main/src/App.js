import React from 'react';
import { Layout } from 'antd';
import { Provider } from 'mobx-react'
import store from './store/index'
import HeaderNav from './component/header/index'
import Wrapper from './component/wrapper/index'
import "./App.css"

const UserLayout = () => {
  return <>
    <Provider store={store}>
      <Layout>
        {/* <HeaderNav /> */}
        <Wrapper />
      </Layout>
    </Provider>
  </>
}

export default UserLayout
