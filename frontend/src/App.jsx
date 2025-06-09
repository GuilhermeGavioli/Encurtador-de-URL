import logo from './logo.svg';
import './App.css';
import { Fragment, useState } from 'react';


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
    <div style={{}}>

<div style={{position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center', gap: '3px',
  justifyContent: 'center'
}}>

      <p style={{userSelect: 'none',
      fontSize: '1.2em',
      color: 'rgb(225,225,225)'}}>

          Guilherme Gavioli</p>
           </div>

      <p style={{position: 'absolute', bottom: '10px', right: '10px',
      fontSize: '1.1em', userSelect: 'none', 
         color: 'rgb(205,205,205)'}}>Demo App</p>

      <div style={{position: 'absolute', inset: '0 0 120px 0', margin: 'auto', height: 'fit-content',
        width: 'fit-content', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>

     {/* <h1 style={{fontSize: '2.4em'}}>ENCURTADOR DE URL</h1> */}
     {/* <h2>Guilherme Gavioli</h2> */}
     <div style={{height: '70px',width: '100%', backgorund: 'red', padding: '10px',
      display: 'flex'
     }}>
     <input id="main-input"
     style={{height: '50px', width: '500px', padding: '10px 15px', fontSize: '1.3em',
      border: '1px solid rgb(207, 207, 207)'
    }} placeholder='https://google.com/search?q=automata'
    value={inputValue} 
    onChange={(e) => setInputValue(e.target.value)}
     onKeyDown={handleKeyDown}
    />
     <button onClick={handleRequest} style={{
       background: loading ? '#1565c0' : '#1976d2' ,  border: 'none', padding: '10px 30px',
        height: '50px', width: '160px',color: 'white',fontSize: '1.5em',
       
      }}>
      {loading? 
      <div className='my-spinner'></div>
      :
        <Fragment>
        Encurtar
        </Fragment>
        }
      </button>

     </div>

        <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px', alignItems: 'center', background: 'yellow',
  
         }}>
          {
            response.data.status && 
            <>
                <p style={{fontSize: '1.5em',  padding: '8px 15px'}}>{response.data.message}

        </p>
        {
          copied ?
          <p style={{marginRight: '15px'}}>copied!</p>
          :
          <img onClick={handleCopy} src="/copy-link.png" style={{width: '26px', height: '26px', marginRight: '15px'}} alt="" />
        }
            </>
          }
 
 {
response.error.status && 
  <p style={{userSelect: 'none', fontSize: '1.5em',  background: 'yellow', padding: '8px 15px'}}>{response.error.message}</p>

}
     </div>
   

      </div>
    </div>
  );
}

export default App;
