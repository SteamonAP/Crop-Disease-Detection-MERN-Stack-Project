from flask import Flask, request, jsonify
import tensorflow as tf
from PIL import Image
import numpy as np

app = Flask(__name__)

# Load Model
model = tf.keras.models.load_model("model.h5")

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['image']
    image = Image.open(file).resize((224, 224))
    img_array = np.array(image) / 255.0
    img_array = img_array.reshape(1, 224, 224, 3)

    prediction = model.predict(img_array)
    return jsonify({"prediction": prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
