import { supabase } from "../supabase";

export const useSession = () => {
  const checkIn = async (rollNo: string, zone: string = "quiet") => {
    try {
      // Step 1 — Check if student exists, if not create them
      const { data: existingStudent } = await supabase
        .from("students")
        .select("roll_no")
        .eq("roll_no", rollNo)
        .single();

      if (!existingStudent) {
        await supabase
          .from("students")
          .insert({ roll_no: rollNo, name: rollNo });
      }

      // Step 2 — Check if student already has active session
      const { data: activeSession } = await supabase
        .from("sessions")
        .select("*, seats(*)")
        .eq("roll_no", rollNo)
        .eq("status", "active")
        .single();

      if (activeSession) {
        return {
          success: true,
          seatNumber: activeSession.seat_id,
          zone: activeSession.seats.zone,
          alreadyCheckedIn: true,
        };
      }

      // Step 3 — Find available seat in selected zone
      let { data: availableSeat } = await supabase
        .from("seats")
        .select("*")
        .eq("status", "free")
        .eq("is_buffer", false)
        .eq("zone", zone)
        .limit(1)
        .single();

      // Step 4 — No seats available in selected zone
      if (!availableSeat) {
        return { success: false, error: "No seats available in zone" };
      }

      // Step 5 — Mark seat as occupied
      await supabase
        .from("seats")
        .update({ status: "occupied", updated_at: new Date().toISOString() })
        .eq("seat_id", availableSeat.seat_id);

      // Step 6 — Create session record
      await supabase.from("sessions").insert({
        roll_no: rollNo,
        seat_id: availableSeat.seat_id,
        check_in: new Date().toISOString(),
        status: "active",
      });

      // Step 7 — Return success
      return {
        success: true,
        seatNumber: availableSeat.seat_id,
        zone: availableSeat.zone,
      };
    } catch (error: any) {
      return { success: false, error: error.message || "Something went wrong" };
    }
  };

  const checkOut = async (rollNo: string) => {
    try {
      // Find active session
      const { data: session } = await supabase
        .from("sessions")
        .select("*")
        .eq("roll_no", rollNo)
        .eq("status", "active")
        .single();

      if (!session) {
        return { success: false, error: "No active session found" };
      }

      // Update session to closed
      await supabase
        .from("sessions")
        .update({
          status: "closed",
          check_out: new Date().toISOString(),
        })
        .eq("session_id", session.session_id);

      // Free the seat
      await supabase
        .from("seats")
        .update({ status: "free", updated_at: new Date().toISOString() })
        .eq("seat_id", session.seat_id);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Something went wrong" };
    }
  };

  return { checkIn, checkOut };
};
