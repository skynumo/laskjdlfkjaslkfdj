export default function SlashLayout({ children }) {
  return (
    <>
      <div className="slash-screen d-flex">
        <div className="slash-overlay">{children}</div>
      </div>
    </>
  );
}
