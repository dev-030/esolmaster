import Image from "next/image";

export interface ReadingContentType {
  id: string;
  taskId: string;
  content: string;
  imageUrl?: string;
  entryType: string[];
  awardingBody?: string | null;
  passLogic: string;
  passMark?: number | null;
}

export const ReadingContent = ({ data }: { data: ReadingContentType }) => {
  return (
    <div className="max-w-3xl mx-auto p-5 space-y-5">
      <h2 className="text-xl font-bold">Reading Passage</h2>

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

      {/* Image */}
      {data.imageUrl && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden">
          <Image
            src={data.imageUrl}
            alt="Reading illustration"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <p className="text-foreground leading-relaxed whitespace-pre-line">
        {data.content}
      </p>
    </div>
  );
};
