import { App } from "antd";
import { useContext } from "react";

export const useMessage = () => {
  const { message } = App.useApp();
  return message;
};

// For backwards compatibility, also export a function that can be used globally
export const getMessageInstance = () => {
  // This will fall back to the static methods if App context is not available
  const message = App.useApp?.()?.message;
  return message;
};
