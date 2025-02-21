#!/usr/bin/env python3
import sys
import face_recognition
import json
import numpy as np
import os

# Dictionary of known faces with names and image paths
known_faces = {
    "Elmer the Rebel": "known_faces/elmer.jpg",
    "Bart the Program Manager": "known_faces/bart.png",
    "Victor the Program Manager": "known_faces/victor.png",
    "Risa Yamamoto": "known_faces/risa.png",
    "Haruka Kakiuchi": "known_faces/haruka.png"
}

# Load known face encodings
known_encodings = {}
for name, img_path in known_faces.items():
    if os.path.exists(img_path):
        img = face_recognition.load_image_file(img_path)
        encodings = face_recognition.face_encodings(img)
        if encodings:
            known_encodings[name] = encodings[0]
        else:
            print(f"Warning: No face found in {img_path}. Skipping.")

def recognize_faces(image_paths, tolerance=0.5):
    results = []

    for img_path in image_paths:
        if not os.path.exists(img_path):
            results.append({"image": img_path, "error": "File not found"})
            continue

        img = face_recognition.load_image_file(img_path)
        face_encodings = face_recognition.face_encodings(img)
        face_locations = face_recognition.face_locations(img)  # Get face coordinates

        if not face_encodings:
            results.append({"image": img_path, "name": "No face detected", "coordinates": None})
            continue

        image_results = []

        for face_encoding, location in zip(face_encodings, face_locations):
            top, right, bottom, left = location
            x, y, width, height = left, top, right - left, bottom - top  # Convert to (x, y, width, height)

            distances = face_recognition.face_distance(list(known_encodings.values()), face_encoding)
            best_match_index = np.argmin(distances) if len(distances) > 0 else None
            name = "Unknown"

            if best_match_index is not None and distances[best_match_index] < tolerance:
                name = list(known_encodings.keys())[best_match_index]

            image_results.append({
                "name": name,
                "coordinates": {"x": x, "y": y, "width": width, "height": height}
            })

        results.append({"image": img_path, "faces": image_results})

    return json.dumps(results, indent=4)

if __name__ == "__main__":
    image_paths = sys.argv[1:]
    print(recognize_faces(image_paths))