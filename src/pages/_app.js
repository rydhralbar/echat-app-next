import "@/styles/globals.scss";
import Head from "next/head";
import store from "@/stores";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const App = ({ Component, pageProps }) => {
  let persistor = persistStore(store);
  return (
    <>
      <Head />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
