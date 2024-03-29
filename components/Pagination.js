import Link from "next/dist/client/link"

export default function Pagination({ totalPages, currentPage }) {
  const prevPage = parseInt(currentPage) - 1 > 0
  const nextPage = parseInt(currentPage) + 1 <= parseInt(totalPages)

  return (
    <div className="pt-6 pb-8 space-y-2 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button rel="previous" className="cursor-auto disabled:opacity-50 dark:text-white" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link href={currentPage - 1 === 1 ? `/blog/` : `/blog/page/${currentPage - 1}`}>
            <button rel="previous" className="dark:text-white">Previous</button>
          </Link>
        )}
        <span className="dark:text-white">
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button rel="next" className="cursor-auto disabled:opacity-50 dark:text-white" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/blog/page/${currentPage + 1}`}>
            <button rel="next" className="dark:text-white">Next</button>
          </Link>
        )}
      </nav>
    </div>
  )
}