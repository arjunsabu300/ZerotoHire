// backend/ping.js
import cron from "node-cron";
import axios from "axios";

const URL_TO_PING = "https://zerotohire.onrender.com/api/health"; // replace this

console.log("🔄 Ping service started...");

// Run every 3 minutes
cron.schedule("*/3 * * * *", async () => {
  try {
    console.log("🌐 Pinging server...");

    const res = await axios.get(URL_TO_PING);
    console.log("✅ Server responded:", res.status);

  } catch (err) {
    console.log("❌ Ping failed:", err.message);
  }
});
