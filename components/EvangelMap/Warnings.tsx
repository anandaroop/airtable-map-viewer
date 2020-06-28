import { useStoreState } from "./store";

export const Warnings = () => {
  const warnings = useStoreState((state) => state.recipients.warnings);
  const recipients = useStoreState((state) => state.recipients.items);
  const metadata = useStoreState((state) => state.recipients.metadata);

  const totalWarningCount = Object.values(warnings)
    .map((arr) => arr.length)
    .reduce((sum, val) => sum + val, 0);

  if (totalWarningCount === 0) return null;

  const primaryFieldName = metadata["Primary field name"];
  const tid = metadata["Table ID"];
  const vid = metadata["View ID"];
  return (
    <>
      <div className="warnings">
        {warnings.missingLatLngs?.length > 0 && (
          <ul>
            ⚠️ Missing geocodes
            {warnings.missingLatLngs.map((rid) => {
              return (
                <li key={rid}>
                  <AirtableHyperlink tid={tid} vid={vid} rid={rid}>
                    {recipients[rid].fields[primaryFieldName]}
                  </AirtableHyperlink>
                </li>
              );
            })}
          </ul>
        )}

        {warnings.genericLatLngs?.length > 0 && (
          <ul>
            ⚠️ Improper geocodes
            {warnings.genericLatLngs.map((rid) => {
              return (
                <li key={rid}>
                  <AirtableHyperlink tid={tid} vid={vid} rid={rid}>
                    {recipients[rid].fields[primaryFieldName]}
                  </AirtableHyperlink>
                </li>
              );
            })}
          </ul>
        )}

        {warnings.unavailableDrivers?.length > 0 && (
          <ul>
            ⚠️ Incorrect drivers
            {warnings.unavailableDrivers.map((rid) => {
              return (
                <li key={rid}>
                  <AirtableHyperlink tid={tid} vid={vid} rid={rid}>
                    {recipients[rid].fields[primaryFieldName]}
                  </AirtableHyperlink>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <style jsx>{`
        .warnings {
          margin-top: 1em;
          // font-style: italic;
        }
        ul {
        }
        li {
          margin-left: 1.5em;
          padding: 0.125em 0;
        }
      `}</style>
    </>
  );
};

interface AirtableHyperlinkProps {
  /** Table ID */
  tid: string;

  /** View ID */
  vid: string;

  /** Record ID */
  rid: string;
}

const AirtableHyperlink: React.FC<AirtableHyperlinkProps> = ({
  tid,
  vid,
  rid,
  children,
}) => (
  <a href={`https://airtable.com/${tid}/${vid}/${rid}`} target="airtable">
    {children}
  </a>
);
