import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from "next/dynamic";

const VideoCall = dynamic(
  () => {
    return import("../../components/Agora/VideoCall");
  },
  { ssr: false }
);

const Meeting: NextPage = () => {

  return (
    <VideoCall/>
  )
}

export default Meeting
