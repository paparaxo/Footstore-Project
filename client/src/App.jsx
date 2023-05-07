import "./App.css";
import { StateProvider } from "./config/contex";
import Routespath from "./routes/Routespath";
import { Toaster } from "react-hot-toast";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function App() {
  return (
    <>
      <StateProvider>
        <PayPalScriptProvider deferLoading={true}>
        <Toaster />
        <Routespath />
        </PayPalScriptProvider>
      </StateProvider>
    </>
  );
}

export default App;
