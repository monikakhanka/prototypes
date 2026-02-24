import { getClient } from "./db.js";

export async function checkIn(seat, passenger) {
  const client = getClient();
  await client.connect();

  try {
    console.log(`\n${passenger} attempting to check in`);
    await client.query("BEGIN");

    // lock the row (pessimistic locking)
    const res = await client.query(
      "SELECT * FROM seats WHERE seat_no = $1 FOR UPDATE",
      [seat]
    );
    const seatRow = res.rows[0];

    if (seatRow.passenger) {
      console.log(
        `${passenger} -> Seat already been taken by ${seatRow.passenger}`
      );
      await client.query("ROLLBACK");
      return;
    }

    // simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // ACTUAL UPDATE
    await client.query("UPDATE seats SET passenger = $1 WHERE seat_no = $2", [
      passenger,
      seat,
    ]);

    await client.query("COMMIT");
  } catch (e) {
    console.error("Transaction error", err);
    await client.query("ROLLBACK");
  } finally {
    await client.end();
  }
}
