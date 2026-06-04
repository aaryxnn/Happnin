import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";

type ExpoNotifications = typeof import("expo-notifications");

let notificationsModule: ExpoNotifications | null = null;

function canUseNotifications() {
  return Platform.OS !== "web" && Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;
}

async function getNotifications() {
  if (!canUseNotifications()) return null;
  if (notificationsModule) return notificationsModule;

  notificationsModule = await import("expo-notifications");
  notificationsModule.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false
    })
  });

  return notificationsModule;
}

export async function registerForPushNotifications() {
  const Notifications = await getNotifications();
  if (!Notifications) return undefined;

  const existing = await Notifications.getPermissionsAsync();
  let finalStatus = existing.status;

  if (existing.status !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    finalStatus = requested.status;
  }

  if (finalStatus !== "granted") return undefined;

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

export async function scheduleEventReminder(title: string, startsAt: string) {
  const start = new Date(startsAt).getTime();
  const reminderAt = start - 60 * 60 * 1000;
  const seconds = Math.floor((reminderAt - Date.now()) / 1000);
  const Notifications = await getNotifications();

  if (seconds <= 0 || !Notifications) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Happnin soon",
      body: `${title} starts in about an hour.`
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds }
  });
}
