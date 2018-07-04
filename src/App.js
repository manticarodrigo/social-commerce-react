import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import './App.css'

import Error from './views/Error/Error'
import Login from './views/Login/Login'
import Dashboard from './views/Dashboard/Dashboard'
import CategoryForm from './views/Category/CategoryForm'
import ProductForm from './views/Product/ProductForm'
import { Catalog } from './views/Catalog/Catalog'

import { facebookLogin } from './services/WordPress'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      auth: null,
      category: null,
      products: null
    }
    this.handleCategorySent = this.handleCategorySent.bind(this)
    this.handleProductsSent = this.handleProductsSent.bind(this)
    this.handleAuthResponse = this.handleAuthResponse.bind(this)
  }

  handleAuthResponse(response) {
    console.log(response)
    if (response.profile) {
      facebookLogin(response.token.accessToken)
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          // const testCategory = {
          //   term_id: 16,
          //   term_link: 'http://localhost:8080/product-category/test',
          //   term_name: 'Test'
          // }
          // this.setState({category: testCategory, productsCreated: true})
          this.setState({user: response, auth: res.data})
          this.props.history.replace('/')
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }

  handleCategorySent(category) {
    this.setState({ category: category })
    this.props.history.replace('/product/new')
  }

  handleProductsSent() {
    this.setState({ products: true })
    this.props.history.replace('/catalog')
  }

  render() {
    const { user, auth, category, products } = this.state
    return (
      <div className="App">
        <Switch>
        <Route
            exact path='/'
            render={() => (
              <Dashboard
                user={user}
                auth={auth}
                category={category}
                products={products} />
          )} />
          <Route
            exact path='/login'
            render={() => (
              <Login
                onResponse={this.handleAuthResponse} />
            )} />
          <Route
            exact path='/category/new'
            render={() => (
              <CategoryForm
                user={user}
                auth={auth ? auth : null}
                handleSubmit={this.handleCategorySent} />
          )} />
          <Route
            exact path='/product/new'
            render={() => (
              <ProductForm
                user={user}
                auth={auth ? auth : null}
                handleSubmit={this.handleProductsSent}
                category={category} />
          )} />
          <Route
            exact path='/catalog'
            render={() => (
              <Catalog
                category={category} />
          )} />
          <Route component={Error} />
        </Switch>
      </div>
    )
  }
}

export default withRouter(App)