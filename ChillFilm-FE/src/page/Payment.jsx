import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const initialOptions = {
    clientId: "test",
    currency: "USD",
    intent: "capture",
};

export default function Payment() {
    return (
        <div>
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons />
            </PayPalScriptProvider>
        </div>
    );
}
