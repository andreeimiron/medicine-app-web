import { NotificationManager } from "react-notifications";

export const showError = (message) => {
  NotificationManager.error(message, 'Eroare', 5000);
}

export const showInfo = (message) => {
  NotificationManager.info(message, 'Info', 5000);
}

export const showSuccess = (message) => {
  NotificationManager.success(message, 'Succes', 5000);
}

export const showWarning = (message) => {
  NotificationManager.warning(message, 'Alerta', 5000);
}
