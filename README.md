# FireGeek 🎬
> **Containerized Movie & Series Streaming Platform for Fire TV & Google TV**

![Status](https://img.shields.io/badge/Status-Beta-blue?style=for-the-badge) ![Docker](https://img.shields.io/badge/Deployment-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![Next.js](https://img.shields.io/badge/Framework-Next.js-black?style=for-the-badge&logo=next.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**FireGeek** is a premium, fully dockerized streaming application optimized for **Fire TV & Google TV**. It offers a Netflix-like experience with spatial navigation, smart recommendations, and a vast library of movies and series.

---

## ✨ Features

- **📺 Fire TV & Google TV Optimized**: Large touch targets, spatial navigation (D-Pad support), and high contrast UI.
- **🎥 Smart Browsing**: Explore collections sorted by genre, release date, or popularity.
- **🔍 Unified Search**: Instantly find both Movies and TV Series with smart filtering.
- **🧠 Recommendation Engine**: Personalized suggestions tailored to your viewing history.
- **🐳 Pure Docker**: Zero-dependency architecture; runs entirely in containers.
- **🎨 Responsive UI**: Seamless viewing experience across TV and large screens.

---

## 🚀 Quick Start

### Prerequisites

1.  **Docker Desktop**: Ensure Docker is installed and running.
2.  **Git**: To clone the repository.
    * *Note: No Node.js or npm is required on your host machine.*

### Installation & Run

1.  Clone the repository and navigate to the root:
    ```bash
    git clone https://github.com/dragonpilee/firegeek.git
    cd FireGeek
    ```

2.  Configure your environment variables:
    Create a `.env` file in the root directory with your TMDb API Key:
    ```env
    TMDB_API_KEY=your_api_key_here
    ```

3.  Build and launch the container:
    ```bash
    docker-compose up -d --build
    ```

4.  Open your browser (or Amazon Silk) and visit:
    **[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ Technology Stack

| Component | Technology |
|----------|------------|
| **Core Framework** | Next.js (React) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Data Sources** | TMDb API, vidsrc |
| **Infrastructure** | Docker, Docker Compose |

---

## 🤝 Contributing

**Important:** This project enforces a strict Docker-only workflow.

1.  **Fork & Branch**: Create a new branch for your feature.
2.  **Develop**: Test all changes inside the container (`docker-compose up`).
3.  **Commit & Push**: Submit your changes via Pull Request.

---

<div align="center">
  <sub>Developed with ❤️ by Cinegeek</sub><br>
  <sub>Optimized for Fire TV & Google TV</sub>
</div>


