import React from 'react';
import './App.css'
import TemplateEditor from './Editor'

const VARIABLE_DATA = {
  userName: "userName",
  option1: "Option 1",
  option2: "Option 2",
  option3: "Option 3"
}

function App() {
  const [temValue, setTemValue] = React.useState("Hello, <%= userName %>,\n<%= age %>");
  const handleTemChange = (newValue: string) => {
    console.log(newValue)
    setTemValue(newValue);
  };

  const [varValue, setVarValue] = React.useState("Hello, {{userName}},\n{{age}}");
  const handleVarChange = (newValue: string) => {
    console.log(newValue)
    setVarValue(newValue);
  };

  return (
    <>
       <TemplateEditor initialValue={temValue} onChange={handleTemChange} mode="template" variables={VARIABLE_DATA} />
       <div style={{ border: '1px solid #ccc', margin: '8px 0 20px', padding: '8px', fontSize: '12px' }}>
        {temValue.split('\n').map((line, index) => (
          <div key={index}>{line}</div>
        ))}
       </div>
       <TemplateEditor initialValue={varValue} onChange={handleVarChange} mode="variable" variables={VARIABLE_DATA} />
       <div style={{ border: '1px solid #ccc', margin: '8px 0', padding: '8px', fontSize: '12px' }}>
        {varValue.split('\n').map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        </div>  
    </>
  )
}

export default App
