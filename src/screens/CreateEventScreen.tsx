import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Calendar, Clock, ImagePlus, MapPin } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Alert, Image, Platform, Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { AppButton } from "../components/AppButton";
import { Chip } from "../components/Chip";
import { PageHeader } from "../components/PageElements";
import { Screen } from "../components/Screen";
import { TextField } from "../components/TextField";
import { Txt } from "../components/Txt";
import { useApp } from "../context/AppContext";
import { categories, colors, radius, spacing } from "../theme";
import { Campus, EventCategory } from "../types";

type PlaceSuggestion = {
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

type PosterAsset = {
  uri: string;
  mimeType?: string;
  fileName?: string;
};

type PickerMode = "date" | "time" | null;

const defaultPosterImage =
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&h=1125&q=80";

export function CreateEventScreen() {
  const navigation = useNavigation();
  const { createEvent, uploadEventPoster, organizers, user, campus } = useApp();
  const myOrganizer = organizers.find((organizer) => organizer.ownerUserId === user?.id && organizer.verified);
  const placeSuggestions = useMemo(() => getPlaceSuggestions(campus), [campus]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<EventCategory>("Clubs");
  const [startsAt, setStartsAt] = useState(() => new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [activePicker, setActivePicker] = useState<PickerMode>(null);
  const [venueName, setVenueName] = useState(placeSuggestions[0]?.name ?? "");
  const [address, setAddress] = useState(placeSuggestions[0]?.address ?? "");
  const [latitude, setLatitude] = useState(placeSuggestions[0]?.latitude ?? campus.latitude);
  const [longitude, setLongitude] = useState(placeSuggestions[0]?.longitude ?? campus.longitude);
  const [selectedPlaceName, setSelectedPlaceName] = useState(placeSuggestions[0]?.name ?? "");
  const [nearbyAddresses, setNearbyAddresses] = useState<PlaceSuggestion[]>([]);
  const [addressSearchStatus, setAddressSearchStatus] = useState<"idle" | "searching" | "error">("idle");
  const [poster, setPoster] = useState<PosterAsset | null>(null);
  const [publishing, setPublishing] = useState(false);

  const selectedPosterUri = poster?.uri ?? defaultPosterImage;

  useEffect(() => {
    const term = address.trim();

    if (term.length < 3 || selectedPlaceName) {
      setNearbyAddresses([]);
      setAddressSearchStatus("idle");
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setAddressSearchStatus("searching");
        const results = await searchNearbyAddresses(term, campus, controller.signal);
        setNearbyAddresses(results);
        setAddressSearchStatus("idle");

        if (results[0]) {
          setLatitude(results[0].latitude);
          setLongitude(results[0].longitude);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setAddressSearchStatus("error");
      }
    }, 1100);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [address, campus, selectedPlaceName]);

  function selectPlace(place: PlaceSuggestion) {
    setVenueName(place.name);
    setAddress(place.address);
    setLatitude(place.latitude);
    setLongitude(place.longitude);
    setSelectedPlaceName(place.name);
    setNearbyAddresses([]);
    setAddressSearchStatus("idle");
  }

  function updateAddress(value: string) {
    setAddress(value);
    setSelectedPlaceName("");
  }

  function handleDateTimeChange(event: DateTimePickerEvent, selectedDate?: Date) {
    if (Platform.OS !== "ios") setActivePicker(null);
    if (event.type === "dismissed" || !selectedDate) return;

    setStartsAt((current) => {
      const next = new Date(current);
      if (activePicker === "date") {
        next.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      } else {
        next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      }
      return next;
    });
  }

  async function choosePoster() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Gallery permission needed", "Allow photo access to choose an event poster.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.86
    });

    if (result.canceled) return;
    const asset = result.assets[0];
    setPoster({
      uri: asset.uri,
      mimeType: asset.mimeType,
      fileName: asset.fileName ?? undefined
    });
  }

  async function submit() {
    if (!myOrganizer) {
      Alert.alert("Verification required", "Only verified organizers can publish public events.");
      return;
    }

    if (!title.trim() || !description.trim() || !venueName.trim() || !address.trim()) {
      Alert.alert("Missing details", "Add a title, description, venue, and address.");
      return;
    }

    if (!poster) {
      Alert.alert("Add a poster", "Choose an event photo from your gallery before publishing.");
      return;
    }

    try {
      setPublishing(true);
      const imageUrl = await uploadEventPoster(poster);
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        category,
        startsAt: startsAt.toISOString(),
        venueName: venueName.trim(),
        address: address.trim(),
        imageUrl,
        latitude,
        longitude
      });
      Alert.alert("Event created", "Your event is live in the campus feed.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Could not publish", error instanceof Error ? error.message : "Try again in a moment.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <Screen>
      <PageHeader title="Create event" copy="Add the details students need before this goes live in the campus feed." />

      <TextField label="Event title" value={title} onChangeText={setTitle} autoCapitalize="words" placeholder="Open mic night" />
      <TextField
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.textArea}
        placeholder="What should students know before they RSVP?"
      />

      <Txt variant="h3" style={styles.section}>Category</Txt>
      <View style={styles.wrap}>
        {categories.map((item) => (
          <Chip key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />
        ))}
      </View>

      <Txt variant="h3" style={styles.section}>Date and time</Txt>
      <View style={styles.dateGrid}>
        <AppButton title={formatDate(startsAt)} icon={Calendar} variant="secondary" onPress={() => setActivePicker("date")} />
        <AppButton title={formatTime(startsAt)} icon={Clock} variant="secondary" onPress={() => setActivePicker("time")} />
      </View>
      {activePicker ? (
        <View style={styles.pickerPanel}>
          <DateTimePicker
            value={startsAt}
            mode={activePicker}
            display={Platform.OS === "ios" ? (activePicker === "date" ? "inline" : "spinner") : "default"}
            onChange={handleDateTimeChange}
            textColor={colors.text}
            accentColor={colors.accent}
            minimumDate={new Date()}
          />
        </View>
      ) : null}

      <Txt variant="h3" style={styles.section}>Location</Txt>
      <View style={styles.placeList}>
        {placeSuggestions.map((place) => (
          <Pressable
            key={place.name}
            onPress={() => selectPlace(place)}
            style={({ pressed }) => [
              styles.place,
              selectedPlaceName === place.name && styles.placeSelected,
              pressed && styles.placePressed
            ]}
          >
            <MapPin color={selectedPlaceName === place.name ? colors.accent : colors.faint} size={18} />
            <View style={{ flex: 1 }}>
              <Txt variant="bodyStrong" color={selectedPlaceName === place.name ? colors.text : colors.text}>
                {place.name}
              </Txt>
              <Txt variant="caption" color={colors.muted} style={styles.placeAddress}>
                {place.address}
              </Txt>
            </View>
          </Pressable>
        ))}
      </View>

      <TextField label="Venue name" value={venueName} onChangeText={setVenueName} autoCapitalize="words" placeholder="Campus Center" />
      <TextField
        label="Address or street"
        value={address}
        onChangeText={updateAddress}
        autoCapitalize="words"
        placeholder="Start typing an address near campus..."
      />

      {nearbyAddresses.length > 0 || addressSearchStatus !== "idle" ? (
        <View style={styles.addressResults}>
          {addressSearchStatus === "searching" ? (
            <Txt variant="caption" color={colors.muted} style={styles.resultHint}>
              Finding nearby addresses...
            </Txt>
          ) : null}
          {addressSearchStatus === "error" ? (
            <Txt variant="caption" color={colors.muted} style={styles.resultHint}>
              Address search is unavailable right now.
            </Txt>
          ) : null}
          {nearbyAddresses.map((place) => (
            <Pressable
              key={place.id ?? place.address}
              onPress={() => selectPlace(place)}
              style={({ pressed }) => [styles.addressResult, pressed && styles.placePressed]}
            >
              <MapPin color={colors.faint} size={16} />
              <View style={{ flex: 1 }}>
                <Txt variant="bodyStrong">{place.name}</Txt>
                <Txt variant="caption" color={colors.muted} style={styles.placeAddress}>
                  {place.address}
                </Txt>
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.mapShell}>
        <MapView
          style={styles.map}
          userInterfaceStyle="dark"
          region={{
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
          onPress={(event) => {
            setLatitude(event.nativeEvent.coordinate.latitude);
            setLongitude(event.nativeEvent.coordinate.longitude);
            setSelectedPlaceName("");
            setNearbyAddresses([]);
          }}
        >
          <Marker coordinate={{ latitude, longitude }} title={venueName || "Event location"} pinColor={colors.accent} />
        </MapView>
      </View>

      <Txt variant="h3" style={styles.section}>Poster</Txt>
      <Pressable onPress={choosePoster} style={({ pressed }) => [styles.posterPicker, pressed && styles.placePressed]}>
        <Image source={{ uri: selectedPosterUri }} style={styles.posterImage} />
        <View style={styles.posterOverlay}>
          <ImagePlus color={colors.text} size={20} />
          <Txt variant="label">{poster ? "Change photo" : "Choose from gallery"}</Txt>
        </View>
      </Pressable>

      <View style={styles.submitWrap}>
        <AppButton title="Publish event" onPress={submit} loading={publishing} />
      </View>
    </Screen>
  );
}

function getPlaceSuggestions(campus: Campus): PlaceSuggestion[] {
  if (campus.slug === "umass-amherst") {
    return [
      {
        name: "Campus Center",
        address: "1 Campus Center Way, Amherst, MA",
        latitude: 42.391,
        longitude: -72.5267
      },
      {
        name: "Student Union",
        address: "41 Campus Center Way, Amherst, MA",
        latitude: 42.3902,
        longitude: -72.5273
      },
      {
        name: "Recreation Center",
        address: "161 Commonwealth Ave, Amherst, MA",
        latitude: 42.3915,
        longitude: -72.5302
      },
      {
        name: "Worcester Commons",
        address: "669 N Pleasant St, Amherst, MA",
        latitude: 42.3931,
        longitude: -72.5282
      },
      {
        name: "Old Chapel",
        address: "144 Hicks Way, Amherst, MA",
        latitude: 42.3869,
        longitude: -72.5295
      },
      {
        name: "Downtown Amherst Common",
        address: "Boltwood Ave, Amherst, MA",
        latitude: 42.3759,
        longitude: -72.5199
      }
    ];
  }

  return [
    {
      name: `${campus.shortName} campus`,
      address: `${campus.city}, ${campus.state}`,
      latitude: campus.latitude,
      longitude: campus.longitude
    },
    {
      name: "Student center",
      address: `${campus.city}, ${campus.state}`,
      latitude: campus.latitude + 0.002,
      longitude: campus.longitude + 0.002
    },
    {
      name: "Main quad",
      address: `${campus.city}, ${campus.state}`,
      latitude: campus.latitude - 0.002,
      longitude: campus.longitude - 0.002
    }
  ];
}

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  type?: string;
  address?: {
    road?: string;
    house_number?: string;
    amenity?: string;
    building?: string;
  };
};

async function searchNearbyAddresses(query: string, campus: Campus, signal: AbortSignal): Promise<PlaceSuggestion[]> {
  const latitudeRange = 0.08;
  const longitudeRange = 0.1;
  const params = new URLSearchParams({
    q: `${query}, ${campus.city}, ${campus.state}`,
    format: "jsonv2",
    addressdetails: "1",
    limit: "6",
    countrycodes: "us",
    viewbox: [
      campus.longitude - longitudeRange,
      campus.latitude + latitudeRange,
      campus.longitude + longitudeRange,
      campus.latitude - latitudeRange
    ].join(","),
    bounded: "1"
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    signal,
    headers: {
      "Accept-Language": "en",
      "User-Agent": "Happnin/0.1 local campus event address search"
    }
  });

  if (!response.ok) throw new Error("Address search failed.");

  const rows = (await response.json()) as NominatimResult[];
  const seen = new Set<string>();

  return rows.reduce<PlaceSuggestion[]>((acc, row) => {
    const lat = Number(row.lat);
    const lon = Number(row.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || seen.has(row.display_name)) return acc;

    seen.add(row.display_name);
    acc.push({
      id: String(row.place_id),
      name: getAddressResultName(row),
      address: row.display_name,
      latitude: lat,
      longitude: lon
    });
    return acc;
  }, []);
}

function getAddressResultName(row: NominatimResult) {
  const houseNumber = row.address?.house_number;
  const road = row.address?.road;
  if (houseNumber && road) return `${houseNumber} ${road}`;
  return row.name ?? row.address?.amenity ?? row.address?.building ?? row.address?.road ?? row.type ?? "Address";
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

const styles = StyleSheet.create({
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
    paddingTop: spacing.md
  },
  section: {
    marginTop: spacing.md,
    marginBottom: spacing.sm
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  dateGrid: {
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  pickerPanel: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: "hidden",
    marginBottom: spacing.md
  },
  placeList: {
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  place: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.md
  },
  placeSelected: {
    backgroundColor: "rgba(37, 99, 235, 0.16)",
    borderColor: colors.accent
  },
  placePressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }]
  },
  placeAddress: {
    marginTop: spacing.xxs
  },
  addressResults: {
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.md
  },
  addressResult: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceStrong,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.md
  },
  resultHint: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md
  },
  mapShell: {
    height: 210,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: "hidden",
    marginBottom: spacing.md
  },
  map: {
    flex: 1
  },
  posterPicker: {
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface
  },
  posterImage: {
    width: "100%",
    aspectRatio: 4 / 5
  },
  posterOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: "rgba(5, 3, 10, 0.72)"
  },
  submitWrap: {
    marginTop: spacing.lg
  }
});
