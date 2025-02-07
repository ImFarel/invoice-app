# Invoice Management

This project is a Next.js application for managing invoices.

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js (>= 12.x)
- npm (>= 6.x)
- Docker (optional, for running with Docker)

## Installation

To install the project dependencies, run the following command:

```bash
npm install
```

## Running the App Locally

To run the app locally, use the following command:

```bash
npm run dev
```

This will start the development server on `http://localhost:3000`.

## Running the App with Docker

To run the app using Docker, follow these steps:

1. Build the Docker image:

   ```bash
   docker build -t invoice-app .
   ```

2. Run the Docker container:

   ```bash
   docker run -p 3000:3000 invoice-app
   ```

This will start the server on `http://localhost:3000`.

## Already Deployed

The application is already deployed and can be accessed at the following URL:

[https://seahorse-app-czpgg.ondigitalocean.app/invoices](https://seahorse-app-czpgg.ondigitalocean.app/invoices)

## Environment Variables

Make sure to set up the necessary environment variables. You can create a `.env.local` file in the root of the project and add your variables there. For example:

```env
DATABASE_URL=your_database_url
```

## License

This project is for interview purposes only and is not intended for commercial use. Unauthorized use, distribution, or modification of this project is prohibited.
