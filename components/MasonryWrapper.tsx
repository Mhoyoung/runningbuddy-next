"use client";

import Masonry from "react-masonry-css";

interface MasonryWrapperProps {
  children: React.ReactNode;
}

const MasonryWrapper = ({ children }: MasonryWrapperProps) => {
  const breakpointColumnsObj = {
    default: 2,
    768: 2,
    480: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex gap-3"
      columnClassName="flex flex-col gap-3"
    >
      {children}
    </Masonry>
  );
};

export default MasonryWrapper;
