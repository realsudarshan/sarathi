import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      origin_address,
      destination_address,
      origin_latitude,
      origin_longitude,
      destination_latitude,
      destination_longitude,
      ride_time,
      fare_price,
      payment_status,
      driver_id,
      user_id,
    } = body;

    if (
      !origin_address ||
      !destination_address ||
      !origin_latitude ||
      !origin_longitude ||
      !destination_latitude ||
      !destination_longitude ||
      !ride_time ||
      !fare_price ||
      !payment_status ||
      !driver_id ||
      !user_id
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    const userResult = await sql`
      SELECT id 
      FROM users 
      WHERE clerk_id = ${user_id}
      LIMIT 1;
    `;

    if (userResult.length === 0) {
      return Response.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    const actualUserId = userResult[0].id;

    const response = await sql`
      INSERT INTO rides ( 
          origin_address, 
          destination_address, 
          origin_latitude, 
          origin_longitude, 
          destination_latitude, 
          destination_longitude, 
          ride_time, 
          fare_price, 
          payment_status, 
          driver_id, 
          user_id
      ) VALUES (
          ${origin_address},
          ${destination_address},
          ${origin_latitude},
          ${origin_longitude},
          ${destination_latitude},
          ${destination_longitude},
          ${ride_time},
          ${fare_price},
          ${payment_status},
          ${driver_id},
          ${actualUserId}
      )
      RETURNING *;
    `;

    return Response.json({ data: response[0] }, { status: 201 });
  } catch (error) {
    console.error("Error inserting data into rides:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}