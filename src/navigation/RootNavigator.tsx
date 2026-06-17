import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, Compass, Home, LucideProps, Map as MapIcon, Plus, User } from "lucide-react-native";
import { ComponentType } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "../components/AppButton";
import { useApp } from "../context/AppContext";
import { AuthScreen } from "../screens/AuthScreen";
import { CreateEventScreen } from "../screens/CreateEventScreen";
import { DiscoverScreen } from "../screens/DiscoverScreen";
import { EventDetailsScreen } from "../screens/EventDetailsScreen";
import { FeedScreen } from "../screens/FeedScreen";
import { MapScreen } from "../screens/MapScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { SavedScreen } from "../screens/SavedScreen";
import { colors } from "../theme";
import { MainTabParamList, RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator
      tabBar={(props) => <MainTabBar {...props} />}
      screenOptions={{
        headerShown: false
      }}
    >
      <Tabs.Screen name="Feed" component={FeedScreen} />
      <Tabs.Screen name="Discover" component={DiscoverScreen} />
      <Tabs.Screen name="Map" component={MapScreen} />
      <Tabs.Screen name="Saved" component={SavedScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

const tabConfig: Record<string, { label: string; Icon: ComponentType<LucideProps> }> = {
  Feed: { label: "Home", Icon: Home },
  Discover: { label: "Explore", Icon: Compass },
  Map: { label: "Map", Icon: MapIcon },
  Saved: { label: "Calendar", Icon: Calendar },
  Profile: { label: "Profile", Icon: User }
};

function MainTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const leftRoutes = state.routes.slice(0, 2);
  const rightRoutes = state.routes.slice(2);

  function navigateToCreate() {
    (navigation.getParent() as { navigate?: (screen: string) => void } | undefined)?.navigate?.("CreateEvent");
  }

  function renderRoute(route: (typeof state.routes)[number]) {
    const focused = state.routes[state.index]?.key === route.key;
    const config = tabConfig[route.name];
    if (!config) return null;
    const { Icon, label } = config;

    function handlePress() {
      const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
    }

    return (
      <Pressable key={route.key} onPress={handlePress} style={({ pressed }) => [styles.tabItem, pressed && styles.tabPressed]}>
        <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
          <Icon color={focused ? colors.accent : colors.inkFaint} size={24} strokeWidth={focused ? 3 : 2.45} />
        </View>
        <Text style={[styles.tabLabel, focused && styles.tabLabelActive]} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.tabShell, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.tabRow}>
        {leftRoutes.map(renderRoute)}
        <View style={styles.createSlot} />
        {rightRoutes.map(renderRoute)}
      </View>
      <Pressable onPress={navigateToCreate} style={({ pressed }) => [styles.createPressable, pressed && styles.createPressed]}>
        <LinearGradient colors={[colors.pink, colors.accent]} start={{ x: 0.18, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.createButton}>
          <Plus color={colors.text} size={34} strokeWidth={3.2} />
        </LinearGradient>
      </Pressable>
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

const styles = StyleSheet.create({
  tabShell: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 94,
    paddingTop: 10,
    backgroundColor: "rgba(7, 3, 14, 0.98)",
    borderTopColor: "rgba(168, 85, 247, 0.28)",
    borderTopWidth: 1.5,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 20
  },
  tabRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8
  },
  tabItem: {
    flex: 1,
    minWidth: 0,
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 2
  },
  tabPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.96 }]
  },
  tabIconWrap: {
    width: 36,
    height: 32,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  tabIconWrapActive: {
    backgroundColor: "rgba(168, 85, 247, 0.18)"
  },
  tabLabel: {
    color: colors.inkFaint,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0
  },
  tabLabelActive: {
    color: colors.accent
  },
  createSlot: {
    width: 68
  },
  createPressable: {
    position: "absolute",
    left: "50%",
    top: 10,
    marginLeft: -31
  },
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
  },
  createPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.92
  }
});
