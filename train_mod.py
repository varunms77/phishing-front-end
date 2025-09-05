import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# 1. Load dataset
df = pd.read_csv("Phishing_Legitimate_full.csv")

# 2. Select only the 5 features + target column
features = ["NumDots", "UrlLength", "AtSymbol", "NoHttps", "IpAddress"]
target = "CLASS_LABEL"

X = df[features]
y = df[target]

# 3. Split into train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 4. Train a simple Random Forest
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 5. Evaluate (just to see accuracy)
acc = model.score(X_test, y_test)
print(f"✅ Model trained with accuracy: {acc:.2f}")

# 6. Save model
joblib.dump(model, "phishing_model.pkl")
print("🎉 Model saved as phishing_model.pkl")