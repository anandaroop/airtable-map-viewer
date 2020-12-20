# Airtable Map Viewer: route planning for mutual aid

_**UPDATE**: This tool has been absorbed into https://github.com/anandaroop/qcc-admin, this repo is for archival purposes only._

This app simplifies the process of assembling itineraries for drivers doing coordinated food delivery dropoffs.

It was developed in 2020 as part of the Queens DSA Mutual Aid committee's response to problems of food insecurity and inadequate govermental response in the wake of COVID.

It looks like this (all fake data, no PII):

<img src="https://user-images.githubusercontent.com/140521/92034002-9e6c3880-ed3a-11ea-824a-2982af6fe8e4.png" title="It's all fake data, no PII" />

It's not exactly turnkey, as it is fairly coupled with our particular Airtable schemas, but it may be adaptable by other organizations as well.

Components:

- An **Airtable** base with tables for volunteers, requesters, and deliveries
- Geocoding enabled via the **Airtable Map block**, and an API key issuing geocoding requests to the **Google Geocoding API**
- This NextJS app, which provides an enhanced alternative front-end to the Airtable interface's geocoded/mapped entries.
- **Auth0** for authentication to the NextJS app


![Airtable Map Viewer](https://user-images.githubusercontent.com/140521/92038673-c3b07500-ed41-11ea-98cc-e0841c2bee25.png)

<!--

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
 -->
