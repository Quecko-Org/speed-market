import React, { FC } from "react";
import ReactPaginate from "react-paginate";

interface ActivityItem {
  _id: string;
  userId?: { displayName?: string; internalWalletAddress?: string; profileImage?: string } | string;
  cryptoSymbol?: string;
  amount?: string;
  betType?: "UP" | "DOWN";
  createdAt?: string;
}

interface ActivityProps {
  activities: ActivityItem[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getUserLabel(userId: ActivityItem["userId"]): string {
  if (!userId) return "Unknown";
  if (typeof userId === "string") return userId;
  if (userId.displayName) return userId.displayName;
  if (userId.internalWalletAddress) {
    const addr = userId.internalWalletAddress;
    return `${addr.slice(0, 6)}....${addr.slice(-4)}`;
  }
  return "Unknown";
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const Activity: FC<ActivityProps> = ({ activities, loading, currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (event: any) => {
    onPageChange(event.selected);
  };

  return (
    <>
      <h6 className="activityhead">Activity</h6>
      <div className="mainactivity">
        {loading ? (
          <p style={{ color: "#74728B", fontSize: 13, textAlign: "center", padding: 16 }}>
            Loading activity...
          </p>
        ) : activities.length === 0 ? (
          <p style={{ color: "#74728B", fontSize: 13, textAlign: "center", padding: 16 }}>
            No activity yet
          </p>
        ) : (
          activities.map((item) => (
            <div className="inneractivity" key={item._id}>
              <div className="leftactivity">
                <div className="userimg">
                  <img
                    src={(typeof item.userId === "object" && item.userId?.profileImage) || "/dummyassets/dummyuser.png"}
                    alt="user"
                    className="innerimg"
                  />
                </div>
                <p className="userpara">
                  {getUserLabel(item.userId)} placed a{" "}
                  <span className={item?.betType === "UP" ? "upstatus" : "downstatus"}>
                    {item.betType || "—"}
                  </span>{" "}
                  prediction for {item.cryptoSymbol || "—"} at ${Number(item.amount || 0).toFixed(2)}
                </p>
              </div>
              <p className="secondpara">{timeAgo(item.createdAt)}</p>
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <ReactPaginate
          previousLabel={"←"}
          nextLabel={"→"}
          breakLabel={"..."}
          pageCount={totalPages}
          forcePage={currentPage}
          marginPagesDisplayed={1}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      )}
    </>
  );
};

export default Activity;
