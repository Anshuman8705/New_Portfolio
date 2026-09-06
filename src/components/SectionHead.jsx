export default function SectionHead({ title, note }) {
  return (
    <div className="sec-head">
      <h2>{title}</h2>
      {note ? <p>{note}</p> : null}
    </div>
  );
}
