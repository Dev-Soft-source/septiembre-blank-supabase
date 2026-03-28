
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

// Fallback simple inputs if shadcn inputs are not present
const SafeInput = (props: any) => {
  // @ts-ignore
  return Input ? <Input {...props} /> : <input {...props} className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-white/70 border border-white/20"/>;
};
const SafeSelect = ({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; }) => {
  // @ts-ignore
  if (Select) return (
    // @ts-ignore
    <Select value={value} onValueChange={onChange}>
      {/* Implement actual Select UI if needed; fallback below */}
    </Select>
  );
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded bg-white/10 text-white border border-white/20">
      <option value="">{placeholder || "All"}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
};

interface AdminEvent {
  id: string;
  user_id: string;
  event: string;
  created_at: string;
}

interface EnrichedEvent extends AdminEvent {
  email?: string | null;
  role?: string | null;
  delivery_status: "DELIVERED" | "ERROR" | "SKIPPED";
}

export default function FernandoNotificationLogs() {
  const [data, setData] = useState<EnrichedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  // Filters
  const [eventFilter, setEventFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    return data.filter((row) => {
      if (eventFilter && row.event !== eventFilter) return false;
      if (emailFilter && !(row.email || "").toLowerCase().includes(emailFilter.toLowerCase())) return false;
      return true;
    });
  }, [data, eventFilter, emailFilter]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Fetch distinct event types
        const { data: eventTypeRows } = await supabase
          .from("admin_notification_events")
          .select("event");
        const types = Array.from(new Set((eventTypeRows || []).map((r: any) => r.event))).filter((event): event is string => typeof event === 'string').sort();
        setEventTypes(types);

        // Build base query with optional date filters
        let query = supabase
          .from("admin_notification_events")
          .select("id, user_id, event, created_at")
          .order("created_at", { ascending: false })
          .limit(200);

        if (dateFrom) query = query.gte("created_at", dateFrom);
        if (dateTo) query = query.lte("created_at", dateTo + "T23:59:59");
        if (eventFilter) query = query.eq("event", eventFilter);

        const { data: rows, error } = await query;
        if (error) throw error;

        const events: AdminEvent[] = (rows || []) as any;
        if (events.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        const userIds = Array.from(new Set(events.map((e) => e.user_id).filter(Boolean)));

        // Parallel fetch: profiles (roles), failed notifications, and emails via edge function per user
        const [profilesRes, failedRes, emails] = await Promise.all([
          supabase.from("profiles").select("id, role").in("id", userIds),
          supabase.from("failed_notifications").select("user_id, notification_type, created_at").in("user_id", userIds),
          Promise.all(
            userIds.map(async (uid) => {
              try {
                const { data } = await supabase.functions.invoke("get-user-email", { body: { userId: uid } });
                return { user_id: uid, email: data?.email || null };
              } catch {
                return { user_id: uid, email: null };
              }
            })
          )
        ]);

        const roleMap = new Map<string, string | null>();
        (profilesRes.data || []).forEach((p: any) => roleMap.set(p.id, p.role));

        const emailMap = new Map<string, string | null>();
        emails.forEach((e) => emailMap.set(e.user_id, e.email));

        const failedByKey = new Map<string, string>(); // key: user_id|event -> latest status
        (failedRes.data || []).forEach((f: any) => {
          const key = `${f.user_id}|${f.notification_type}`;
          const prev = failedByKey.get(key);
          if (!prev || new Date(f.created_at) > new Date(prev)) {
            failedByKey.set(key, f.created_at);
          }
        });

        const enriched: EnrichedEvent[] = events.map((ev) => {
          const key = `${ev.user_id}|${ev.event}`;
          const failedAt = failedByKey.get(key);
          const status: EnrichedEvent["delivery_status"] = failedAt && new Date(failedAt) >= new Date(ev.created_at)
            ? "ERROR"
            : "DELIVERED";
          return {
            ...ev,
            email: emailMap.get(ev.user_id) || null,
            role: roleMap.get(ev.user_id) || null,
            delivery_status: status,
          };
        });

        setData(enriched);
      } catch (e) {
        console.error("Failed to fetch notification logs:", e);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [eventFilter, dateFrom, dateTo]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Notification Logs</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm mb-1 text-white/80">Event type</label>
          <SafeSelect
            value={eventFilter}
            onChange={setEventFilter}
            options={eventTypes}
            placeholder="All events"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-white/80">Email contains</label>
          <SafeInput
            placeholder="e.g. admin@domain.com"
            value={emailFilter}
            onChange={(e: any) => setEmailFilter(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-white/80">From</label>
          <SafeInput type="date" value={dateFrom} onChange={(e: any) => setDateFrom(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1 text-white/80">To</label>
          <SafeInput type="date" value={dateTo} onChange={(e: any) => setDateTo(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-white/90">No notifications have been recorded yet.</div>
      ) : (
        <div className="rounded-lg border border-white/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">ID</TableHead>
                <TableHead className="text-white">User ID</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Role</TableHead>
                <TableHead className="text-white">Event</TableHead>
                <TableHead className="text-white">Timestamp</TableHead>
                <TableHead className="text-white">Delivery status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-white/90">{row.id}</TableCell>
                  <TableCell className="text-white/90">{row.user_id}</TableCell>
                  <TableCell className="text-white/90">{row.email || "-"}</TableCell>
                  <TableCell className="text-white/90">{row.role || "-"}</TableCell>
                  <TableCell className="text-white/90">{row.event}</TableCell>
                  <TableCell className="text-white/90">{new Date(row.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-white/90">
                    <span className={
                      row.delivery_status === "DELIVERED" ? "text-emerald-300" : row.delivery_status === "ERROR" ? "text-red-300" : "text-yellow-300"
                    }>
                      {row.delivery_status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
