This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

You can check the website as below

Website Link: https://ropsten-eth-marketplace.vercel.app/
Web3 website runs in Ropsten Test Network. 
You can change the network through .env.production file. 


First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

Dependecies are mentioned as follows,

1) Project Create --> 
Create Project for next : npx create-next-app projectname 

2) Download Tailwind.css.
Command: npm install -D tailwindcss@latest postcss@latest  autoprefixer@latest
Create Tailwinde config file: npx tailwindcss init -p

3) Create jsconfig.json file for mapping the components.

4) Download react-toastify npm i react-toastify
5) Download npm i swr
6) Download DetectProvider npm i @metamask/detect-provider
7) Download web3: npm install web3 
8) Download truffle: truffle init 
9) Download npm i @truffle/hdwallet-provider
10)Upload sol files and run truffle migrate 

 
Vercel doesn't let me deploy without keys.json. It's been duplicated and changed deleberately.

Solidity file is included. 
wEB3-PROVIDER connection is in BaseLayout side which is shared through ContextProvider. 

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
