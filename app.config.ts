const API_URL = false ? "http://localhost:3030" : "https://api.affects.ai"
module.exports = ({ config }) => {
    return {
        "expo": {
            "extra": {
                "affectsai": {
                    "restAPI": API_URL,
                }
            }
        },
        ...config,
    };
};
