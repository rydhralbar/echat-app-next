import "@/styles/globals.scss";
import Head from "next/head";
import Script from "next/script";
import store from "@/stores";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const App = ({ Component, pageProps }) => {
  // let persistor = persistStore(store);
  return (
    <>
      <Head />
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"
        crossOrigin="anonymous"
      />
      {/* <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}> */}
      <Component {...pageProps} />
      {/* </PersistGate>
      </Provider> */}
    </>
  );
};

export default App;
