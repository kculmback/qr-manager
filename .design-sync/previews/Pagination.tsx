import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@qr-manager/ui";

export function Basic() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function WithEllipsis() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">14</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            15
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">16</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">92</PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function ScanLogFooter() {
  return (
    <div className="w-80 space-y-3">
      <p className="text-muted-foreground text-sm">
        Showing scans 51–100 of 4,812
      </p>
      <Pagination className="justify-between">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" text="Newer" />
          </PaginationItem>
        </PaginationContent>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext href="#" text="Older" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
