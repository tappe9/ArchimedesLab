# Archimedes Lab

An interactive web application that demonstrates the relationship between regular polygons and π (pi) through visualization, inspired by Archimedes' method of calculating π.

🔗 [Live Demo](https://archimedes-lab.web.app)

## Features

- Interactive polygon visualization with adjustable vertices (3-1000 sides)
- Real-time calculation of π approximation
- Dynamic calculation of perimeter and error margin
- Customizable styling options:
  - Stroke width
  - Vertex size
  - Guidelines width
  - Colors with predefined themes
- Smooth rotation animation
- Responsive design
- Informative tooltips
- Educational modal explaining Archimedes' concept

## Technical Details

The application demonstrates:
- How the perimeter of a regular polygon approaches 2π as the number of sides increases
- The relationship between inscribed and circumscribed circles
- Real-time calculation of π approximation and error margin

## Technology Stack

- Vue 3 with Composition API
- Vite for build tooling
- Tailwind CSS for styling
- Firebase Hosting for deployment
- Modern JavaScript (ES6+)

## Local Development

1. Clone the repository
```bash
git clone <repository-url>
cd archimedes-lab
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## Theory

Archimedes calculated π by drawing regular polygons inside and outside of a circle. As the number of sides increases, the perimeter of the inscribed polygon approaches the circumference of the circle, providing an increasingly accurate approximation of π.

This application visualizes this concept by:
1. Drawing a regular polygon with adjustable vertices
2. Calculating its perimeter (for a unit circle, r=1)
3. Deriving π approximation from the perimeter
4. Showing the error margin compared to the actual value of π

## License

This project is built and maintained by [@tappe9](https://github.com/tappe9).
