import React from 'react';
import './App.css'
import TemplateEditor from './Editor'

function App() {
  const [temValue, setTemValue] = React.useState("Hello, <%= userName %>, <%= age %>");
  const handleTemChange = (newValue: string) => {
    setTemValue(newValue);
  };

  const [varValue, setVarValue] = React.useState("Hello, {{userName}}, {{age}}");
  const handleVarChange = (newValue: string) => {
    setVarValue(newValue);
  };

  return (
    <>
       <TemplateEditor initialValue={temValue} onChange={handleTemChange} mode="template" />
       <div style={{ border: '1px solid #ccc', margin: '8px 0 20px' }}>
          <strong>{temValue}</strong>
       </div>
       <TemplateEditor initialValue={varValue} onChange={handleVarChange} mode="variable" />
       <div style={{ border: '1px solid #ccc', margin: '8px 0' }}>
          <strong>{varValue}</strong>
        </div>  
    </>
  )
}

export default App
