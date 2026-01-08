"use client";

import React from "react";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";

interface AdminActionToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: string;
  onFilterChange: (type: string) => void;
  onCreateNew: () => void;
}

const AdminActionToolbar: React.FC<AdminActionToolbarProps> = ({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  onCreateNew,
}) => {
  const filterOptions = [
    { label: "Tất cả môn", value: "all" },
    { label: "Toán Học", value: "Toán Học" },
    { label: "Ngữ Văn", value: "Ngữ Văn" },
    { label: "Tiếng Anh", value: "Tiếng Anh" },
    { label: "Vật Lý", value: "Vật Lý" },
    { label: "Hóa Học", value: "Hóa Học" },
    { label: "Sinh Học", value: "Sinh Học" },
    { label: "Lịch Sử", value: "Lịch Sử" },
    { label: "Địa Lý", value: "Địa Lý" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
      <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
        <Input
          type="text"
          placeholder="Tìm kiếm đề thi theo tên, môn học..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
          className="flex-1 min-w-[300px]"
        />

        <Dropdown
          options={filterOptions}
          value={filterType}
          onChange={(value) => onFilterChange(value)}
          className="w-full sm:w-48"
        />
      </div>

      <Button
        variant="primary"
        onClick={onCreateNew}
        icon={
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        }
      >
        Tạo đề thi mới
      </Button>
    </div>
  );
};

export default AdminActionToolbar;
