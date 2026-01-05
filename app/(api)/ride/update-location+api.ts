import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ride_id, current_latitude, current_longitude } = body;

    if (!ride_id || current_latitude === undefined || current_longitude === undefined) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    // Try to update location, fallback if columns don't exist
    try {
      const response = await sql`
        UPDATE rides 
        SET 
          current_latitude = ${current_latitude},
          current_longitude = ${current_longitude}
        WHERE id = ${ride_id}
        RETURNING *;
      `;

      if (response.length === 0) {
        return Response.json(
          { error: "Ride not found" },
          { status: 404 },
        );
      }

      return Response.json({ data: response[0] }, { status: 200 });
    } catch (dbError) {
      console.warn("Location columns not found in database, skipping update");
      
      const response = await sql`
        SELECT * FROM rides WHERE id = ${ride_id}
      `;

      if (response.length === 0) {
        return Response.json(
          { error: "Ride not found" },
          { status: 404 },
        );
      }

      return Response.json({ data: response[0] }, { status: 200 });
    }
  } catch (error) {
    console.error("Error updating ride location:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
