import { CalendarHeart } from "lucide-react-native";

import { EventCard } from "../components/EventCard";
import { EmptyState, PageHeader } from "../components/PageElements";
import { Screen } from "../components/Screen";
import { useApp } from "../context/AppContext";
import { colors } from "../theme";

export function SavedScreen() {
  const { events, rsvps } = useApp();
  const savedEvents = events.filter((event) => rsvps.some((rsvp) => rsvp.eventId === event.id));

  return (
    <Screen>
      <PageHeader
        title="Your plans"
        copy={savedEvents.length > 0 ? `${savedEvents.length} event${savedEvents.length === 1 ? "" : "s"} on your list.` : "Events you RSVP to live here."}
      />
      {savedEvents.length === 0 ? (
        <EmptyState
          title="No plans yet"
          copy="RSVP to an event and it'll show up here with a reminder."
          icon={<CalendarHeart color={colors.accentText} size={22} />}
        />
      ) : (
        savedEvents.map((event) => <EventCard key={event.id} event={event} isRsvpd />)
      )}
    </Screen>
  );
}
