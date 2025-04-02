const axios = require('axios');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const tenantId = process.env.TENANT_ID;
const clientSecret = process.env.CLIENT_SECRET;

async function getAccessToken() {
    const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const params = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default"
    });

    const response = await axios.post(url, params);
    return response.data.access_token;
}

async function listTeams() {
    const token = await getAccessToken();
    const response = await axios.get("https://graph.microsoft.com/v1.0/teams", {
        headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
}

async function listChannels(teamId) {
    const token = await getAccessToken();
    const response = await axios.get(`https://graph.microsoft.com/v1.0/teams/${teamId}/channels`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
}

(async () => {
    try {
        const teams = await listTeams();
        console.log("Teams:", teams);

        if (teams.value.length > 0) {
            const teamId = teams.value[0].id;
            const channels = await listChannels(teamId);
            console.log("Channels:", channels);
        }
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
})();
