"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";


import { CriteriaCard } from "../criteria-card/CriteriaCard";
import { CriteriaModal } from "../criteria-card/CriteriaModal";
import { useGetCriteria } from "@/api/criteria/criteria";
import { set } from "date-fns";

export const Criteria = () => {
    const [open, setOpen] = useState(false);

    const { data, isLoading } = useGetCriteria();
    const deleteCriteria = (id: string) => {
        console.log(id)
    };

    const editCriteria = (data: any) => {
        setOpen(true);
        console.log(data)
    };

    const criteria = data?.data || [];

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Criteria</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage evaluation criteria for tasks
                    </p>
                </div>

                <Button onClick={() => setOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Criteria
                </Button>
            </div>

            {/* Loading */}
            {isLoading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
            ) : criteria.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                    No criteria found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {criteria.map((item: any) => (
                        <CriteriaCard onDelete={deleteCriteria} onEdit={editCriteria} key={item.id} data={item} />
                    ))}
                </div>
            )}

            {/* Modal */}
            <CriteriaModal open={open} onClose={() => setOpen(false)} />
        </div>
    );
};