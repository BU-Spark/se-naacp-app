import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'react-tooltip/dist/react-tooltip.css'
import store from './redux/store'
import {ApolloProvider} from '@apollo/client'
import client from "./Pipelines/apolloClient"
import { Provider } from 'react-redux'

// Our Contexts
import TractProvider from "./contexts/tract_context"

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
      <React.StrictMode>
        <ApolloProvider client={client}>
          <TractProvider>
            <App />
          </TractProvider>
        </ApolloProvider>
      </React.StrictMode>
    </Provider>
);