# World Radio Map 🌎📻

An interactive web application that displays radio stations from around the world on an interactive map. Discover and listen to radio stations from different countries and cultures with a beautiful user interface and real-time streaming capabilities.

## ✨ Features

- **Interactive World Map**: Navigate a detailed world map with country borders and labels
- **Radio Station Discovery**: Explore thousands of radio stations with geographic data
- **Live Streaming**: Listen to radio stations in real-time with playback controls
- **Station Information**: View details about each station including country, codec, and bitrate
- **Responsive Design**: Clean and modern UI that works across devices

## 🛠️ Technologies Used

- **[Next.js](https://nextjs.org/)**: React framework for server-rendered applications
- **[React Simple Maps](https://www.react-simple-maps.io/)**: D3-based geographic visualization library
- **[Radio Browser API](https://www.radio-browser.info/)**: Public API for radio station data
- **[Howler.js](https://howlerjs.com/)**: Audio library for handling streaming media
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for styling

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd radio-node
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## 📖 How to Use

1. **Navigate the Map**: Drag to pan around and use the zoom controls to zoom in/out
2. **Discover Stations**: Hover over station markers to see station names
3. **Listen to Stations**: Click on a station marker to select and begin playback
4. **Control Playback**: Use the audio player at the bottom to play/pause and adjust volume

## 🏗️ Project Structure

```
radio-node/
├── app/
│   ├── components/
│   │   ├── AudioPlayer.tsx   # Handles audio streaming and controls
│   │   └── WorldMap.tsx      # Renders the interactive world map with station markers
│   ├── services/
│   │   └── radioService.ts   # API service for fetching radio station data
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Application layout component
│   └── page.tsx              # Main entry point and page component
├── public/                   # Static assets
└── ...                       # Configuration files
```

## 🔄 Radio Station Data

This application leverages the Radio Browser API to display radio stations from around the world. Some features:

- Automatic fetching of stations with geographic coordinates
- Fallback mechanism for important countries with missing station data
- Random coordinate assignment for stations without geographic data within country boundaries

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Radio Browser API](https://www.radio-browser.info/) for providing open access to radio station data
- [React Simple Maps](https://www.react-simple-maps.io/) for the map visualization library
- [Howler.js](https://howlerjs.com/) for the audio streaming capabilities
