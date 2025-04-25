export function AutoItem(props: any) {
  console.log('AutoItem props:', props);
  const { label, type, detail, info } = props;
  return (
    <div style={{
      border: '1px solid red',
      padding: '5px',
    }}>
      <strong>{label}</strong> ({type})<br />
      <small>{detail}</small><br />
      <em>{info}</em>
    </div>
  )
}