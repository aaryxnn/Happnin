import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, Compass, Home, LucideProps, Plus, User } from "lucide-react-native";
import { ComponentType } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { useApp } from "../context/AppContext";
import { AuthScreen } from "../screens/AuthScreen";
import { CreateEventScreen } from "../screens/CreateEventScreen";
import { DiscoverScreen } from "../screens/DiscoverScreen";
import { EventDetailsScreen } from "../screens/EventDetailsScreen";
import { FeedScreen } from "../screens/FeedScreen";
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
          left: 0,
          right: 0,
          bottom: 0,
          height: 92,
          paddingTop: 10,
          paddingBottom: 16,
          backgroundColor: "rgba(7, 3, 14, 0.98)",
          borderTopColor: "rgba(168, 85, 247, 0.28)",
          borderTopWidth: 1.5,
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.1,
          shadowRadius: 18,
          elevation: 20
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarItemStyle: { minHeight: 66 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "800", letterSpacing: 0 }
      }}
    >
      <Tabs.Screen name="Feed" component={FeedScreen} options={{ tabBarLabel: "Home", tabBarIcon: tabIcon(Home) }} />
      <Tabs.Screen name="Discover" component={DiscoverScreen} options={{ tabBarLabel: "Explore", tabBarIcon: tabIcon(Compass) }} />
      <Tabs.Screen
        name="Organizer"
        component={OrganizerScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            (navigation.getParent() as { navigate?: (screen: string) => void } | undefined)?.navigate?.("CreateEvent");
          }
        })}
        options={{
          tabBarLabel: "",
          tabBarIcon: createIcon
        }}
      />
      <Tabs.Screen name="Saved" component={SavedScreen} options={{ tabBarLabel: "Calendar", tabBarIcon: tabIcon(Calendar) }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: "Profile", tabBarIcon: tabIcon(User) }} />
    </Tabs.Navigator>
  );
}

function tabIcon(Icon: ComponentType<LucideProps>) {
  return ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
    <View
      style={{
        width: 40,
        height: 34,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? "rgba(168, 85, 247, 0.18)" : "transparent"
      }}
    >
      <Icon color={focused ? colors.accent : color} size={size + 2} strokeWidth={focused ? 3 : 2.5} />
    </View>
  );
}

function createIcon() {
  return (
    <LinearGradient colors={[colors.pink, colors.accent]} start={{ x: 0.18, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.createButton}>
      <Plus color={colors.text} size={34} strokeWidth={3.2} />
    </LinearGradient>
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

const styles = {
  createButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginTop: -18,
    shadowColor: colors.pink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 16
  }
};
