/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@/webcomponents/reusable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  MoreVertical,
  Search,
  XCircle,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useCancelSubscriptionMutation,
  useChangeUserPlanMutation,
  useGetAdminSubscriptions,
} from "@/api/payment";
import { BillingPackage } from "./PackageCard";
import { AdminSubscription, SubscriptionParams } from "@/types/payment";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const STATUS_BADGE: Record<
  string,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
    icon: typeof CheckCircle;
  }
> = {
  ACTIVE: { variant: "default", label: "Active", icon: CheckCircle },
  CANCELLED: { variant: "destructive", label: "Cancelled", icon: XCircle },
  PAST_DUE: { variant: "outline", label: "Past Due", icon: AlertCircle },
  TRIALING: { variant: "secondary", label: "Trialing", icon: Zap },
};

const formatMoney = (value: number) =>
  (value / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (value: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const getStatusKey = (status: string) => status.replace(/\s+/g, "_").toUpperCase();

export const SubscribersTable = ({ packages }: { packages: BillingPackage[] }) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterBillingCycle, setFilterBillingCycle] = useState("all");
  const [changeDialogOpen, setChangeDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<AdminSubscription | null>(null);
  const [subscriptionToCancel, setSubscriptionToCancel] = useState<AdminSubscription | null>(null);
  const [nextPlanType, setNextPlanType] = useState<SubscriptionParams["planType"]>("FREE");
  const [nextBillingCycle, setNextBillingCycle] = useState<SubscriptionParams["billingCycle"]>("MONTHLY");
  const debouncedSearch = useDebounce(search, 350);

  const params = useMemo<SubscriptionParams>(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      planType: filterPlan === "all" ? undefined : (filterPlan as SubscriptionParams["planType"]),
      billingCycle:
        filterBillingCycle === "all"
          ? undefined
          : (filterBillingCycle as SubscriptionParams["billingCycle"]),
    }),
    [debouncedSearch, filterBillingCycle, filterPlan, page],
  );

  const { data, isLoading, isError, error, isFetching } = useGetAdminSubscriptions(params);
  const changePlanMutation = useChangeUserPlanMutation();
  const cancelSubscriptionMutation = useCancelSubscriptionMutation();

  const subscriptions = data?.data ?? [];
  const meta = data?.meta;
  const totalItems = meta?.total ?? 0;

  const activePlanOptions = packages.filter((pkg) => pkg.isActive);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterPlan, filterBillingCycle]);

  const handleFilter = (setter: (value: string) => void) => (value: string | null) => {
    if (!value) return;
    setter(value);
  };

  const openChangePlan = (subscription: AdminSubscription) => {
    setSelectedSubscription(subscription);
    setNextPlanType(subscription.plan.type as SubscriptionParams["planType"]);
    setNextBillingCycle((subscription.billingCycle ?? "MONTHLY") as SubscriptionParams["billingCycle"]);
    setChangeDialogOpen(true);
  };

  const closeChangePlan = () => {
    setChangeDialogOpen(false);
    setSelectedSubscription(null);
  };

  const closeCancelDialog = () => {
    setCancelDialogOpen(false);
    setSubscriptionToCancel(null);
  };

  const submitChangePlan = async () => {
    if (!selectedSubscription || !nextPlanType || !nextBillingCycle) return;

    try {
      await changePlanMutation.mutateAsync({
        userId: selectedSubscription.userId,
        changePlanBody: {
          planType: nextPlanType,
          billingCycle: nextBillingCycle,
        },
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["adminSubscriptions"] }),
        queryClient.invalidateQueries({ queryKey: ["adminBillingOverview"] }),
        queryClient.invalidateQueries({ queryKey: ["mySubscription"] }),
      ]);

      toast.success("Subscription plan updated successfully.");
      closeChangePlan();
    } catch (mutationError) {
      toast.error(mutationError instanceof Error ? mutationError.message : "Failed to update subscription plan.");
    }
  };

  const handleCancelSubscription = (subscription: AdminSubscription) => {
    setSubscriptionToCancel(subscription);
    setCancelDialogOpen(true);
  };

  const confirmCancelSubscription = async () => {
    if (!subscriptionToCancel) return;

    try {
      await cancelSubscriptionMutation.mutateAsync(subscriptionToCancel.userId);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["adminSubscriptions"] }),
        queryClient.invalidateQueries({ queryKey: ["adminBillingOverview"] }),
      ]);

      toast.success("Subscription canceled successfully.");
      closeCancelDialog();
    } catch (mutationError) {
      toast.error(mutationError instanceof Error ? mutationError.message : "Failed to cancel subscription.");
    }
  };

  const actionBusy = changePlanMutation.isPending || cancelSubscriptionMutation.isPending;

  return (
    <Card>
      <CardHeader className="bg-muted/40 rounded-t-lg px-6 py-4 border-b">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <CardTitle className="text-base">All Subscribers</CardTitle>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-8 w-full sm:w-48 h-9 text-sm"
              />
            </div>

            <Select value={filterPlan} onValueChange={handleFilter(setFilterPlan)}>
              <SelectTrigger className="w-32 h-9 text-sm">
                <SelectValue placeholder="All Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                {activePlanOptions.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.type}>
                    {pkg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterBillingCycle}
              onValueChange={handleFilter(setFilterBillingCycle)}
            >
              <SelectTrigger className="w-36 h-9 text-sm">
                <SelectValue placeholder="Billing Cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cycles</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="ANNUAL">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isError ? (
          <div className="px-6 py-10 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load subscribers."}
          </div>
        ) : isLoading ? (
          <div className="px-6 py-10 flex items-center justify-center text-sm text-muted-foreground gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading subscribers...
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20">
                  <TableHead className="pl-6">Teacher</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Billing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="pr-6 w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                      No subscribers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptions.map((subscription) => {
                    const statusKey = getStatusKey(subscription.billingStatus);
                    const status = STATUS_BADGE[statusKey] ?? STATUS_BADGE.ACTIVE;
                    const StatusIcon = status.icon;
                    const initials = `${subscription.user.firstName?.[0] ?? ""}${subscription.user.lastName?.[0] ?? ""}`.trim();

                    return (
                      <TableRow key={subscription.id}>
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {initials || "U"}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {subscription.user.firstName} {subscription.user.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">{subscription.user.email}</p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {subscription.plan.name}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {subscription.billingCycle ?? "—"}
                          </span>
                        </TableCell>

                        <TableCell>
                          <Badge variant={status.variant} className="gap-1 text-xs">
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(subscription.currentPeriodStart ?? subscription.createdAt)}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className={`text-sm font-semibold ${subscription.finalPrice > 0 ? "" : "text-muted-foreground"}`}>
                            {subscription.finalPrice > 0 ? `$${formatMoney(subscription.finalPrice)}` : "—"}
                          </span>
                        </TableCell>

                        <TableCell className="pr-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 text-muted-foreground"
                              disabled={actionBusy}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openChangePlan(subscription)}>
                                Change Plan
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleCancelSubscription(subscription)}
                              >
                                Cancel Subscription
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <div className="px-6 py-4 border-t">
              <Pagination
                page={meta?.page ?? page}
                totalItems={totalItems}
                pageSize={meta?.limit ?? PAGE_SIZE}
                onPageChange={setPage}
              />
              {isFetching && !isLoading ? (
                <div className="mt-2 text-xs text-muted-foreground">Refreshing data...</div>
              ) : null}
            </div>
          </>
        )}
      </CardContent>

      <Dialog open={changeDialogOpen} onOpenChange={(open) => !open && closeChangePlan()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Subscription Plan</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Plan</Label>
              <Select
                value={nextPlanType ?? undefined}
                onValueChange={(value) => setNextPlanType(value as SubscriptionParams["planType"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {activePlanOptions.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.type}>
                      {pkg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Billing Cycle</Label>
              <Select
                value={nextBillingCycle ?? undefined}
                onValueChange={(value) => setNextBillingCycle(value as SubscriptionParams["billingCycle"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="ANNUAL">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeChangePlan}>
              Cancel
            </Button>
            <Button onClick={submitChangePlan} disabled={changePlanMutation.isPending} className="gap-2">
              {changePlanMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={cancelDialogOpen} onOpenChange={(open) => !open && closeCancelDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              {subscriptionToCancel
                ? `Are you sure you want to cancel the subscription for ${subscriptionToCancel.user.firstName} ${subscriptionToCancel.user.lastName}?`
                : "Are you sure you want to cancel this subscription?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelSubscription}
              disabled={cancelSubscriptionMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelSubscriptionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Confirm Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
