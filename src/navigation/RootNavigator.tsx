import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CalendarPlus, Compass, Home, LucideProps, MapPin, Ticket, User } from "lucide-react-native";
import { ComponentType } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { Txt } from "../components/Txt";
import { useApp } from "../context/AppContext";
import { AuthScreen } from "../screens/AuthScreen";
import { CreateEventScreen } from "../screens/CreateEventScreen";
import { DiscoverScreen } from "../screens/DiscoverScreen";
import { EventDetailsScreen } from "../screens/EventDetailsScreen";
import { FeedScreen } from "../screens/FeedScreen";
import { MapScreen } from "../screens/MapScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { OrganizerScreen } from "../screens/OrganizerScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { SavedScreen } from "../screens/SavedScreen";
import { colors, fonts } from "../theme";
import { MainTabParamList, RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 16,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 22,
          height: 66,
          paddingTop: 8,
          paddingBottom: 8,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.4,
          shadowRadius: 20,
          elevation: 12
        },
        tabBarActiveTintColor: colors.accentText,
        tabBarInactiveTintColor: colors.faint,
        tabBarItemStyle: { borderRadius: 16 },
        tabBarLabelStyle: { fontSize: 10.5, fontFamily: fonts.semibold, marginTop: 2 }
      }}
    >
      <Tabs.Screen name="Feed" component={FeedScreen} options={{ tabBarIcon: icon(Home) }} />
      <Tabs.Screen name="Discover" component={DiscoverScreen} options={{ tabBarIcon: icon(Compass) }} />
      <Tabs.Screen name="Map" component={MapScreen} options={{ tabBarIcon: icon(MapPin) }} />
      <Tabs.Screen name="Saved" component={SavedScreen} options={{ tabBarIcon: icon(Ticket) }} />
      <Tabs.Screen name="Organizer" component={OrganizerScreen} options={{ tabBarIcon: icon(CalendarPlus) }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: icon(User) }} />
    </Tabs.Navigator>
  );
}

function icon(Icon: ComponentType<LucideProps>) {
  return ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <Icon color={focused ? colors.accentText : color} size={size - 2} strokeWidth={2.3} />
    </View>
  );
}

export function RootNavigator() {
  const { loading, user, dataError, refreshData } = useApp();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (dataError && user) {
    return (
      <View style={styles.error}>
        <Txt variant="h1" center>
          Could not load Happnin
        </Txt>
        <Txt variant="body" color={colors.muted} center>
          {dataError}
        </Txt>
        <View style={styles.errorButton}>
          <AppButton title="Retry" onPress={refreshData} />
        </View>
      </View>
    );
  }

  const needsOnboarding = Boolean(user && !user.fullName);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: fonts.bold, fontSize: 17 },
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      {!user ? (
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      ) : needsOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="EventDetails"
            component={EventDetailsScreen}
            options={{ title: "", headerTransparent: true, headerTintColor: colors.text }}
          />
          <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: "Create event" }} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background
  },
  error: {
    flex: 1,
    gap: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background
  },
  errorButton: {
    alignSelf: "stretch"
  },
  tabIcon: {
    width: 44,
    height: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  tabIconActive: {
    backgroundColor: colors.accentSoft
  }
});
