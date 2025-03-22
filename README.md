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
My implementation is based on research from various focus peaking algorithms and techniques, including Paul Bourke's work on [Focus Peaking](https://paulbourke.net/miscellaneous/focuspeaking/) and R. Fisher, S. Perkins, A. Walker, and E. Wolfart [Sobel Edge Detector](https://homepages.inf.ed.ac.uk/rbf/HIPR2/sobel.htm).

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

### Gaussian Blur Pre-processing
Adding a Gaussian blur pre-processing step would significantly improve the quality of edge detection, particularly for noisy footage:
- Reduces noise and grain in the source footage
- Smooths out minor variations that could trigger false edge detections
- Creates more defined and accurate edge highlighting
- Allows for better performance on lower quality video sources

## Installation and Usage
1. Run the installation script to install all necessary packages:
`./install.sh`
2. Start the application:
`./run.sh`

## Demo
<img width="1470" alt="Screenshot 2025-03-22 at 2 19 08 AM" src="https://github.com/user-attachments/assets/ec06b253-c240-4f70-a380-4aa573742c43" />

*Image of landing page*

<img width="1470" alt="Screenshot 2025-03-22 at 2 19 24 AM" src="https://github.com/user-attachments/assets/14813eb3-ab2f-437f-915b-b4b113fdee9f" />

*Image of uploaded video footage (focus peaking disabled)*

<img width="1470" alt="Screenshot 2025-03-22 at 2 19 42 AM" src="https://github.com/user-attachments/assets/a8fc3483-050d-481d-8d4a-21e4468ec2c9" />

*Image of uploaded video footage (focus peaking enabled)*

## References

[1] P. Bourke, "Focus Peaking," Paul Bourke Personal Pages, March 2022. [Online]. Available: https://paulbourke.net/miscellaneous/focuspeaking/

[2] R. Fisher, S. Perkins, A. Walker, and E. Wolfart, "Sobel Edge Detector," Hypermedia Image Processing Reference (HIPR2), School of Informatics, University of Edinburgh, 2004. [Online]. Available: https://homepages.inf.ed.ac.uk/rbf/HIPR2/sobel.htm