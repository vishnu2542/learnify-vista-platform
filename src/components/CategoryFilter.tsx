
import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { courseCategories } from "@/data/mockData";

interface CategoryFilterProps {
  selectedCategory: string;
  onChange: (category: string) => void;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onChange,
  className,
}) => {
  const categories = ["All Categories", ...courseCategories];

  return (
    <div className={className}>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex items-center gap-2 p-1">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              onClick={() => onChange(category)}
              className={cn(
                "rounded-full whitespace-nowrap",
                selectedCategory === category && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
