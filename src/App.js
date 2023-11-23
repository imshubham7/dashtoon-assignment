import React, {useState} from 'react'
import './App.css';

function App(){
  const [text, setText] = useState(Array(10).fill(''));
  const [panelText, setPanelText] = useState(Array(10).fill(''));
  const [images, setImages] = useState(Array(10).fill(null));
  const [loading, setLoading] = useState(false);

  const handleInputChange = (index,value) => {
    const newText = [...text];
    newText[index] = value;
    setText(newText);
  }
  const handlePanelInputChange = (index,value) => {
    const newPanelText = [...panelText];
    newPanelText[index] = value;
    setPanelText(newPanelText);
  }
  const handleSubmit = async () => {
    try{
     setLoading(true);

     const comics = await Promise.all(
      text.map(async (data,index) => {
        if(!data){
          return {imageUrl : null, annotation: `Write some text in Textfield ${index+1}`};
        }
        const data1 = {inputs: data};
        const response = await query(data1);

        if(response.ok){
          const imageBlob = await response.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          return {imageUrl, annotation: panelText[index]}
        }else{
          console.log(`Error for panel ${index+1}: ${response.statusText}`);
          return {imageUrl: null, annotation: `Error: ${response.statusText}`};    
        }
      })
     );
      setImages(comics)
    }catch(e){
      console.log('Error:', e.message);
    }finally{
      setLoading(false);
    }
  };

  const generateNew = () => {
    setText(Array(10).fill(''));
    setPanelText(Array(10).fill(''));
    setImages(Array(10).fill(null));
  }

  const query = async (data) => {
    try{
    const response = await fetch(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        {
            headers: { 
                "Accept": "image/png",
                "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM", 
                "Content-Type": "application/json" 
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    if(!response.ok){
      throw new Error(`'HTTP error! Status: ${response.status}`);
    }
    return response;
    }catch(e){
      console.log('Error in query function:', e.message);
      throw e;
    }
  };
  
  return(
     <div className='App'>
      <header className='App-header'><h1>Let the comics be unleashed!</h1></header>
      <form onSubmit={e => e.preventDefault()}>
        {text.map((data,index) => (
          <div key={index} className='text-inputs'>
            <div className='text'>
              <label>{`Text ${index+1}: `}</label>
              <textarea className='textbox' value={data}
               onChange={e => handleInputChange(index, e.target.value)}
              />
            </div>
            <div className='text'>
             <label>{`Speech Bubbles ${index+1}: `}</label>
              <textarea className='textbox' value={panelText[index]}
               onChange={e => handlePanelInputChange(index, e.target.value)}
              />
            </div>
          </div>
        ))}
        <button className='button-9' type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Generating..': 'Make comic'}
        </button>
        <button className='button-9' type="button" onClick={generateNew}>
          Make comic from scratch
        </button>
      </form>
      {loading && <div className="loader"></div>}
      <div className="comic-display">
        {images.map((panel,index) => (
          panel && (
            <div key={index} className='comic-panel'>
              {panel.imageUrl ? (
                <img src={panel.imageUrl} width={150} height={150} alt={`Create more ${index+1}`} />
              ) : (
                <div className='default-text'>{panel.annotation}</div>
              )}
            <div className='annotation'>{panel.annotation}</div>
            </div>
          )
        ))}
      </div>
     </div>
  )
};

export default App;