import React from 'react';
import ReactDom from 'react-dom';
import 'css/style';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from 'css/materialTheme';
import Register from 'containers/Register';
import Configure from 'containers/Configure';
import Welcome from 'containers/Welcome';
import PageWrapper from 'containers/PageWrapper';
import NotAuthorized from 'containers/NotAuthorized';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

// Passes all props down to children
const PorousRoute = function({ children, ...props }) {
  return (
    <Route path={props.path}>
      <PageWrapper {...props}>{React.cloneElement(children, props)}</PageWrapper>
    </Route>
  );
};

class App extends React.Component {
  render() {
    return (
      <Router>
        <Provider store={store}>
          <MuiThemeProvider theme={theme}>
            <Switch>
              <PorousRoute path="/config" loginRequired={true} iaaRequired={true} tokenRequired={false}>
                <Configure />
              </PorousRoute>
              <PorousRoute path="/register" loginRequired={false} iaaRequired={false} tokenRequired={true}>
                <Register />
              </PorousRoute>
              <PorousRoute path="/notAuthorized" loginRequired={false} iaaRequired={false} tokenRequired={false}>
                <NotAuthorized />
              </PorousRoute>
              <PorousRoute path="/" loginRequired={false} iaaRequired={false} tokenRequired={false}>
                <Welcome />
              </PorousRoute>
            </Switch>
          </MuiThemeProvider>
        </Provider>
      </Router>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
