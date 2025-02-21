# Face Recognition Server (Node+Python) 🐶

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Python 3.x](https://www.python.org/downloads/)
- pip (Python package manager)

## Install Dependencies

### Node.js

```bash
npm install
```

### Python

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Run the Application

### Start Node.js Server

```bash
node server.js
```

Use any frontend client to send the images to the backend.

## Sending Images to `/recognize` using Postman

1. Open **Postman** and create a **POST** request to:

   ```txt
   http://localhost:3000/recognize
   ```

2. Go to the **Body** tab, select **form-data**.

3. Add multiple images:
   - Set the **key** as `images[]` (with square brackets `[]` to indicate multiple files).
   - Change the **type** to `File`.
   - Upload multiple image files.

4. Click **Send** and check the response.
