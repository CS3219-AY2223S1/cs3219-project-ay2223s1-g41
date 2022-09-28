import Head from "next/head";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <main className="flex flex-col items-center min-h-screen gap-6">
        Welcome to PeerPrep
      </main>
    </>
  );
}
