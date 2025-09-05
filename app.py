from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # ✅ Allow all origins

# Load trained model
model = joblib.load("phishing_model.pkl")

# ✅ List of all features your model was trained on
all_features = ["NumDots", "UrlLength", "AtSymbol", "NoHttps", "IpAddress"]

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Phishing Detector API is running"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        full_data = {feature: data.get(feature, 0) for feature in all_features}
        df = pd.DataFrame([full_data], columns=all_features)

        print("DEBUG input:", df.to_dict(orient="records"))  # 👈 check input going into model
        prediction = model.predict(df)[0]

        result = "phishing" if prediction == 1 else "legit"
        return jsonify({"success": True, "prediction": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)