const axios = require("axios");

const API_URL = "http://localhost:8080";

async function testAPI() {
  console.log("🧪 Test de connectivité API...");
  console.log(`URL: ${API_URL}`);

  try {
    // Test 1: Health check
    console.log("\n1️⃣ Test Health Check...");
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log("✅ Health Check:", healthResponse.data);

    // Test 2: Auth endpoints
    console.log("\n2️⃣ Test Auth Endpoints...");
    try {
      const authResponse = await axios.get(`${API_URL}/auth/me`);
      console.log("❌ /auth/me sans token (attendu):", authResponse.status);
    } catch (error) {
      console.log(
        "✅ /auth/me sans token (attendu):",
        error.response?.status || "Erreur réseau"
      );
    }

    // Test 3: Posts endpoints
    console.log("\n3️⃣ Test Posts Endpoints...");
    try {
      const postsResponse = await axios.get(`${API_URL}/posts/`);
      console.log("✅ Posts:", postsResponse.data);
    } catch (error) {
      console.log("❌ Posts:", error.response?.status || "Erreur réseau");
    }

    // Test 4: Appointments endpoints
    console.log("\n4️⃣ Test Appointments Endpoints...");
    try {
      const appointmentsResponse = await axios.get(`${API_URL}/appointments/`);
      console.log("✅ Appointments:", appointmentsResponse.data);
    } catch (error) {
      console.log(
        "❌ Appointments:",
        error.response?.status || "Erreur réseau"
      );
    }

    console.log("\n🎉 Tests terminés !");
  } catch (error) {
    console.error("❌ Erreur générale:", error.message);
  }
}

testAPI();







