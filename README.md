# Consistent Hashing Simulation

[![Netlify Status](https://api.netlify.com/api/v1/badges/edeee522-4d1e-47c9-b5bc-2a756e46ed87/deploy-status)](https://app.netlify.com/sites/consistent-hashing/deploys)

An interactive visualization of the Consistent Hashing algorithm, built with React and TypeScript.

## What is Consistent Hashing?

Consistent Hashing is a distributed hashing scheme that operates independently of the number of servers or objects in a distributed hash table. It helps minimize the number of keys that need to be remapped when a hash table is resized.

Key benefits:
- Only k/n keys need to be remapped when changing the table size
- Servers can be added/removed with minimal disruption
- Helps achieve better distribution of data across nodes

## Features

- 🔄 Interactive hash ring visualization
- 🖥️ Dynamic node addition and removal
- 📊 Real-time data distribution view
- ⚡ Automatic data point generation
- 📱 Responsive design for all devices

## Try It Out

Visit the live demo: [Consistent Hashing Simulation](https://consistent-hashing.netlify.app)

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Built With

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

## License

MIT