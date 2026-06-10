interface Props {
  title: string;
  data: any;
}

export default function ExternalDataCard({
  title,
  data,
}: Props) {
  return (
    <div className="border rounded p-4 shadow">
      <h3 className="font-bold mb-2">
        {title}
      </h3>

      <pre className="overflow-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}