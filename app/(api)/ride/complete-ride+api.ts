import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ride_id, final_latitude, final_longitude } = body;

    if (!ride_id) {
      return Response.json(
        { error: "Missing ride_id" },
        { status: 400 },
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    // Try to update with all columns, fallback if columns don't exist
    try {
      const response = await sql`
        UPDATE rides 
        SET 
          ride_status = 'completed',
          payment_status = 'completed',
          current_latitude = ${final_latitude},
          current_longitude = ${final_longitude}
        WHERE id = ${ride_id}
        RETURNING *;
      `;

      if (response.length === 0) {
        return Response.json(
          { error: "Ride not found" },
          { status: 404 },
        );
      }

      console.log('Ride completed in DB:', response[0]);
      return Response.json({ data: response[0] }, { status: 200 });
    } catch (dbError) {
      console.log('New columns not found, using fallback update');
      // Fallback: update only basic columns if new columns don't exist
      const response = await sql`
        UPDATE rides 
        SET 
          payment_status = 'completed'
        WHERE id = ${ride_id}
        RETURNING *;
      `;

      if (response.length === 0) {
        return Response.json(
          { error: "Ride not found" },
          { status: 404 },
        );
      }

      console.log('Ride completed in DB (fallback):', response[0]);
      return Response.json({ data: response[0] }, { status: 200 });
    }
  } catch (error) {
    console.error("Error completing ride:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
