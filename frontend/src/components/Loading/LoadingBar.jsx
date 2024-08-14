import "./LoadingBar.css"
export default function LoadingBar() {
  return (
    <div
      className="loading_bar"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <img
        src="https://cdn.pixabay.com/animation/2023/02/02/16/42/16-42-28-220_512.gif"
        alt="Loading..."
      />
    </div>
  );
}