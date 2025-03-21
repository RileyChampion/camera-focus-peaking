# Focus Peaking Web App

## Technologies Used
- Vite
- React
- TypeScript
- TailwindCSS
- Shadcn UI

## Overview
This application implements a real-time focus peaking effect for both uploaded videos and webcam footage directly in the browser. Focus peaking is a technique commonly used in photography and videography to highlight in-focus areas, making it easier to ensure proper focus before capturing an image.

## Approach
My implementation is based on research from various focus peaking algorithms and techniques, including Paul Bourke's work on [Focus Peaking](https://paulbourke.net/miscellaneous/focuspeaking/).

The application is designed to process images entirely client-side using React, eliminating the need for a backend server. I utilized HTML5 Canvas elements to create and overlay the focus peaking effect on both video and webcam feeds. The architecture follows these principles:

- **Component Separation**: I separated the `VideoFeed` component from the `FocusPeaking` component to maintain a clear separation of concerns.
- **User Controls**: A `VideoMenu` component provides users with options to:
 - Toggle the overlay on/off
 - Adjust the threshold sensitivity
 - Change the highlight color
 - Switch between uploaded video and webcam input

### Technical Implementation
For the focus peaking algorithm, I implemented a simplified Sobel filter for edge detection that:
1. Analyzes the luminance of neighboring pixels
2. Applies a gradient magnitude calculation to identify edges
3. Uses a user-adjustable threshold to determine which edges to highlight

I chose a simplified approach to the edge detection algorithm to optimize performance in the browser environment. More complex algorithms would require significantly more CPU resources, potentially causing performance issues. This balanced approach provides effective edge detection while maintaining smooth performance.

Additional optimizations include limiting the maximum resolution to 1024px width for uploaded video processing, which significantly improves performance when working with high-resolution footage.

## Future Enhancements

### Backend Processing
While client-side processing works well for webcam footage, uploaded videos (especially larger files) could benefit from backend processing. This would:
- Reduce client-side computational load
- Allow for more sophisticated edge detection algorithms
- Improve overall application performance for large files

### GPU Acceleration with WebGL
Implementing WebGL would shift image processing from the CPU to the GPU, providing:
- Faster processing speeds
- Support for more complex algorithms
- Better overall performance for high-resolution footage

## Installation and Usage
1. Run the installation script to install all necessary packages:
`./install.sh`
2. Start the application:
`./run.sh`

## Demo
