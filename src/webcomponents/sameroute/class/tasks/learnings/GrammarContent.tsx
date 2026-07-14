export interface GrammarContentType {
  id: string;
  taskId: string;
  content: string;
  entryType: string[];
}

interface Props {
  data: GrammarContentType;
}

export const GrammarContent = ({ data }: Props) => {
  return (
    <div className="max-w-2xl mx-auto p-5 space-y-5">
      <h2 className="text-xl font-bold">Grammar</h2>

      {/* Entry Types */}
      {data.entryType?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.entryType.map((entry) => (
            <span
              key={entry}
              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md"
            >
              {entry}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <p className="text-foreground leading-relaxed whitespace-pre-line">
        {data.content}
      </p>
    </div>
  );
};