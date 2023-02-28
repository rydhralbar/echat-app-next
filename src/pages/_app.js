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
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Tilt+Warp&display=swap"
          rel="stylesheet"
        />
      </Head>
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
