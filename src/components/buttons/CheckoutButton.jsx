import { Wallet } from "@mercadopago/sdk-react";

const CheckoutButton = ({ preferenceId }) => {
  return <Wallet initialization={{ preferenceId }} />;
};

export default CheckoutButton;