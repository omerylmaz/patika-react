import { HubConnectionBuilder } from "@microsoft/signalr";

let connection = null;

export const initializeSignalRConnection = async () => {
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_API_URL}/pay-hub`)
      .withAutomaticReconnect()
      .build();

    try {
      await connection.start();
      console.log("signalr connected");
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};

export const registerTransaction = async (conversationId) => {
  if (!connection) {
    throw new Error("signalr connection failed");
  }
  try {
    await connection.invoke("RegisterTransaction", conversationId);
    console.log(conversationId);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const onReceivePayment = (callback) => {
  if (!connection) {
    throw new Error("signalr connection failed");
  }
  connection.off("ReceivePayment");
  connection.on("ReceivePayment", callback);
};
