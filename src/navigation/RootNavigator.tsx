import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CalendarPlus, Compass, LucideProps, Map, Sparkles, Ticket, User } from "lucide-react-native";
import { ComponentType } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { AppButton } from "../components/AppButton";
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
import { colors } from "../theme";
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
          left: 14,
          right: 14,
          bottom: 12,
          backgroundColor: "rgba(8, 4, 15, 0.96)",
          borderTopColor: colors.borderSoft,
          borderTopWidth: 1,
          borderColor: colors.borderSoft,
          borderWidth: 1,
          borderRadius: 28,
          height: 72,
          paddingTop: 7,
          paddingBottom: 11,
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.22,
          shadowRadius: 28,
          elevation: 16
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.faint,
        tabBarItemStyle: { borderRadius: 22 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "900" }
      }}
    >
      <Tabs.Screen name="Feed" component={FeedScreen} options={{ tabBarIcon: icon(Sparkles) }} />
      <Tabs.Screen name="Discover" component={DiscoverScreen} options={{ tabBarIcon: icon(Compass) }} />
      <Tabs.Screen name="Map" component={MapScreen} options={{ tabBarIcon: icon(Map) }} />
      <Tabs.Screen name="Saved" component={SavedScreen} options={{ tabBarIcon: icon(Ticket) }} />
      <Tabs.Screen name="Organizer" component={OrganizerScreen} options={{ tabBarIcon: icon(CalendarPlus) }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: icon(User) }} />
    </Tabs.Navigator>
  );
}

function icon(Icon: ComponentType<LucideProps>) {
  return ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
    <View
      style={{
        width: 34,
        height: 30,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? "rgba(168, 85, 247, 0.28)" : "transparent"
      }}
    >
      <Icon color={focused ? colors.purpleGlow : color} size={size} strokeWidth={2.5} />
    </View>
  );
}

export function RootNavigator() {
  const { loading, user, dataError, refreshData } = useApp();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (dataError && user) {
    return (
      <View style={{ flex: 1, gap: 16, padding: 24, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: "900", textAlign: "center" }}>Could not load Happnin</Text>
        <Text style={{ color: colors.muted, lineHeight: 22, textAlign: "center" }}>{dataError}</Text>
        <AppButton title="Retry" onPress={refreshData} />
      </View>
    );
  }

  const needsOnboarding = Boolean(user && !user.fullName);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "800" },
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
          <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: "Event" }} />
          <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: "Create event" }} />
        </>
      )}
    </Stack.Navigator>
  );
}
