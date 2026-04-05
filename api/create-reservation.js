import { supabaseAdmin } from "./supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({});
  }
  try {
    const {
      customer_name,
      phone,
      table_id,
      guests,
      reservation_time
    } = req.body;
    const { data, error } =
      await supabaseAdmin
        .from("reservations")
        .insert([
          {
            customer_name,
            phone,
            table_id,
            guests,
            reservation_time
          }
        ]);
    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
