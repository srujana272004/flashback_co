# 📸 Flashback Photobooth: A Vintage Digital Experience

## Table of Contents

* [About the Project](#about-the-project)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Setup and Installation](#setup-and-installation)
* [Usage](#usage)
* [Project Structure](#project-structure)
* [Customization](#customization)
* [Contributing](#contributing)

---

## About the Project

Flashback Photobooth is a web-based application that brings the charm of old-school photo booths to your browser. Users can step in front of their webcam, choose from various vintage-inspired templates (like classic strips or Polaroids), capture a series of photos, apply nostalgic filters, and then download their unique digital memento. The project focuses on delivering a delightful user experience with a strong vintage aesthetic, complete with subtle animations, sound effects, and classic design elements.

---

## Features

* **Vintage Aesthetic:** Designed with a warm, amber-toned color palette, custom fonts (serif and typewriter-style), and subtle textured backgrounds to evoke a retro feel.
* **Camera Integration:** Seamlessly access and display live camera feed from the user's device.
* **Template Selection:** Choose from multiple photo layouts (e.g., photo strips, grid, Polaroid) for your final output.
* **Guided Photo Capture:** An interactive countdown and visual cues guide the user through the photo-taking process.
* **Developing Effect:** A simulated "developing" animation adds to the vintage charm after photos are captured.
* **Filter Application:** Apply a range of vintage-inspired filters (sepia, black & white, warm, cool, etc.) to the composite image.
* **Composite Image Generation:** Photos are automatically compiled into a single, beautifully arranged template.
* **Download Functionality:** Easily download the final filtered photo strip/image.
* **Sound Effects:** Immersive audio cues for shutter clicks, film advance, and other interactions.
* **Responsive Design:** Optimized for a smooth experience across various devices (desktop, tablet, mobile).

---

## Technologies Used

* **React:** Frontend library for building the user interface.
* **TypeScript:** For type-safe JavaScript development.
* **Tailwind CSS:** A utility-first CSS framework for rapid and consistent styling.
* **Lucide React:** A collection of beautiful, handcrafted SVG icons.
* **Tone.js:** A web audio framework for creating interactive sound effects.

---

## Setup and Installation

To get the project up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd flashback-photobooth
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # OR
    yarn install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    # OR
    yarn start
    ```
    This will open the application in your browser, usually at `http://localhost:3000`.

---

## Usage

1.  **Grant Camera Access:** Upon opening the application, your browser will ask for permission to access your camera. Please grant it to proceed.
2.  **Start Session:** Click the "Start Photobooth" button on the landing page.
3.  **Select Template:** Choose your desired photo layout from the available options.
4.  **Capture Photos:** Position yourself in front of the camera. A countdown will begin for each photo shot.
5.  **Developing & Filtering:** After all photos are captured, a "developing" animation will play. Then, you'll be presented with filter options. Select one to apply it to your composite image.
6.  **Download & Share:** Once you're satisfied, download your final vintage photo strip! You can also choose to retake photos or start a new session.

---

## Project Structure

The core components and utilities of the project are organized as follows:

````
src/
├── components/
│   ├── CameraFeed.tsx           // Manages live camera stream display
│   ├── CountdownTimer.tsx       // Handles the photo capture countdown
│   ├── DevelopingEffect.tsx     // Simulates photo development animation
│   ├── FilterSelector.tsx       // Allows users to choose and apply filters
│   ├── LandingPage.tsx          // The initial welcome screen
│   ├── TemplateSelector.tsx     // Enables selection of photo strip layouts
│   └── VintageStickers.tsx      // Decorative elements for the vintage aesthetic
├── utils/
│   ├── audioUtils.ts            // Manages sound effects using Tone.js
│   ├── cameraUtils.ts           // Utility functions for camera access and control
│   ├── canvasUtils.ts           // Functions for image manipulation (compositing, filtering, downloading)
│   └── templates.ts             // Defines the various photo templates and their slot configurations
├── types.ts                     // TypeScript type definitions for the application's data structures
├── PhotoBooth.tsx               // The main application component, orchestrating stages and state
├── App.tsx                      // Entry point for the React application
└── index.css                    // Tailwind CSS imports and custom styles
````
---

## Customization

* **Templates:** Modify `src/utils/templates.ts` to add new photo layouts, adjust dimensions, or change slot positions.
* **Filters:** Expand `src/utils/canvasUtils.ts` in the `applyCanvasFilter` function to create new image filters. For more complex filters (like light leaks or film burns), you might need to layer additional drawing operations.
* **Styling:** Adjust `tailwind.config.js` or `src/index.css` to change the vintage color palette, fonts, or other visual aspects. Custom utility classes can be added in `index.css`.
* **Sounds:** Update `src/utils/audioUtils.ts` to add or modify sound effects.
* **Stickers:** Modify `src/components/VintageStickers.tsx` to add, remove, or change the decorative icons.

---

## Contributing

Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.
