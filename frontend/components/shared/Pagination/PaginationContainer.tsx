import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import React from 'react'


interface PaginationContainerProps {
    currentPage: number;
    totalPage: number;
    onPageChange: (value: number) => void;
}

const PaginationContainer: React.FC<PaginationContainerProps> = ({
    currentPage,
    totalPage,
    onPageChange
}) => {
    const pageNumber = [...Array(totalPage).keys()].map((i) => i + 1)
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    {
                        currentPage !== 1 && (
                            <PaginationPrevious
                                href="#"
                                onClick={() => onPageChange(currentPage - 1)}
                            />
                        )
                    }
                </PaginationItem>
                <PaginationItem>
                    {
                        pageNumber.map((page, index) => (
                            <PaginationLink href="#"
                                key={index}
                                isActive={currentPage == page}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </PaginationLink>
                        ))
                    }
                </PaginationItem>
                {/** Ellipsis (if needed) */}
                {totalPage > 5 &&
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                }
                <PaginationItem>
                    {
                        currentPage !== totalPage && (
                            <PaginationNext href="#"
                                onClick={() => onPageChange(currentPage + 1)}
                            />
                        )
                    }
                </PaginationItem>
            </PaginationContent>
        </Pagination>

    )
}

export default PaginationContainer