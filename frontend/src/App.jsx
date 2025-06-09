import logo from './logo.svg';
import './App.css';
import { Fragment, useState } from 'react';
import styled from 'styled-components';



function App() {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(
    {error: 
    {
      status: false,
      message: null
    },
     data: {
      status: false,
      message: null
    }});
      const [copied, setCopied] = useState(false);

       const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response.data.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // reset after 2 sec
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      await handleRequest();
    }
  };

  async function handleRequest(){
    setLoading(true)
    if (!(inputValue.trim())){

      setLoading(false)
       setInputValue('')
        setResponse((prev) => {
        return {...prev, error: {status: true, message: 'Campo de URL Vazio'}, data: {status: false, message: null }}
      })
      return;
    }
    if (!inputValue.startsWith('http://') && !inputValue.startsWith('https://')){
       setLoading(false)
       setInputValue('')
        setResponse((prev) => {
        return {...prev, error: {status: true, message: 'URL Malformatada'}, data: {status: false, message: null }}
      })
      return;
    }
    if (inputValue == 'http://' || inputValue == 'https://'){
       setLoading(false)
       setInputValue('')
        setResponse((prev) => {
        return {...prev, error: {status: true, message: 'URL Incompleta'}, data: {status: false, message: null }}
      })
      return;
    }
    await fireRequest()
    setLoading(false)
            setInputValue('')
  }

  async function fireRequest(){
    const res = await fetch('https://guilhermegavioli.xyz/shorturl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({url: inputValue}),
    })
    console.log(res.status);
    if (res.status == 200) {
      const { link } = await res.json()
      setResponse((prev) => {
        return {...prev, data: {status: true, message: link}, error: {status: false, message: null }}
      })
    } else {
         const { error } = await res.json()
 
       setResponse((prev) => {
        return {...prev, error: {status: true, message: error}, data: {status: false, message: null }}
      })
    }
    
  }


  return (
    <div>

      <p style={{position: 'absolute', top: '10px', left: '10px', userSelect: 'none',
      fontSize: '1.2em',
      color: 'rgb(225,225,225)'}}>Guilherme Gavioli</p>
      <p style={{position: 'absolute', bottom: '10px', right: '10px',
      fontSize: '1.1em', userSelect: 'none', 
         color: 'rgb(205,205,205)'}}>Demo App</p>


      <Container>

     <SubContainer>
     <Input id="main-input"
      placeholder='https://google.com/search?q=automata'
    value={inputValue} 
    onChange={(e) => setInputValue(e.target.value)}
     onKeyDown={handleKeyDown}
    />
     <Button loading={loading} onClick={handleRequest} style={{
    
       
      }}>
      {loading? 
      <div className='my-spinner'></div>
      :
        <p style={{display: 'flex',justifyContent: 'center', width: 'fit-content'}}>
        Encurtar
        </p>
        }
      </Button>

     </SubContainer>

        <ResultContainer>
          {
            response.data.status && 
            <DataMessageContainer>
                <DataMessage>{response.data.message}

        </DataMessage>
        {
          copied ?
          <p style={{marginRight: '15px'}}>copied!</p>
          :
          <img onClick={handleCopy} src="/copy-link.png" style={{width: '26px', height: '26px', marginRight: '15px'}} alt="" />
        }
            </DataMessageContainer>
          }
 
 {
response.error.status && 
  <ErrorText>{response.error.message}</ErrorText>

}
     </ResultContainer>
   

      </Container>
    </div>
  );
}

export default App;


const Container = styled.div`
position: absolute; inset: 0 0 120px 0; margin: auto; height: fit-content;
        width: fit-content; display: flex; flex-direction: column;
        alignItems: center; justifyContent: center;


          @media (min-width: 768px) {

  }
`

const SubContainer = styled.div`
height: 70px;width: 100%; padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      @media (min-width: 768px) {
        flex-direction: row;
  }
      `

const Button = styled.div`
   background: ${(props) => props.loading ? '#1565c0' : '#1976d2'};  border: none; padding: 10px 30px;
        height: 50px; 
        color: white; font-size: 1.5em;
        width: 100%;
        display: flex;
        justify-content: center;
        @media (min-width: 768px) {
          width: 160px;
  }
`

const Input = styled.input`
height: 50px;  padding: 10px 15px; 
      border: 1px solid rgb(207, 207, 207);

      width: 260px;
      font-size: 1.1em;
           @media (min-width: 375px) {
           width: 300px;
           font-size: 1.3em;
  }

           @media (min-width: 585px) {
           width: 500px;
           font-size: 1.3em;
  }
`

const ResultContainer = styled.div`
background: yellow;
  margin-top: 50px; 
  padding: 0, margin: 0;
  max-width: 280px;
  width: 100%;
           @media (min-width: 375px) {
             margin-top: 50px; 
             display: flex; justify-content: center; align-items: center; 
               max-width: 320px;
  }

           @media (min-width: 585px) {
         margin-top: 50px; 
         display: flex; justify-content: center; align-items: center; 
                max-width: 520px;
         }
         @media (min-width: 768px) {
          margin-top: 10px; 
          display: flex; justify-content: center; align-items: center; 
           max-width: 100%;
  }
`


const ErrorText = styled.p`
user-select: none; font-size: 1.1em;  background: yellow; 
width: 100%;
          padding: 8px 15px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  text-align: center;
     @media (min-width: 375px) {
             font-size: 1.5em;
             padding: 8px 15px;
             max-width: 300px;
             }
             
             @media (min-width: 585px) {
              font-size: 1.5em;
              padding: 8px 15px;
              max-width: 600px;
              }
              @media (min-width: 768px) {
                font-size: 1.5em;
                padding: 8px 15px;
                max-width: unset;
  }
`

const DataMessageContainer = styled.div`
display: flex;
align-items: center;
`

const DataMessage = styled.p`
user-select: none; font-size: 1em;  background: yellow; 
width: 100%;

          padding: 8px 15px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  text-align: start;
  display: flex;
     @media (min-width: 375px) {
             font-size: 1.2em;
             padding: 8px 15px;
             max-width: 300px;
             }
             
             @media (min-width: 585px) {
              font-size: 1.5em;
              padding: 8px 15px;
              max-width: 600px;
              }
              @media (min-width: 768px) {
                font-size: 1.5em;
                padding: 8px 15px;
                max-width: unset;
  }
`