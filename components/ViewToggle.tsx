import { useStoreState, useStoreActions } from "../store";
import { ViewsItem } from "../store/views";

interface ViewToggleProps {
  metaRecordId: string;
  viewItem: ViewsItem;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ metaRecordId, viewItem }) => {
  const selectedIds = useStoreState((state) => state.views.selectedIds);
  const isSelected = selectedIds.includes(metaRecordId);

  const selectView = useStoreActions((actions) => actions.views.select);
  const deselectView = useStoreActions((actions) => actions.views.deselect);

  return (
    <>
      <div
        className={`viewToggle ${isSelected ? "selected" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          if (isSelected) {
            deselectView({ metaRecordId });
          } else {
            selectView({ metaRecordId });
          }
        }}
      >
        {viewItem.metadata["Full name"]}
      </div>

      <style jsx>{`
        .viewToggle {
          background: ${isSelected ? "pink" : "initial"};
          border: solid 1px white;
          cursor: pointer;
          // font-weight: ${isSelected ? "bold" : "normal"};
          padding: 0.25em;
          user-select: none;
        }

        .viewToggle:hover {
          background: ${isSelected ? "pink" : "#eee"};
        }
      `}</style>
    </>
  );
};
