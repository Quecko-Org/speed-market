import React, { FC, useState } from "react";
import Icon from "../Icon";
import ReactPaginate from "react-paginate";

const Activity: FC = () => {
      const [currentPage, setCurrentPage] = useState(0);
    
      const handlePageClick = (event: any) => {
        setCurrentPage(event.selected);
      };
  return (
    <>
     <h6 className="activityhead">Activity</h6>
                <div className="mainactivity">
                  <div className="inneractivity">
                    <div className="leftactivity">
                      <div className="userimg">
                        <img
                          src="/dummyassets/dummyuser.png"
                          alt="innerimg"
                          className="innerimg"
                        />
                      </div>
                      <p className="userpara">
                        kgonzales placed a <span className="upstatus">Up</span>{" "}
                        prediction for BTC at $50.29
                      </p>
                    </div>
                    <p className="secondpara">4s ago</p>
                  </div>
                  <div className="inneractivity">
                    <div className="leftactivity">
                      <div className="userimg">
                        <img
                          src="/dummyassets/dummyuser.png"
                          alt="innerimg"
                          className="innerimg"
                        />
                      </div>
                      <p className="userpara">
                        0xadfc....9b9c placed a{" "}
                        <span className="downstatus">Down</span> prediction for
                        XRP at $35.48
                      </p>
                    </div>
                    <p className="secondpara">3s ago</p>
                  </div>
                  <div className="inneractivity">
                    <div className="leftactivity">
                      <div className="userimg">
                        <img
                          src="/dummyassets/dummyuser.png"
                          alt="innerimg"
                          className="innerimg"
                        />
                      </div>
                      <p className="userpara">
                        kgonzales placed a <span className="upstatus">Up</span>{" "}
                        prediction for BTC at $50.29
                      </p>
                    </div>
                    <p className="secondpara">4s ago</p>
                  </div>
                  <div className="inneractivity">
                    <div className="leftactivity">
                      <div className="userimg">
                        <img
                          src="/dummyassets/dummyuser.png"
                          alt="innerimg"
                          className="innerimg"
                        />
                      </div>
                      <p className="userpara">
                        0xadfc....9b9c placed a{" "}
                        <span className="downstatus">Down</span> prediction for
                        XRP at $35.48
                      </p>
                    </div>
                    <p className="secondpara">3s ago</p>
                  </div>
                </div>
                <ReactPaginate
                  previousLabel={"←"}
                  nextLabel={"→"}
                  breakLabel={"..."}
                  pageCount={15}
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
    </>
  );
};

export default Activity;
