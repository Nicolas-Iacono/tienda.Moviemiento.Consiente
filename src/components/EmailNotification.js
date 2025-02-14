import axios from 'axios';

export const sendPurchaseEmails = async (purchaseData) => {
  try {
    const response = await axios.post('/api/send-purchase-emails', purchaseData);
    return response.data;
  } catch (error) {
    console.error('Error sending purchase emails:', error);
    throw error;
  }
};
