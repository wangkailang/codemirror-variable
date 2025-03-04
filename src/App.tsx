import React from 'react';
import './App.css'
import TemplateEditor from './Editor'

function App() {
  const [value, setValue] = React.useState("Hello, <%= userName %>");
  const handleChange = (newValue: string) => {
    setValue(newValue);
    console.log('Editor content:', newValue);
  };
  return (
    <>
       <TemplateEditor initialValue={value} onChange={handleChange} /> 
    </>
  )
}

export default App
