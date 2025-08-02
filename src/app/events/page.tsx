"use client"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState, useCallback } from "react"
import { toast } from "react-fox-toast";
import { useUser } from "@clerk/nextjs";

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  tier: string;
}

const tierRank = {
    free: 1,
    silver: 2,
    gold: 3,
    platinum: 4,
} as const;

const EventsPage = () => {
    const supabase = createClient();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, isLoaded } = useUser()
    const userTier = user?.publicMetadata?.tier as keyof typeof tierRank;
    const userTierRank = tierRank[userTier ?? 'free'];

    const allowedTiers = Object.entries(tierRank)
    .filter(([, rank]) => rank <= userTierRank)
    .map(([tier]) => tier);
 
    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('events')
                .select('*')
                .in('tier', allowedTiers);

            if (error) {
                setError(error.message);
                toast.error(`Error: ${error.message}`);
            } else {
                setEvents(data || []);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            toast.error('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    }, [allowedTiers, supabase]);

    const addTestData = async () => {
        try {
            const testEvents = [
                { title: "Test Event 1", tier: "free", description: "A test event for free users", event_date: "2024-01-15" },
                { title: "Test Event 2", tier: "silver", description: "A test event for silver users", event_date: "2024-01-20" },
                { title: "Test Event 3", tier: "gold", description: "A test event for gold users", event_date: "2024-01-25" },
                { title: "Premium Event", tier: "platinum", description: "A premium event for platinum users", event_date: "2024-01-30" }
            ];

            const { error } = await supabase
                .from("events")
                .insert(testEvents)
                .select();

            if (error) {
                toast.error(`Insert Error: ${error.message}`);
            } else {
                toast.success("Test data added successfully!");
                fetchEvents(); // Refresh the list
            }
        } catch {
            toast.error("Failed to add test data");
        }
    };

    // Fetch events immediately when user data is loaded
    useEffect(() => {
        if (isLoaded) {
            fetchEvents();
            
            // Show upgrade message for non-platinum users
            if (user && userTier !== 'platinum') {
                toast.info(`Upgrade to Platinum to access all events`, {
                    position: 'bottom-center',
                    duration: 5000,
                });
            }
        }
    }, [isLoaded, userTier, fetchEvents, user]);

    // Show loading state while user data is being loaded
    if (!isLoaded) {
        return <div className="p-6">Loading user data...</div>;
    }

    if (loading) {
        return <div className="p-6">Loading events...</div>;
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-red-600 mb-4">Error: {error}</div>
                <button
                    onClick={fetchEvents}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 relative w-full h-full">
            <h1 className="text-2xl font-bold mb-4 text-center text-sky-500">Events</h1>

            {events.length === 0 && (
                <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
                    <p className="text-yellow-800 mb-2">No events found in the database.</p>
                    <button
                        onClick={addTestData}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add Test Data
                    </button>
                </div>
            )}

            {events.length > 0 && (
                <div className="flex gap-2 items-start px-14 py-3 flex-wrap justify-start">
                    {events.map(event => (
                        <div key={event.id} className="p-3 relative border rounded w-[24vmax] border-sky-200 bg-gray-800 flex flex-col gap-1 items-start justify-start">
                            <p className="text-base absolute top-3 right-2 font-semibold rounded-full bg-fuchsia-500 px-3 w-fit">{event.tier}</p>
                            <p className="text-lg text-left text-gray-200"><span className="font-bold text-sky-500">Title:</span> {event.title}</p>
                            <p className="text-lg text-left"><span className="font-bold text-sky-500">Date:</span> {event.event_date}</p>
                            <p className="text-lg text-left line-clamp-2"><span className="font-bold text-sky-500">Description:</span> {event.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default EventsPage