import { Button, Input, Link, UseToast } from 'angel_ui'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react'
import { v4 } from 'uuid';
import { Body } from '../components/Body'
import { Logo } from '../components/Logo'
import { StartMeet } from '../components/StartMeet'
import api from '../services/api'

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [channel, setChannel] = useState<string>('');
  const { addToast } = UseToast();
  const router = useRouter();
  const myId = v4();

  async function enterMeeting(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    if(channel && myId) {
      const result = await api.post(`/meet/buildToken/${channel}/${myId}`);
      if(result) {
        const addInfo = await api.post(`/meet/informations/${channel}/${myId}/access`);
        if(addInfo) {
          setIsLoading(false);
          router.push(`/meet/${channel}/${myId}/${result.data.env[myId].uid}/${result.data.env[myId].token}`);
        } else {
          addToast({
            title: 'Aconteceu um erro',
            description: 'Não foi possível entrar com sucesso. Por favor tente novamente mais tarde.',
            duration: 5000,
            position: 'top-right',
            withDecorator: true
          });
        }
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        addToast({
          title: 'Aconteceu um erro',
          description: 'Não foi possível criar sua sala. Por favor tente novamente mais tarde.',
          duration: 5000,
          position: 'top-right',
          withDecorator: true
        });
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      addToast({
        title: 'Aconteceu um erro',
        description: 'Não foi possível criar sua sala. Por favor tente novamente mais tarde.',
        duration: 5000,
        position: 'top-right',
        withDecorator: true
      });
    }
  }

  async function getChannel() {
    const response = await api.get(`/test/meet/simulateChannelName`);
    if(response) {
      setChannel(response.data.channelName);
    } else {
      addToast({
        title: 'Error',
        description: 'Something went wrong',
        duration: 5000,
        position: 'top-right',
      });
    }
  }

  return (
    <Body>
      <Head>
        <title>Agora - Meet </title>
        <meta name="description" content="A Meet Website using Agora and NextJS. The website was created with AngelUI." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StartMeet onSubmit={enterMeeting}>
        <Logo/>
        <Input mt='mt-4' w='w-full' isFieldset legend='Canal' 
          placeholder='Identificador do canal' 
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        />
        <Link mt='mt-2' mb='mb-2' h='h-1.5' p='p-0' href='#' onClick={getChannel}>Gerar novo canal</Link>
        <Button mt='mt-4' w='w-full' btnType='primary' isLoading={isLoading} type='submit'>ENTRAR</Button>
      </StartMeet>
    </Body>
  )
}

export default Home
