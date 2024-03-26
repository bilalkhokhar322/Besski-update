import React from "react";
import { Col, Container, Row } from "reactstrap";

const PaginationComponent = ({
  postsPerPage,
  totalPosts,
  currentPage,
  setCurrentPage,
}) => {
  const pageLimit = 10; // Number of pages to show at once
  const totalPageCount = Math.ceil(totalPosts / postsPerPage);
  const pageNumbers = Array.from({ length: totalPageCount }, (_, i) => i + 1);

  const handlePageClick = (pageNumber, event) => {
    event.preventDefault();
    setCurrentPage(pageNumber);
  };

  const startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
  const endPage = Math.min(startPage + pageLimit - 1, totalPageCount);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={4}>
          <ul className="pagination m-0">
            {currentPage > 1 && (
              <li className="page-item" style={{
                cursor:"pointer",
              }}>
                <span
                  className="page-link text-danger"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </span>
              </li>
            )}

            {startPage > 1 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}

            {pageNumbers.slice(startPage - 1, endPage).map((number) => (
              <li
                key={number}
                className={`page-item`}
                style={{ cursor: "pointer" }}
              >
                <span
                  onClick={(event) => handlePageClick(number, event)}
                  className={`page-link ${
                    currentPage === number
                      ? "text-danger fw-bold"
                      : "text-secondary"
                  }`}
                >
                  {number}
                </span>
              </li>
            ))}

            {endPage < totalPageCount && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}

            {currentPage < totalPageCount && (
              <li className="page-item cursor-pointer" style={{
                cursor:"pointer",
              }}>
                <span
                  className="page-link text-danger"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </span>
              </li>
            )}
          </ul>
        </Col>
      </Row>
    </Container>




  );
};

export default PaginationComponent;
