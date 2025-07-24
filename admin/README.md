# Admin Application Setup and Usage

## Overview
This admin application allows you to manage the projects displayed in the portfolio. It provides a simple interface to add, edit, and delete projects, with image preview and selection capabilities.

## Setup and Running

### Option 1: Run Both Servers Separately

1. **Install dependencies** (if not already done):
   ```bash
   cd admin
   npm install
   ```

2. **Start the API server** (Terminal 1):
   ```bash
   cd admin
   npm run api
   # or: node server.js
   ```
   This will start the API server on `http://localhost:3001`

3. **Start the Admin Interface** (Terminal 2):
   ```bash
   cd admin
   npm run admin
   # or: node admin-server.js
   ```
   This will start the admin interface on `http://localhost:8000`

4. **Open the admin interface**:
   Navigate to `http://localhost:8000` in your browser

### Option 2: Development Mode (if concurrently is installed)
```bash
cd admin
npm install concurrently --save-dev  # Install concurrently first
npm run dev  # This will start both servers simultaneously
```

### Server Ports
- **API Server**: `http://localhost:3001` - Handles CRUD operations and serves images
- **Admin Interface**: `http://localhost:8000` - Serves the web interface

### Image Serving
The admin interface includes proxy middleware to handle image requests:
- `http://localhost:8000/assets/*` → `http://localhost:3001/public/assets/*`
- `http://localhost:8000/public/*` → `http://localhost:3001/public/*`

This ensures images are properly served even when accessing the admin interface on port 8000.

## Image Management

### Image Storage
- All images are stored in `/public/assets/img/`
- Images are referenced in the projects.json as `assets/img/filename.png`
- The admin server serves these images via the `/public/` route

### Using Images in the Admin
1. **Browse Available Images**: Click the "Browse Images" button to see all available images
2. **Select an Image**: Click on any image thumbnail to select it
3. **Manual Entry**: You can also type the image path manually (e.g., `assets/img/myimage.png`)
4. **Preview**: The selected image will show a preview below the input field

### Adding New Images
To add new images to the portfolio:
1. Copy your image files to `/public/assets/img/`
2. Refresh the admin interface to see them in the image browser
3. The images will automatically be available for selection

## API Endpoints

The admin server provides these endpoints:
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Add a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `GET /api/images` - Get list of available images
- `GET /public/*` - Serve static files from the public directory

## Project Structure

```
admin/
├── AdminApp.jsx      # Main React component
├── index.html        # Admin interface HTML
├── server.js         # Express server
└── package.json      # Dependencies
```

## Features

- ✅ Add, edit, and delete projects
- ✅ Image preview and selection with visual browser
- ✅ Browse available images in organized grid
- ✅ **Multi-line description editor** with textarea
- ✅ **URL validation with popup modal**
- ✅ **Real-time URL accessibility checking**
- ✅ **Visit site directly from admin interface**
- ✅ Form validation with proper field types
- ✅ Responsive table layout with improved styling
- ✅ Error handling for missing images
- ✅ Truncated descriptions in table view
- ✅ Colored status indicators and buttons

## Form Fields

### Project Image
- Visual image browser with thumbnails
- Preview of selected image
- Fallback handling for missing images

### Project Name (p)
- Short, concise project title
- Required field with validation

### Description (d) 
- **Multi-line textarea** for detailed project descriptions
- Resizable editor for comfortable editing
- Truncated display in table (100 characters)
- Optional field

### Project URL (h)
- **URL validation with modal popup**
- Format validation (must be valid URL)
- **Accessibility testing** - checks if URL responds
- **Direct site visit** button in modal
- **Recheck functionality** for testing URLs
- Status indicators (green=accessible, red=error, blue=checking)

## URL Validation Features

The admin now includes sophisticated URL validation:

1. **Format Validation**: Ensures URLs are properly formatted
2. **Accessibility Testing**: Attempts to verify the URL is reachable
3. **Visual Feedback**: Color-coded status messages
4. **Quick Actions**: 
   - Recheck URL status
   - Visit site in new tab
   - Close validation modal
5. **Integration**: Available both in form and table views

## Troubleshooting

### Images Not Displaying
- Ensure the admin server is running (`npm start` in the admin folder)
- Check that images exist in `/public/assets/img/`
- Verify the image path format: `assets/img/filename.png`

### Server Connection Issues
- Make sure the server is running on port 3001
- Check that the API endpoint URLs in AdminApp.jsx match your server setup
