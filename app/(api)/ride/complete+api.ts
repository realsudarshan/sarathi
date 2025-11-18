import { neon } from "@neondatabase/serverless";

export async function PUT(request: Request) {
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

      return Response.json({ data: response[0] }, { status: 200 });
    } catch (dbError) {
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

      return Response.json({ data: response[0] }, { status: 200 });
    }
  } catch (error) {
    console.error("Error completing ride:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
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
      // If columns don't exist, just return success without updating
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
