const Pagination = ({ itemsPerPage, totalItems, currentPage, onPageChange }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <ul className="pagination">
                {pageNumbers.map((number) => (
                    <li key={number} className={number === currentPage ? 'active' : ''}>
                        <button className="pagination-btn" onClick={() => onPageChange(number)}>{number}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default Pagination;