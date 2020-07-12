import { useStoreState, useStoreActions } from "./store";
import { ViewsItem } from "./store/views";

interface ViewToggleProps {
  metaRecordId: string;
  viewItem: ViewsItem;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  metaRecordId,
  viewItem,
}) => {
  const selectedIds = useStoreState((state) => state.views.selectedIds);
  const isSelected = selectedIds.includes(metaRecordId);

  const selectView = useStoreActions((actions) => actions.views.select);
  const deselectView = useStoreActions((actions) => actions.views.deselect);

  const handleToggle = (e: any) => {
    e.preventDefault();
    if (isSelected) {
      deselectView({ metaRecordId });
    } else {
      selectView({ metaRecordId });
    }
  };

  return (
    <>
      <div
        tabIndex={0}
        className={`viewToggle ${isSelected ? "selected" : ""}`}
        onClick={handleToggle}
        onKeyDown={(e) => e.key === "Enter" && handleToggle(e)}
      >
        {viewItem.metadata["Full name"]}
      </div>

      <style jsx>{`
        .viewToggle {
          background: ${isSelected ? `${viewItem.defaultColor}99` : "initial"};
          border: solid 1px white;
          cursor: pointer;
          // font-weight: ${isSelected ? "bold" : "normal"};
          padding: 0.5em;
          user-select: none;
        }

        .viewToggle:hover {
          background: ${isSelected ? viewItem.defaultColor : "#eee"};
        }
      `}</style>
    </>
  );
};
