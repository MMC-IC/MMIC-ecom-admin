import CircleIcon from "@mui/icons-material/Circle";
import { formatDate } from "../../utils/functions";

const TrackStepper = ({ statusHistory = [] }) => {
  // Extract statuses
  const statuses = statusHistory.map((s) => s.status);
  console.log(statuses);

  const hasOrdered = statuses.includes("Ordered");
  const hasShipped = statuses.includes("Shipped");
  console.log(hasShipped);
  const hasDelivered = statuses.includes("Delivered");

  const cancelled = statusHistory.find((s) => s.status === "Cancelled");

  const returnRequested = statusHistory.find(
    (s) => s.status === "Return Requested"
  );

  const returned = statusHistory.find((s) => s.status === "Returned");

  const returnRejected = statusHistory.find(
    (s) => s.status === "Return Rejected"
  );

  const Step = ({ active, label, date }) => (
    <div className="flex flex-col items-center min-w-[90px]">
      <CircleIcon
        sx={{ fontSize: 16 }}
        className={active ? "text-primary-green" : "text-gray-400"}
      />
      <span
        className={`text-sm font-medium ${
          active ? "text-primary-green" : "text-gray-400"
        }`}
      >
        {label}
      </span>
      {active && date && (
        <span className="text-xs text-primary-green">{formatDate(date)}</span>
      )}
    </div>
  );

  const Line = ({ active }) => (
    <div
      className={`flex-1 h-[2px] ${
        active ? "bg-primary-green" : "bg-gray-300"
      }`}
    />
  );

  return (
    <div className="flex flex-col gap-2">
      {/* PIPELINE */}
      <div className="flex items-center justify-between">
        <Step
          active={hasOrdered}
          label="Ordered"
          date={statusHistory.find((s) => s.status === "Ordered")?.date}
        />
        <Line active={hasShipped || hasDelivered} />
        <Step
          active={hasShipped}
          label="Shipped"
          date={statusHistory.find((s) => s.status === "Shipped")?.date}
        />
        <Line active={hasDelivered} />
        <Step
          active={hasDelivered}
          label="Delivered"
          date={statusHistory.find((s) => s.status === "Delivered")?.date}
        />
      </div>

      {/* CANCEL INFO */}
      {cancelled && (
        <div className="flex flex-col items-center text-red-600 mt-1">
          <CircleIcon sx={{ fontSize: 14 }} />
          <span className="font-medium">Order Cancelled</span>
          <span className="text-xs">{formatDate(cancelled.date)}</span>
        </div>
      )}

      {/* RETURN INFO */}
      {(returnRequested || returned || returnRejected) && (
        <div className="flex flex-col items-center text-orange-600 mt-1">
          <span className="font-medium">
            {returned
              ? "Returned"
              : returnRejected
              ? "Return Rejected"
              : "Return Requested"}
          </span>
          <span className="text-xs">
            {formatDate(
              returned?.date || returnRejected?.date || returnRequested?.date
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default TrackStepper;
