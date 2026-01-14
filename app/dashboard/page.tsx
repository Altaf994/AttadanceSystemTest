"use client";
import { useState, useEffect } from "react";
import moment from 'moment-timezone'
import Link from "next/link";
import dynamic from "next/dynamic";
import Select from "react-select";
import { toast } from "react-toastify";

const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner),
  { ssr: false }
);

export default function DashboardPage() {
  const [result, setResult] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [occasions, setOccasions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [checkinMessage, setCheckinMessage] = useState<string | null>(null);
  const [checkinError, setCheckinError] = useState<string | null>(null);

  useEffect(() => {
    if (result) {
      console.log("QR scan result:", result);
    }
  }, [result]);

  function getLoggedInUser():
    | {
        id: string;
        service?: string | null;
        serviceUnit?: string | null;
        name?: string | null;
      }
    | null {
    try {
      if (typeof window === "undefined") return null;
      const raw = window.localStorage.getItem("vas_user");
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (typeof parsed?.id !== "string" || parsed.id.length === 0) return null;
      return {
        id: parsed.id,
        service:
          typeof parsed.service === "string" ? parsed.service : (parsed.service as null | undefined),
        serviceUnit:
          typeof parsed.serviceUnit === "string"
            ? parsed.serviceUnit
            : (parsed.serviceUnit as null | undefined),
        name: typeof parsed.name === "string" ? parsed.name : (parsed.name as null | undefined),
      };
    } catch {
      return null;
    }
  }

  function parseQrPayload(raw: string): {
    volunteerId: string;
    volunteerName: string;
    cnic?: string;
  } | null {
    const text = String(raw ?? "").trim();
    if (!text) return null;
    const parts = text.split("|").map((p) => p.trim()).filter(Boolean);
    // Expected: volunteerId|volunteerName|cnic
    const volunteerId = parts[0] ?? "";
    const volunteerName = parts[1] ?? "";
    const cnic = parts[2];
    if (!volunteerId || !volunteerName) return null;
    return { volunteerId, volunteerName, cnic };
  }

  async function submitCheckin(rawScanValue: string) {
    setCheckinError(null);
    setCheckinMessage(null);

    if (!selectedOccasion) {
      setCheckinError("Please select an occasion first.");
      return;
    }

    const user = getLoggedInUser();
    if (!user) {
      setCheckinError("You are not logged in. Please login first.");
      return;
    }

    const parsed = parseQrPayload(rawScanValue);
    if (!parsed) {
      setCheckinError("Invalid QR format. Expected: id|name|cnic");
      return;
    }

    const formatPkTime = (iso: string) => {
      try {
        return moment.tz(iso, 'Asia/Karachi').format('YYYY-MM-DD hh:mm A')
      } catch {
        return ''
      }
    };

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          volunteerId: parsed.volunteerId,
          volunteerName: parsed.volunteerName,
          event: selectedOccasion,
          takenByUserId: user.id,
          service: user.service ?? undefined,
          serviceUnit: user.serviceUnit ?? undefined,
          actionAt: new Date().toISOString(),
          actionAtClient: moment.tz(new Date(), 'Asia/Karachi').format('YYYY-MM-DD hh:mm A'),
        }),
      });

      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || "Check-in request failed");
      }

      setCheckinMessage(
        payload?.action === "checked_out" ? "Checked out." : "Checked in."
      );

      const action = payload?.action === "checked_out" ? "Checked out" : "Checked in";
      const ts =
        payload?.action === "checked_out"
          ? payload?.checkIn?.checkoutAt
          : payload?.checkIn?.checkinAt;
      const formatted = typeof ts === "string" ? formatPkTime(ts) : "";

      toast.success(
        formatted
          ? `Attendance marked successfully (${action} at ${formatted})`
          : "Attendance marked successfully"
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setCheckinError(message);
    }
  }

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setOccasions(data))
      .catch((err) => console.error("Error fetching occasions:", err));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f4f8",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "800px",
          maxWidth: "95%",
          padding: 32,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              color: "#2c3e50",
              fontWeight: "600",
            }}
          >
            Dashboard
          </h1>
          <p
            style={{ margin: "8px 0 16px", color: "#7f8c8d", fontSize: "1rem" }}
          >
            Volunteer Attendance System
          </p>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#34495e",
                fontWeight: "500",
              }}
            >
              Select Occasion
            </label>
            <Select
              instanceId="3"
              isSearchable={true}
              options={occasions.map((occasion) => ({
                value: occasion,
                label: occasion,
              }))}
              value={
                selectedOccasion
                  ? { value: selectedOccasion, label: selectedOccasion }
                  : null
              }
              inputValue={inputValue}
              onInputChange={(newValue, actionMeta) => {
                if (actionMeta.action === "input-change") {
                  setInputValue(newValue);
                }
                return newValue;
              }}
              onChange={(option) => {
                setSelectedOccasion(option?.value || "");
                setInputValue("");
              }}
              placeholder="Choose an occasion"
              openMenuOnClick
              openMenuOnFocus
              closeMenuOnSelect
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 48,
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#000",
                }),
                input: (base) => ({
                  ...base,
                  color: "#000",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#6b7280",
                }),
                option: (base, state) => ({
                  ...base,
                  color: "#000",
                  backgroundColor: state.isFocused
                    ? "#e5f0ff"
                    : state.isSelected
                      ? "#cfe3ff"
                      : "#fff",
                }),
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "1",
              minWidth: "200px",
              padding: 20,
              background: "#ecf0f1",
              borderRadius: 8,
              textAlign: "center",
              border: "1px solid #bdc3c7",
            }}
          >
            <h3 style={{ margin: "0 0 16px", color: "#34495e" }}>
              Scan QR Code
            </h3>
            <button
              onClick={() => {
                setCheckinError(null);
                setCheckinMessage(null);
                setShowScanner(true);
              }}
              disabled={!selectedOccasion}
              style={{
                padding: "10px 20px",
                borderRadius: 6,
                background: "#3498db",
                color: "#fff",
                border: "none",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(52,152,219,0.3)",
                opacity: selectedOccasion ? 1 : 0.6,
              }}
            >
              Scan QR
            </button>
          </div>

          <div
            style={{
              flex: "1",
              minWidth: "200px",
              padding: 20,
              background: "#ecf0f1",
              borderRadius: 8,
              textAlign: "center",
              border: "1px solid #bdc3c7",
            }}
          >
            <h3 style={{ margin: "0 0 16px", color: "#34495e" }}>
              Manual Check-in
            </h3>
            <Link
              href={
                selectedOccasion
                  ? `/checkin?event=${encodeURIComponent(selectedOccasion)}`
                  : "/checkin"
              }
            >
              <button
                disabled={!selectedOccasion}
                style={{
                  padding: "10px 20px",
                  borderRadius: 6,
                  background: "#27ae60",
                  color: "#fff",
                  border: "none",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(39,174,96,0.3)",
                  opacity: selectedOccasion ? 1 : 0.6,
                }}
              >
                Manual Scan
              </button>
            </Link>
          </div>
        </div>

        {showScanner && (
          <div
            style={{
              marginTop: 24,
              padding: 16,
              background: "#ecf0f1",
              borderRadius: 8,
              border: "1px solid #bdc3c7",
            }}
          >
            <h4
              style={{
                margin: "0 0 12px",
                textAlign: "center",
                color: "#34495e",
              }}
            >
              QR Scanner
            </h4>
            <Scanner
              onScan={(detected: unknown) => {
                if (!Array.isArray(detected) || detected.length === 0) return;

                detected.forEach((item) => {
                  const rawValue =
                    typeof (item as Record<string, unknown>)?.rawValue ===
                    "string"
                      ? ((item as Record<string, unknown>).rawValue as string)
                      : "";
                  console.log("Scanner detected:", rawValue);
                });

                const first = detected[0] as Record<string, unknown>;
                const val =
                  typeof first?.rawValue === "string" ? first.rawValue : "";
                setResult(val);
                setShowScanner(false);

                if (val) {
                  // Fire the single check-in API call.
                  void submitCheckin(val);
                }
              }}
              onError={(err) => setResult(String(err))}
              components={{ onOff: true, torch: true, finder: true }}
              styles={{
                container: { width: "100%", maxWidth: 400, margin: "0 auto" },
              }}
              allowMultiple={true}
              scanDelay={300}
              formats={["qr_code"]}
            />
          </div>
        )}

        {checkinError && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: "#fdecea",
              borderRadius: 6,
              textAlign: "center",
              border: "1px solid #f5c2c7",
              color: "#b02a37",
            }}
          >
            {checkinError}
          </div>
        )}

        {checkinMessage && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: "#eaf7ee",
              borderRadius: 6,
              textAlign: "center",
              border: "1px solid #b7dfc1",
              color: "#146c43",
            }}
          >
            {checkinMessage}
          </div>
        )}

      
      </div>
    </div>
  );
}
