type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function isOrderedListItem(line: string) {
  return /^\d+\.\s+/.test(line);
}

function isUnorderedListItem(line: string) {
  return /^-\s+/.test(line);
}

function isHeading(line: string) {
  return /^#{1,6}\s+/.test(line);
}

function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  let index = 0;

  while (index < lines.length) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line) {
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      index += 1;
      continue;
    }

    if (isUnorderedListItem(line)) {
      const items: string[] = [];

      while (index < lines.length) {
        const current = lines[index].trim();

        if (isUnorderedListItem(current)) {
          items.push(current.replace(/^-+\s+/, "").trim());
          index += 1;
          continue;
        }

        if (!current) {
          index += 1;
        }
        break;
      }

      blocks.push({ type: "ul", items });
      continue;
    }

    if (isOrderedListItem(line)) {
      const items: string[] = [];

      while (index < lines.length) {
        const current = lines[index].trim();

        if (isOrderedListItem(current)) {
          items.push(current.replace(/^\d+\.\s+/, "").trim());
          index += 1;
          continue;
        }

        if (!current) {
          index += 1;
        }
        break;
      }

      blocks.push({ type: "ol", items });
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;

    while (index < lines.length) {
      const current = lines[index].trim();

      if (!current || isHeading(current) || isUnorderedListItem(current) || isOrderedListItem(current)) {
        break;
      }

      paragraph.push(current);
      index += 1;
    }

    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

export function LegalMarkdown({ content }: { content: string }) {
  const blocks = parseMarkdown(content);

  return (
    <div className="legal-doc">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          if (block.level === 1) {
            return <h1 key={index}>{block.text}</h1>;
          }

          if (block.level === 2) {
            return <h2 key={index}>{block.text}</h2>;
          }

          return <h3 key={index}>{block.text}</h3>;
        }

        if (block.type === "paragraph") {
          return <p key={index}>{block.text}</p>;
        }

        if (block.type === "ul") {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          <ol key={index}>
            {block.items.map((item, itemIndex) => (
              <li key={`${index}-${itemIndex}`}>{item}</li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}
