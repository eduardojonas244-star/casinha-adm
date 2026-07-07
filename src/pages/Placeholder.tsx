export function PlaceholderPage(props: { title: string; description: string }) {
  return (
    <>
      <h1 className="page-title">{props.title}</h1>
      <div className="panel empty-state">
        <h3>Disponível na Fase 2</h3>
        <p>{props.description}</p>
      </div>
    </>
  );
}
