# Flashcard Master

Flashcard Master is a web application designed to help users create, manage, and study flashcards. It leverages the power of Google's Gemini AI to automatically generate flashcard sets based on user-provided topics, making learning more efficient and engaging. Users can study cards individually or play a matching game to test their knowledge.

## Key Features

*   **Create and Manage Flashcard Sets:** Easily create, edit, and delete your own custom flashcard sets.
*   **AI-Powered Flashcard Generation:** Automatically generate flashcards on various topics using Google Gemini. (Requires a Gemini API Key).
*   **Single Card Study Mode:** Review your flashcards one by one, focusing on questions and answers.
*   **Multiple Card Match Game:** Test your knowledge with an interactive matching game.
*   **Local Storage Persistence:** Your flashcard sets and user preferences are saved in your browser's local storage for convenience.
*   **User-Friendly Interface:** Clean and intuitive design for a seamless learning experience.

## Getting Started

Follow these instructions to get a copy of Flashcard Master up and running on your local machine for development and testing purposes.

### Prerequisites

*   **Node.js:** Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm** (or **yarn**): npm is included with Node.js. Alternatively, you can use yarn.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/flashcard-master.git # Replace with the actual repo URL if different
    cd flashcard-master
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

### Running the Development Server

Once the dependencies are installed, you can start the development server:

Using npm:
```bash
npm run dev
```
Or using yarn:
```bash
yarn dev
```
This will typically open the application in your default web browser at `http://localhost:5173` (Vite's default port).

### Setting up the Gemini API Key (Important for AI Features)

The AI-powered flashcard generation feature uses the Google Gemini API. To enable this feature, you need to obtain an API key and configure it for the project.

1.  **Obtain a Gemini API Key:**
    *   Go to [Google AI Studio](https://aistudio.google.com/app/apikey) (or the relevant Google Cloud Console page) to get your API key.
    *   Follow the instructions to create a new API key if you don't have one already.

2.  **Configure the API Key:**
    *   In the root directory of the project, create a new file named `.env`.
    *   Add the following line to the `.env` file, replacing `YOUR_API_KEY_HERE` with your actual Gemini API key:
        ```
        API_KEY=YOUR_API_KEY_HERE
        ```
    *   **Important:** The `geminiService.ts` file looks for `process.env.API_KEY`. Vite uses a different way to expose environment variables to the client. For client-side exposure, environment variables **must** be prefixed with `VITE_`.
        Therefore, you should use:
        ```
        VITE_API_KEY=YOUR_API_KEY_HERE
        ```
        You will also need to update `services/geminiService.ts` to read `import.meta.env.VITE_API_KEY` instead of `process.env.API_KEY`.

3.  **Gitignore:**
    Ensure that your `.env` file is not committed to version control. If it's not already there, add `.env` to your `.gitignore` file:
    ```
    .env
    ```

After completing these steps, the AI features for generating flashcards should be enabled. If the API key is not provided or is incorrect, the application will still run, but the AI-based card generation will be disabled (as indicated in the console).

## Project Structure

The project is organized into the following main directories:

```
flashcard-master/
├── public/               # Static assets
├── src/                  # Source code
│   ├── components/       # Reusable React components (e.g., Button, Header, Modal)
│   ├── constants.ts      # Application-wide constants (e.g., local storage keys, AI model names)
│   ├── hooks/            # Custom React hooks (e.g., useTimer)
│   ├── pages/            # Top-level page components (e.g., MainMenuScreen, SetManagementScreen)
│   ├── services/         # Modules for external interactions (e.g., storageService, geminiService)
│   ├── types.ts          # TypeScript type definitions and enums
│   ├── App.tsx           # Main application component, handles routing and global state
│   ├── index.css         # Global styles (if any, often TailwindCSS base is here or imported)
│   ├── index.tsx         # Entry point of the React application
│   └── ...               # Other configuration or source files
├── .env.example          # Example environment file (optional, good practice)
├── .gitignore            # Specifies intentionally untracked files that Git should ignore
├── index.html            # Main HTML file for Vite
├── package.json          # Project metadata, dependencies, and scripts
├── tsconfig.json         # TypeScript compiler options
├── vite.config.ts        # Vite configuration file
└── README.md             # This file
```

*   **`src/components/`**: Contains reusable UI components used throughout the application.
*   **`src/constants.ts`**: Defines constant values used in the application, such as local storage keys or configuration strings.
*   **`src/hooks/`**: Holds custom React Hooks that encapsulate reusable stateful logic.
*   **`src/pages/`**: Contains components that represent different screens or views of the application.
*   **`src/services/`**: Includes modules responsible for handling side effects and external interactions, like browser storage (`storageService.ts`) or AI interactions (`geminiService.ts`).
*   **`src/types.ts`**: Centralizes TypeScript type definitions and enums for data structures used in the project.
*   **`src/App.tsx`**: The root component of the React application, managing overall layout, routing, and global state.
*   **`src/index.tsx`**: The entry point that renders the `App` component into the DOM.
*   **`public/`**: Contains static assets that are served directly by the web server (e.g., favicons, images).
*   **`vite.config.ts`**: Configuration file for Vite, the build tool and development server.

## Available Scripts

In the project directory, you can run the following scripts:

### `npm run dev` (or `yarn dev`)

Runs the app in development mode using Vite.
Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser.
The page will reload if you make edits, and you will see any lint errors in the console.

### `npm run build` (or `yarn build`)

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include hashes.

### `npm run preview` (or `yarn preview`)

Serves the production build from the `dist` folder locally.
This is a good way to check if the production build works correctly before deploying.

## Contributing

Contributions are welcome! If you have suggestions for improvements or want to fix a bug, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name` or `bugfix/issue-description`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code follows the existing style and that any new features are appropriately covered by tests (if applicable).

## License

This project is currently not licensed. Please add a license file (e.g., MIT, Apache 2.0) if you intend to distribute it.

---

*This README was generated by an AI assistant.*
