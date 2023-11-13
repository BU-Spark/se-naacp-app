import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "react-tooltip/dist/react-tooltip.css";
import store from "./redux/store";
import { ApolloProvider } from "@apollo/client";
import client from "./Pipelines/apolloClient";
import { Provider } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";

// Our Contexts
import TractProvider from "./contexts/tract_context";
import ArticleProvider from "./contexts/article_context";
import NeighborhoodProvider from "./contexts/neighborhood_context";
import TopicsProvider from "./contexts/topics_context";
import { Auth0ProviderComponent } from "./config/Auth0Provider";
import UploadProvider from './contexts/upload_context';

const root = ReactDOM.createRoot(document.getElementById("root"));



root.render(
	<Provider store={store}>
		<React.StrictMode>
			<Auth0ProviderComponent>
				<ApolloProvider client={client}>
					<ArticleProvider>
						<TractProvider>
							<NeighborhoodProvider>
								<TopicsProvider>
                <UploadProvider>
  									<App />
									  </UploadProvider>

								</TopicsProvider>
							</NeighborhoodProvider>
						</TractProvider>
					</ArticleProvider>
				</ApolloProvider>
			</Auth0ProviderComponent>
		</React.StrictMode>
	</Provider>,
);
